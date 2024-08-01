"use client";

import { useState, useEffect } from 'react';

export default function LibroList() {
    const [libros, setLibros] = useState([]);
    const [form, setForm] = useState({ titulo: '', autor: '', genero: '', isbn: '', ejemplares: 1 });

    useEffect(() => {
        fetch('/api/libros')
            .then((res) => res.json())
            .then((data) => setLibros(data));
    }, []);

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const res = await fetch('/api/libros', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form),
        });
        const nuevoLibro = await res.json();
        setLibros([...libros, nuevoLibro]);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Lista de Libros</h1>
            <ul className="mb-4">
                {libros.map((libro) => (
                    <li key={libro.id} className="mb-2">
                        {libro.titulo} - {libro.autor}
                    </li>
                ))}
            </ul>
            <h2 className="text-xl font-semibold mb-2">Agregar Nuevo Libro</h2>
            <form onSubmit={handleSubmit} className="space-y-2">
                <input
                    type="text"
                    placeholder="Título"
                    value={form.titulo}
                    onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                    className="block w-full p-2 border border-gray-300 rounded"
                />
                <input
                    type="text"
                    placeholder="Autor"
                    value={form.autor}
                    onChange={(e) => setForm({ ...form, autor: e.target.value })}
                    className="block w-full p-2 border border-gray-300 rounded"
                />
                <input
                    type="text"
                    placeholder="Género"
                    value={form.genero}
                    onChange={(e) => setForm({ ...form, genero: e.target.value })}
                    className="block w-full p-2 border border-gray-300 rounded"
                />
                <input
                    type="text"
                    placeholder="ISBN"
                    value={form.isbn}
                    onChange={(e) => setForm({ ...form, isbn: e.target.value })}
                    className="block w-full p-2 border border-gray-300 rounded"
                />
                <input
                    type="number"
                    placeholder="Ejemplares"
                    value={form.ejemplares}
                    onChange={(e) => setForm({ ...form, ejemplares: Number(e.target.value) })}
                    className="block w-full p-2 border border-gray-300 rounded"
                />
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                    Agregar Libro
                </button>
            </form>
        </div>
    );
}
