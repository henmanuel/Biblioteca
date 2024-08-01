import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function notificarDisponibilidad(libroId) {
    const reserva = await prisma.reserva.findFirst({
        where: {
            libroId: libroId,
            estado: "pendiente",
        },
        orderBy: {
            fecha: 'asc',
        },
        include: {
            usuario: true,
            libro: true,
        }
    });

    if (reserva) {
        console.log(`Notificando a ${reserva.usuario.nombre} que el libro ${reserva.libro.titulo} está disponible.`);

        await prisma.reserva.update({
            where: { id: reserva.id },
            data: { estado: "notificado" },
        });
    }
}
