import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { addDays, differenceInDays } from 'date-fns';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const prestamos = await prisma.prestamo.findMany({
                where: {
                    fechaDevolucion: null,  // Solo obtener préstamos activos (no devueltos)
                },
                include: {
                    libro: true,
                    usuario: true,
                },
            });

            const prestamosConCalculos = prestamos.map(prestamo => {
                const fechaActual = new Date();
                const diasRestantes = differenceInDays(prestamo.fechaVencimiento, fechaActual);
                const multa = diasRestantes < 0 ? Math.abs(diasRestantes) * 1 : 0;

                return {
                    ...prestamo,
                    diasRestantes,
                    multa,
                };
            });

            res.status(200).json(prestamosConCalculos);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los préstamos' });
        }
    } else if (req.method === 'POST') {
        const { libroId, usuarioId } = req.body;

        try {
            const libro = await prisma.libro.findUnique({ where: { id: libroId } });

            if (!libro || libro.ejemplares === 0) {
                return res.status(400).json({ error: 'No hay ejemplares disponibles para este libro.' });
            }

            await prisma.libro.update({
                where: { id: libroId },
                data: { ejemplares: libro.ejemplares - 1 },
            });

            const nuevoPrestamo = await prisma.prestamo.create({
                data: {
                    libroId,
                    usuarioId,
                    fecha: new Date(),
                    fechaVencimiento: addDays(new Date(), 7),
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
    } else if (req.method === 'PUT') {
        const { id, fechaDevolucion } = req.body;

        try {
            const prestamo = await prisma.prestamo.update({
                where: { id: Number(id) },
                data: {
                    fechaDevolucion,
                    multa: differenceInDays(new Date(fechaDevolucion), new Date()) * 1,
                },
                include: {
                    libro: true,
                    usuario: true,
                },
            });

            await prisma.libro.update({
                where: { id: prestamo.libroId },
                data: { ejemplares: prestamo.libro.ejemplares + 1 },
            });

            res.status(200).json(prestamo);
        } catch (error) {
            res.status(500).json({ error: 'Error al registrar la devolución' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
        res.status(405).end(`Método ${req.method} no permitido`);
    }
}
