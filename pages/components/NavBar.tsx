import Link from 'next/link';

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
            </ul>
        </nav>
    );
}
