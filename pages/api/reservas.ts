import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { libroId, usuarioId } = req.body;

        if (!libroId || !usuarioId) {
            return res.status(400).json({ error: 'libroId y usuarioId son requeridos' });
        }

        try {
            const reservaExistente = await prisma.reserva.findFirst({
                where: {
                    libroId: libroId,
                    usuarioId: usuarioId,
                    estado: "pendiente",
                }
            });

            if (reservaExistente) {
                return res.status(400).json({ error: 'Ya has reservado este libro.' });
            }

            const nuevaReserva = await prisma.reserva.create({
                data: {
                    libroId,
                    usuarioId,
                    estado: "pendiente",
                }
            });

            res.status(201).json(nuevaReserva);
        } catch (error) {
            console.error('Error al crear la reserva:', error);
            res.status(500).json({ error: 'Error al crear la reserva' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Método ${req.method} no permitido`);
    }
}
