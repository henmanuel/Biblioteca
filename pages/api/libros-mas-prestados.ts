import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const libros = await prisma.prestamo.groupBy({
                by: ['libroId'],
                _count: {
                    libroId: true,
                },
                orderBy: {
                    _count: {
                        libroId: 'desc',
                    },
                },
                take: 10, // Muestra los 10 libros más prestados
            });

            const librosConDetalles = await Promise.all(
                libros.map(async (libro) => {
                    const detallesLibro = await prisma.libro.findUnique({
                        where: { id: libro.libroId },
                    });
                    return { ...detallesLibro, totalPrestamos: libro._count.libroId };
                })
            );

            res.status(200).json(librosConDetalles);
        } catch (error) {
            res.status(500).json({ error: 'Error al generar el informe' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Método ${req.method} no permitido`);
    }
}
