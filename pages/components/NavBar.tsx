"use client";

import Link from 'next/link';
import { signOut } from 'next-auth/react';

export default function NavBar() {
    return (
        <nav className="bg-gray-800 p-4">
            <ul className="flex space-x-4">
                <li>
                    <Link href="/" className="text-white">
                        Libros
                    </Link>
                </li>
                <li>
                    <Link href="/usuarios" className="text-white">
                        Usuarios
                    </Link>
                </li>
                <li>
                    <Link href="/prestamos" className="text-white">
                        Préstamos
                    </Link>
                </li>
                <li>
                    <Link href="/reservas" className="text-white">
                        Reservas
                    </Link>
                </li>
                <li>
                    <Link href="/informes" className="text-white">
                        Informes
                    </Link>
                </li>
                <li>
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded"
                    >
                        Cerrar Sesión
                    </button>
                </li>
            </ul>
        </nav>
    );
}
