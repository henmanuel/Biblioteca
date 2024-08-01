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
        const { nombre, rol } = req.body;

        try {
            const nuevoUsuario = await prisma.usuario.create({
                data: {
                    nombre,
                    rol,
                },
            });
            res.status(201).json(nuevoUsuario);
        } catch (error) {
            res.status(500).json({ error: 'Error al crear el usuario' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Método ${req.method} no permitido`);
    }
}
