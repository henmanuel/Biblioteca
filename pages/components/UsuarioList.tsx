"use client";

import { useState, useEffect } from 'react';

export default function UsuarioList() {
    const [usuarios, setUsuarios] = useState([]);
    const [form, setForm] = useState({ id: '', nombre: '', email: '', rol: 'usuario' });
    const [editMode, setEditMode] = useState(false);
    const [historial, setHistorial] = useState([]);
    const [showHistorial, setShowHistorial] = useState(false);

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        const res = await fetch('/api/usuarios');
        const data = await res.json();
        setUsuarios(data);
    };

    const fetchHistorial = async (usuarioId) => {
        const res = await fetch(`/api/historial?usuarioId=${usuarioId}`);
        const data = await res.json();
        setHistorial(data);
        setShowHistorial(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editMode) {
            await fetch(`/api/usuarios`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });
        } else {
            await fetch('/api/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });
        }
        fetchUsuarios();
        resetForm();
    };

    const handleEdit = (usuario) => {
        setForm(usuario);
        setEditMode(true);
    };

    const handleDelete = async (id) => {
        const confirmDelete = confirm("¿Estás seguro de que deseas eliminar este usuario?");
        if (confirmDelete) {
            await fetch(`/api/usuarios?id=${id}`, {
                method: 'DELETE',
            });
            fetchUsuarios();
        }
    };

    const resetForm = () => {
        setForm({ id: '', nombre: '', email: '', rol: 'usuario' });
        setEditMode(false);
    };

    return (
        <div className="p-4 text-white">
            <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>
            <ul className="mb-4">
                {usuarios.map((usuario) => (
                    <li key={usuario.id} className="mb-2">
                        {usuario.nombre} - {usuario.email}
                        <button onClick={() => handleEdit(usuario)} className="ml-2 text-blue-300 hover:text-blue-500">Editar</button>
                        <button onClick={() => handleDelete(usuario.id)} className="ml-2 text-red-300 hover:text-red-500">Eliminar</button>
                        <button onClick={() => fetchHistorial(usuario.id)} className="ml-2 text-green-300 hover:text-green-500">Ver Historial</button>
                    </li>
                ))}
            </ul>
            <h2 className="text-xl font-semibold mb-2">{editMode ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Nombre"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    className="block w-full p-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="block w-full p-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                    required
                />
                <select
                    value={form.rol}
                    onChange={(e) => setForm({ ...form, rol: e.target.value })}
                    className="block w-full p-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                >
                    <option value="usuario">Usuario</option>
                    <option value="admin">Administrador</option>
                </select>
                <div className="flex space-x-4">
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        {editMode ? 'Actualizar Usuario' : 'Agregar Usuario'}
                    </button>
                    {editMode && (
                        <button onClick={resetForm} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                            Cancelar
                        </button>
                    )}
                </div>
            </form>

            {showHistorial && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Historial de Préstamos y Devoluciones</h2>
                    <ul>
                        {historial.map((item, index) => (
                            <li key={index} className="mb-2">
                                {item.libro.titulo} - Prestado el {new Date(item.fecha).toLocaleDateString()} {item.fechaDevolucion && `y devuelto el ${new Date(item.fechaDevolucion).toLocaleDateString()}`}
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => setShowHistorial(false)} className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Cerrar Historial</button>
                </div>
            )}
        </div>
    );
}
