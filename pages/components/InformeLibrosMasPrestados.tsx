"use client";

import { useState, useEffect } from 'react';

export default function InformeLibrosMasPrestados() {
    const [libros, setLibros] = useState([]);

    useEffect(() => {
        fetch('/api/libros-mas-prestados')
            .then((res) => res.json())
            .then((data) => setLibros(data));
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Libros Más Prestados</h1>
            <ul className="mb-4">
                {libros.map((libro) => (
                    <li key={libro.id} className="mb-2">
                        {libro.titulo} - {libro.autor} (Prestado {libro.totalPrestamos} veces)
                    </li>
                ))}
            </ul>
        </div>
    );
}
