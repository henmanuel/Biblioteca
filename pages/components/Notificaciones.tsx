"use client";

import { useState, useEffect } from 'react';

export default function Notificaciones() {
    const [notificaciones, setNotificaciones] = useState([]);

    useEffect(() => {
        fetchNotificaciones();

        const intervalId = setInterval(() => {
            fetchNotificaciones();
        }, 30000); // 30000ms = 30s

        return () => clearInterval(intervalId);
    }, []);

    const fetchNotificaciones = async () => {
        try {
            const res = await fetch('/api/notificaciones');
            const data = await res.json();
            setNotificaciones(data);
        } catch (error) {
            console.error('Error al obtener las notificaciones:', error);
        }
    };

    const handleDismiss = (id) => {
        setNotificaciones(notificaciones.filter(notificacion => notificacion.id !== id));
    };

    return (
        <div className="fixed top-0 right-0 m-4 space-y-4">
            {notificaciones.map((notificacion) => (
                <div key={notificacion.id} className="bg-blue-600 text-white p-4 rounded shadow-lg">
                    <p>{notificacion.mensaje}</p>
                    <button
                        onClick={() => handleDismiss(notificacion.id)}
                        className="mt-2 bg-red-500 text-white px-2 py-1 rounded"
                    >
                        Dismiss
                    </button>
                </div>
            ))}
        </div>
    );
}
