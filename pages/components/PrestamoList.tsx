"use client";

import { useState, useEffect } from 'react';
import Select from 'react-select';

export default function PrestamoList() {
    const [prestamos, setPrestamos] = useState([]);
    const [libros, setLibros] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [selectedLibro, setSelectedLibro] = useState(null);
    const [selectedUsuario, setSelectedUsuario] = useState(null);

    useEffect(() => {
        fetchLibros();
        fetchUsuarios();
        fetchPrestamos();
    }, []);

    const fetchLibros = async () => {
        const res = await fetch('/api/libros');
        const data = await res.json();
        setLibros(data.map(libro => ({ value: libro.id, label: `${libro.titulo} - ${libro.autor}` })));
    };

    const fetchUsuarios = async () => {
        const res = await fetch('/api/usuarios');
        const data = await res.json();
        setUsuarios(data.map(usuario => ({ value: usuario.id, label: `${usuario.nombre} - ${usuario.email}` })));
    };

    const fetchPrestamos = async () => {
        const res = await fetch('/api/prestamos');
        const data = await res.json();
        setPrestamos(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch(`/api/prestamos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                libroId: selectedLibro.value,
                usuarioId: selectedUsuario.value,
            }),
        });
        if (res.ok) {
            fetchPrestamos();
            setSelectedLibro(null);
            setSelectedUsuario(null);
        } else {
            console.error('Error al registrar el préstamo');
        }
    };

    const handleReturn = async (id) => {
        const confirmReturn = confirm("¿Estás seguro de que deseas devolver este libro?");
        if (confirmReturn) {
            const res = await fetch(`/api/prestamos?id=${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                fetchPrestamos();
            } else {
                console.error('Error al devolver el libro');
            }
        }
    };

    const customStyles = {
        control: (provided) => ({
            ...provided,
            backgroundColor: '#1a1a1a',
            borderColor: '#333',
            color: '#fff',
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: '#1a1a1a',
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#fff',
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#aaa',
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#333' : state.isFocused ? '#444' : '#1a1a1a',
            color: '#fff',
        }),
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Gestión de Préstamos</h1>
            <h2 className="text-xl font-semibold mb-4">Lista de Préstamos</h2>
            <ul className="mb-8">
                {prestamos.map((prestamo) => (
                    <li key={prestamo.id} className="mb-2">
                        {prestamo.usuario.nombre} prestó {prestamo.libro.titulo} el {new Date(prestamo.fecha).toLocaleDateString()}
                        {prestamo.multa > 0 && (
                            <span className="text-red-500"> - Multa: ${prestamo.multa.toFixed(2)}</span>
                        )}
                        <button
                            onClick={() => handleReturn(prestamo.id)}
                            className="ml-4 text-red-500 hover:text-red-700"
                        >
                            Devolver
                        </button>
                    </li>
                ))}
            </ul>

            <h2 className="text-xl font-semibold mb-2">Registrar Nuevo Préstamo</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Select
                    value={selectedLibro}
                    onChange={setSelectedLibro}
                    options={libros}
                    placeholder="Seleccionar Libro"
                    styles={customStyles}
                    isSearchable
                />
                <Select
                    value={selectedUsuario}
                    onChange={setSelectedUsuario}
                    options={usuarios}
                    placeholder="Seleccionar Usuario"
                    styles={customStyles}
                    isSearchable
                />
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Registrar Préstamo
                </button>
            </form>
        </div>
    );
}
