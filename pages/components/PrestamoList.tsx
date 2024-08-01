"use client";

import { useState, useEffect } from 'react';
import Select from 'react-select';

export default function PrestamoList() {
    const [prestamos, setPrestamos] = useState([]);
    const [selectedLibro, setSelectedLibro] = useState(null);
    const [selectedUsuario, setSelectedUsuario] = useState(null);
    const [libros, setLibros] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [mensajeError, setMensajeError] = useState('');

    useEffect(() => {
        fetchPrestamos().then();
        fetchLibros().then();
        fetchUsuarios().then();
    }, []);

    const fetchPrestamos = async () => {
        const res = await fetch('/api/prestamos');
        const data = await res.json();
        setPrestamos(data);
    };

    const fetchLibros = async () => {
        const res = await fetch('/api/libros');
        const data = await res.json();
        setLibros(data);
    };

    const fetchUsuarios = async () => {
        const res = await fetch('/api/usuarios');
        const data = await res.json();
        setUsuarios(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedLibro && selectedUsuario) {
            const libroDisponible = libros.find(libro => libro.id === selectedLibro.value);
            const prestamoExistente = prestamos.find(prestamo => prestamo.libroId === selectedLibro.value && prestamo.usuarioId === selectedUsuario.value);

            if (libroDisponible.ejemplares === 0) {
                setMensajeError('No hay ejemplares disponibles para prestar.');
                return;
            }

            if (prestamoExistente) {
                setMensajeError('Este usuario ya tiene prestado este libro.');
                return;
            }

            await fetch('/api/prestamos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    libroId: selectedLibro.value,
                    usuarioId: selectedUsuario.value,
                }),
            });

            await fetchPrestamos();
            setSelectedLibro(null);
            setSelectedUsuario(null);
            setMensajeError('');
        }
    };

    const handleDevolucion = async (prestamoId) => {
        const confirmDevolucion = confirm("¿Estás seguro de que deseas devolver este libro?");
        if (confirmDevolucion) {
            const response = await fetch(`/api/prestamos`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: prestamoId, fechaDevolucion: new Date() }),
            });

            if (response.ok) {
                setPrestamos(prevPrestamos => prevPrestamos.filter(prestamo => prestamo.id !== prestamoId));
            } else {
                console.error('Error al devolver el préstamo');
            }
        }
    };

    const customStyles = {
        control: (provided) => ({
            ...provided,
            backgroundColor: '#1e293b',
            borderColor: '#475569',
            color: '#ffffff',
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#ffffff',
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#1e40af' : '#1e293b',
            color: '#ffffff',
        }),
    };

    return (
        <div className="p-4 text-white">
            <h1 className="text-2xl font-bold mb-4">Gestión de Préstamos</h1>
            <h2 className="text-xl font-semibold mb-4">Lista de Préstamos</h2>
            <ul className="mb-4">
                {prestamos.map((prestamo) => (
                    <li key={prestamo.id} className="mb-2">
                        {prestamo.usuario.nombre} prestó {prestamo.libro.titulo} el {new Date(prestamo.fecha).toLocaleDateString()}
                        <br />
                        Días restantes: {prestamo.diasRestantes} días
                        <br />
                        Multa: ${prestamo.multa}
                        <button onClick={() => handleDevolucion(prestamo.id)} className="ml-2 text-green-300 hover:text-green-500">
                            Devolver
                        </button>
                    </li>
                ))}
            </ul>

            <h2 className="text-xl font-semibold mb-4">Registrar Nuevo Préstamo</h2>
            {mensajeError && <div className="mb-4 text-red-500">{mensajeError}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <Select
                    value={selectedLibro}
                    onChange={setSelectedLibro}
                    options={libros.map(libro => ({ value: libro.id, label: `${libro.titulo} (${libro.ejemplares} ejemplares disponibles)` }))}
                    placeholder="Seleccionar Libro"
                    styles={customStyles}
                    isSearchable
                />
                <Select
                    value={selectedUsuario}
                    onChange={setSelectedUsuario}
                    options={usuarios.map(usuario => ({ value: usuario.id, label: usuario.nombre }))}
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
