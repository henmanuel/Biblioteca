"use client";

import { useState, useEffect } from 'react';

export default function LibroList() {
    const [libros, setLibros] = useState([]);
    const [form, setForm] = useState({ id: '', titulo: '', autor: '', genero: '', isbn: '', ejemplares: 1 });
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        fetchLibros();
    }, []);

    const fetchLibros = async () => {
        const res = await fetch('/api/libros');
        const data = await res.json();
        setLibros(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editMode) {
            await fetch(`/api/libros`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });
        } else {
            await fetch('/api/libros', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });
        }
        fetchLibros();
        resetForm();
    };

    const handleEdit = (libro) => {
        setForm(libro);
        setEditMode(true);
    };

    const handleDelete = async (id) => {
        const confirmDelete = confirm("¿Estás seguro de que deseas eliminar este libro?");
        if (confirmDelete) {
            await fetch(`/api/libros?id=${id}`, {
                method: 'DELETE',
            });
            fetchLibros();
        }
    };

    const resetForm = () => {
        setForm({ id: '', titulo: '', autor: '', genero: '', isbn: '', ejemplares: 1 });
        setEditMode(false);
    };

    return (
        <div className="p-4 text-white">
            <h1 className="text-3xl font-bold mb-6">Sistema de Gestión de Biblioteca</h1>
            <h2 className="text-2xl font-semibold mb-4">Lista de Libros</h2>
            <ul className="mb-8">
                {libros.map((libro) => (
                    <li key={libro.id} className="mb-2">
                        {libro.titulo} - {libro.autor} (Disponibles: {libro.disponibles}, Prestados: {libro.prestados})
                        <button onClick={() => handleEdit(libro)} className="ml-2 text-blue-300 hover:text-blue-500">Editar</button>
                        <button onClick={() => handleDelete(libro.id)} className="ml-2 text-red-300 hover:text-red-500">Eliminar</button>
                    </li>
                ))}
            </ul>
            <h2 className="text-xl font-semibold mb-2">{editMode ? 'Editar Libro' : 'Agregar Nuevo Libro'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Título"
                    value={form.titulo}
                    onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                    className="block w-full p-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                    required
                />
                <input
                    type="text"
                    placeholder="Autor"
                    value={form.autor}
                    onChange={(e) => setForm({ ...form, autor: e.target.value })}
                    className="block w-full p-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                    required
                />
                <input
                    type="text"
                    placeholder="Género"
                    value={form.genero}
                    onChange={(e) => setForm({ ...form, genero: e.target.value })}
                    className="block w-full p-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                    required
                />
                <input
                    type="text"
                    placeholder="ISBN"
                    value={form.isbn}
                    onChange={(e) => setForm({ ...form, isbn: e.target.value })}
                    className="block w-full p-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                    required
                />
                <input
                    type="number"
                    placeholder="Ejemplares"
                    value={form.ejemplares}
                    onChange={(e) => setForm({ ...form, ejemplares: Number(e.target.value) })}
                    className="block w-full p-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                />
                <div className="flex space-x-4">
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        {editMode ? 'Actualizar Libro' : 'Agregar Libro'}
                    </button>
                    {editMode && (
                        <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
