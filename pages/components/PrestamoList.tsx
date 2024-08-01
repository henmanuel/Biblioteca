"use client";

import { useState, useEffect } from 'react';

export default function PrestamoList() {
    const [prestamos, setPrestamos] = useState([]);

    useEffect(() => {
        fetch('/api/prestamos')
            .then((res) => res.json())
            .then((data) => setPrestamos(data));
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Lista de Préstamos</h1>
            <ul className="mb-4">
                {prestamos.map((prestamo) => (
                    <li key={prestamo.id} className="mb-2">
                        {prestamo.usuario.nombre} prestó {prestamo.libro.titulo} el {new Date(prestamo.fecha).toLocaleDateString()}
                    </li>
                ))}
            </ul>
        </div>
    );
}
