# Sistema de Gestión de Biblioteca

Este proyecto es un Sistema de Gestión de Biblioteca desarrollado con Next.js, TypeScript, Prisma y NextAuth.js. El sistema permite gestionar el inventario de libros, los usuarios, los préstamos y las reservas en una biblioteca.

## Getting Started

### 1. Ejecutar una Instancia de PostgreSQL con Docker

Primero, necesitas ejecutar una instancia de PostgreSQL utilizando Docker con las siguientes credenciales:

- **Usuario:** `henma`
- **Contraseña:** `01234567890`
- **Base de datos:** `biblioteca`

Puedes hacer esto ejecutando el siguiente comando en tu terminal:

```bash
docker run --name postgres -e POSTGRES_USER=henma -e POSTGRES_PASSWORD=01234567890 -e POSTGRES_DB=biblioteca -p 5432:5432 -d postgres:13
```

Este comando crea y ejecuta un contenedor de PostgreSQL en el puerto `5432`.

### 2. Instalar Dependencias

Asegúrate de tener Node.js y Yarn instalados en tu sistema. Luego, instala las dependencias del proyecto:

```bash
yarn install
```

### 3. Ejecutar Migraciones de Prisma

Ejecuta las migraciones para configurar la base de datos:

```bash
npx prisma migrate dev --name init
```

### 4. Levantar el Proyecto

Finalmente, puedes levantar el proyecto en modo de desarrollo ejecutando:

```bash
yarn dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

### 5. Acceder a la Aplicación

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado.

Puedes empezar a editar la página modificando `app/page.tsx`. La página se actualiza automáticamente a medida que editas el archivo.

Este proyecto utiliza [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) para optimizar y cargar automáticamente Inter, una fuente personalizada de Google.

## Instrucciones Adicionales

### Leer el Documento PDF

- Asegúrate de leer el documento PDF adjunto que contiene todos los detalles importantes del proyecto.
- El documento cubre aspectos como la descripción del proyecto, la metodología utilizada, los resultados obtenidos y las conclusiones.

### Ver el Video

- Además, es crucial que veas el video adjunto, que proporciona una explicación visual del proyecto.
- El video incluye una demostración práctica, un recorrido por la interfaz de usuario y una explicación detallada de las características implementadas.

Ambos recursos te proporcionarán una comprensión completa del proyecto. Si tienes alguna pregunta, no dudes en contactar al autor.
