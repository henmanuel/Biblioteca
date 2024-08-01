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
                {/* Formulario de creación y edición */}
            </form>
        </div>
    );
}
