import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const prestamos = await prisma.prestamo.findMany({
                include: {
                    libro: true,
                    usuario: true,
                },
            });
            res.status(200).json(prestamos);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los préstamos' });
        }
    } else if (req.method === 'POST') {
        const { libroId, usuarioId } = req.body;

        try {
            const nuevoPrestamo = await prisma.prestamo.create({
                data: {
                    libroId,
                    usuarioId,
                    fecha: new Date(),
                },
                include: {
                    libro: true,
                    usuario: true,
                },
            });
            res.status(201).json(nuevoPrestamo);
        } catch (error) {
            res.status(500).json({ error: 'Error al registrar el préstamo' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Método ${req.method} no permitido`);
    }
}
