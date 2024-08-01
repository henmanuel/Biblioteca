"use client";

import { useState, useEffect } from 'react';

export default function UsuarioList() {
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        fetch('/api/usuarios')
            .then((res) => res.json())
            .then((data) => setUsuarios(data));
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Lista de Usuarios</h1>
            <ul className="mb-4">
                {usuarios.map((usuario) => (
                    <li key={usuario.id} className="mb-2">
                        {usuario.nombre} - {usuario.rol}
                    </li>
                ))}
            </ul>
        </div>
    );
}
