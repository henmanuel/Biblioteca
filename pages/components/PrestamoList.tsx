"use client";

import { useState, useEffect } from 'react';
import Select from 'react-select';

export default function PrestamoList() {
    const [prestamos, setPrestamos] = useState([]);
    const [selectedLibro, setSelectedLibro] = useState(null);
    const [selectedUsuario, setSelectedUsuario] = useState(null);
    const [libros, setLibros] = useState([]);
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        fetch('/api/prestamos')
            .then((res) => res.json())
            .then((data) => setPrestamos(data));

        fetch('/api/libros')
            .then((res) => res.json())
            .then((data) => setLibros(data));

        fetch('/api/usuarios')
            .then((res) => res.json())
            .then((data) => setUsuarios(data));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedLibro && selectedUsuario) {
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

            fetch('/api/prestamos')
                .then((res) => res.json())
                .then((data) => setPrestamos(data));

            setSelectedLibro(null);
            setSelectedUsuario(null);
        }
    };

    const customStyles = {
        control: (provided) => ({
            ...provided,
            backgroundColor: '#1e293b', // Cambiar el color de fondo
            borderColor: '#475569', // Cambiar el color del borde
            color: '#ffffff', // Cambiar el color del texto
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#1e40af' : '#1e293b', // Cambiar el color de la opción seleccionada
            color: '#ffffff', // Cambiar el color del texto
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
                    </li>
                ))}
            </ul>

            <h2 className="text-xl font-semibold mb-4">Registrar Nuevo Préstamo</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Select
                    value={selectedLibro}
                    onChange={setSelectedLibro}
                    options={libros.map(libro => ({ value: libro.id, label: libro.titulo }))}
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
