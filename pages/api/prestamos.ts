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

        const diasPrestamo = 14; // Número de días de préstamo
        const fechaVencimiento = new Date();
        fechaVencimiento.setDate(fechaVencimiento.getDate() + diasPrestamo);

        try {
            const nuevoPrestamo = await prisma.prestamo.create({
                data: {
                    libroId,
                    usuarioId,
                    fechaVencimiento,
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
    } else if (req.method === 'DELETE') {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: 'ID del préstamo es obligatorio' });
        }

        try {
            const prestamo = await prisma.prestamo.findUnique({
                where: { id: Number(id) },
            });

            if (!prestamo) {
                return res.status(404).json({ error: 'Préstamo no encontrado' });
            }

            const hoy = new Date();
            let multa = 0.0;

            if (hoy > prestamo.fechaVencimiento) {
                const diasRetraso = Math.ceil((hoy.getTime() - prestamo.fechaVencimiento.getTime()) / (1000 * 60 * 60 * 24));
                multa = diasRetraso * 1.0; // Por ejemplo, $1 por día de retraso
            }

            await prisma.prestamo.update({
                where: { id: Number(id) },
                data: {
                    multa,
                },
            });

            await prisma.prestamo.delete({
                where: { id: Number(id) },
            });

            res.status(204).end();
        } catch (error) {
            console.error('Error al devolver el libro:', error);
            res.status(500).json({ error: 'Error al devolver el libro' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        res.status(405).end(`Método ${req.method} no permitido`);
    }
}
