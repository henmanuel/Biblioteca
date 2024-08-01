import LibroList from '../pages/components/LibroList';

export default function Home() {
  return (
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Sistema de Gestión de Biblioteca</h1>
        <LibroList />
      </main>
  );
}
