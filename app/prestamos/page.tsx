import PrestamoList from "@/pages/components/PrestamoList";

export default function PrestamosPage() {
    return (
        <main className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Gestión de Préstamos</h1>
            <PrestamoList/>
        </main>
    );
}
