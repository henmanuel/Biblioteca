import UsuarioList from "@/pages/components/UsuarioList";

export default function UsuariosPage() {
    return (
        <main className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>
            <UsuarioList/>
        </main>
    );
}
