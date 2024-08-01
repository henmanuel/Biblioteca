import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const notificaciones = await prisma.reserva.findMany({
                where: {
                    estado: "pendiente",
                },
                include: {
                    usuario: true,
                    libro: true,
                },
                orderBy: {
                    fecha: 'asc',
                },
            });

            const formattedNotificaciones = notificaciones.map((reserva) => ({
                id: reserva.id,
                mensaje: `El libro "${reserva.libro.titulo}" que reservaste está disponible.`,
                usuario: reserva.usuario.nombre,
            }));

            res.status(200).json(formattedNotificaciones);
        } catch (error) {
            console.error('Error al obtener las notificaciones:', error);
            res.status(500).json({ error: 'Error al obtener las notificaciones' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Método ${req.method} no permitido`);
    }
}
