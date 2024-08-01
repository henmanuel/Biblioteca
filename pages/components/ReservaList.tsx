"use client";

import { useState, useEffect } from 'react';
import Select from 'react-select';

export default function ReservaList() {
    const [libros, setLibros] = useState([]);
    const [selectedLibro, setSelectedLibro] = useState(null);
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        fetchLibros();
    }, []);

    const fetchLibros = async () => {
        try {
            const res = await fetch('/api/libros');
            const data = await res.json();
            setLibros(data);
        } catch (error) {
            console.error('Error al obtener los libros:', error);
        }
    };

    const handleReserva = async () => {
        if (!selectedLibro) {
            setMensaje('Por favor selecciona un libro.');
            return;
        }

        try {
            const res = await fetch('/api/reservas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    libroId: selectedLibro.value,
                    usuarioId: 1, // Debes cambiar esto por el ID del usuario autenticado
                }),
            });

            if (res.ok) {
                setMensaje('Reserva realizada exitosamente.');
            } else {
                const data = await res.json();
                setMensaje(data.error || 'Error al realizar la reserva.');
            }
        } catch (error) {
            console.error('Error al realizar la reserva:', error);
            setMensaje('Error al realizar la reserva.');
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
            <h1 className="text-2xl font-bold mb-4">Reservar un Libro</h1>
            <Select
                value={selectedLibro}
                onChange={setSelectedLibro}
                options={libros.map(libro => ({ value: libro.id, label: `${libro.titulo} (${libro.ejemplares} ejemplares disponibles)` }))}
                placeholder="Seleccionar Libro"
                styles={customStyles}
                isSearchable
            />
            <button onClick={handleReserva} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Reservar Libro
            </button>
            {mensaje && <div className="mt-4 text-yellow-300">{mensaje}</div>}
        </div>
    );
}
