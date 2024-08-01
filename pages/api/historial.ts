import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { usuarioId } = req.query;

    if (!usuarioId) {
        return res.status(400).json({ error: 'Usuario ID es requerido' });
    }

    try {
        const historial = await prisma.prestamo.findMany({
            where: { usuarioId: Number(usuarioId) },
            include: { libro: true },
        });
        res.status(200).json(historial);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el historial' });
    }
}
