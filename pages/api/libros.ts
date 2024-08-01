import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const libros = await prisma.libro.findMany();
            res.status(200).json(libros);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los libros' });
        }
    } else if (req.method === 'POST') {
        const { titulo, autor, genero, isbn, ejemplares } = req.body;

        if (!titulo || !autor || !genero || !isbn) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        try {
            const nuevoLibro = await prisma.libro.create({
                data: {
                    titulo,
                    autor,
                    genero,
                    isbn,
                    ejemplares: ejemplares || 1,
                },
            });
            res.status(201).json(nuevoLibro);
        }catch (error) {
            console.error('Error al crear el libro:', error);
            res.status(500).json({ error: 'Error al crear el libro', details: error.message });
        }
    } else if (req.method === 'PUT') {
        const { id, titulo, autor, genero, isbn, ejemplares } = req.body;

        if (!id || !titulo || !autor || !genero || !isbn) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        try {
            const libroActualizado = await prisma.libro.update({
                where: { id: Number(id) },
                data: {
                    titulo,
                    autor,
                    genero,
                    isbn,
                    ejemplares,
                },
            });
            res.status(200).json(libroActualizado);
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar el libro' });
        }
    } else if (req.method === 'DELETE') {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: 'ID del libro es obligatorio' });
        }

        try {
            await prisma.libro.delete({
                where: { id: Number(id) },
            });
            res.status(204).end();
        } catch (error) {
            console.error('Error al eliminar el libro:', error);
            res.status(500).json({ error: 'Error al eliminar el libro' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Método ${req.method} no permitido`);
    }
}
