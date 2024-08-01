import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const usuarios = await prisma.usuario.findMany();
            res.status(200).json(usuarios);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los usuarios' });
        }
    } else if (req.method === 'POST') {
        const { nombre, email, rol } = req.body;

        if (!nombre || !email) {
            return res.status(400).json({ error: 'Nombre y email son obligatorios' });
        }

        try {
            const nuevoUsuario = await prisma.usuario.create({
                data: {
                    nombre,
                    email,
                    rol: rol || "usuario",
                },
            });
            res.status(201).json(nuevoUsuario);
        }catch (error) {
            console.error('Error al crear el usuario:', error);
            res.status(500).json({ error: 'Error al crear el usuario', details: error.message });
        }
    } else if (req.method === 'PUT') {
        const { id, nombre, email, rol } = req.body;

        if (!id || !nombre || !email) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        try {
            const usuarioActualizado = await prisma.usuario.update({
                where: { id: Number(id) },
                data: {
                    nombre,
                    email,
                    rol,
                },
            });
            res.status(200).json(usuarioActualizado);
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar el usuario' });
        }
    } else if (req.method === 'DELETE') {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: 'ID del usuario es obligatorio' });
        }

        try {
            await prisma.usuario.delete({
                where: { id: Number(id) },
            });
            res.status(204).end();
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar el usuario' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Método ${req.method} no permitido`);
    }
}
