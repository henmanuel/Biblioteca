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

        try {
            const nuevoLibro = await prisma.libro.create({
                data: {
                    titulo,
                    autor,
                    genero,
                    isbn,
                    ejemplares,
                },
            });
            res.status(201).json(nuevoLibro);
        } catch (error) {
            res.status(500).json({ error: 'Error al crear el libro' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Método ${req.method} no permitido`);
    }
}
