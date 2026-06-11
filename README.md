# Vector Sur

Sitio web de la comunidad **Vector Sur** de Infinity (juego de miniaturas). Construido con Next.js 14, Drizzle ORM y SQLite.

---

## Requisitos

- Node.js 18+
- npm

---

## Instalación

```bash
npm install
```

Copia el fichero de entorno y ajusta los valores:

```bash
cp .env.local.example .env.local
```

Variables necesarias en `.env`:

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | `file:./dev.db` en local · URL de Turso en producción |
| `TURSO_AUTH_TOKEN` | Solo en producción (Turso) |
| `NEXTAUTH_SECRET` | Clave secreta para NextAuth |
| `NEXTAUTH_URL` | URL base de la app (`http://localhost:3000` en local) |

---

## Comandos de desarrollo

### Aplicación

| Comando | Descripción |
|---|---|
| `npm run dev` | Arranca el servidor de desarrollo en `http://localhost:3000` |
| `npm run build` | Genera la build de producción |
| `npm start` | Arranca el servidor de producción (requiere build previa) |
| `npm run lint` | Ejecuta el linter (ESLint) |

### Base de datos

| Comando | Descripción |
|---|---|
| `npm run seed` | Puebla la base de datos con datos de ejemplo |
| `npm run db:generate` | Genera ficheros de migración a partir del esquema |
| `npm run db:migrate` | Aplica las migraciones pendientes a la base de datos |
| `npm run db:studio` | Abre Drizzle Studio en el navegador para explorar/editar datos |

---

## Base de datos

El esquema está definido en [`src/db/schema.ts`](src/db/schema.ts). El fichero [`src/db/index.ts`](src/db/index.ts) expone el cliente `db` que usa toda la aplicación.

### Tablas

| Tabla | Descripción |
|---|---|
| `User` | Usuarios administradores |
| `Noticia` | Artículos de noticias |
| `Video` | Vídeos de YouTube |
| `Jugador` | Jugadores registrados |
| `Torneo` | Torneos con sistema de puntos configurable |
| `ClasificacionEntry` | Resultados de jugadores en torneos |

### Flujo habitual al modificar el esquema

```bash
# 1. Edita src/db/schema.ts
# 2. Genera la migración
npm run db:generate
# 3. Aplica la migración
npm run db:migrate
```

---

## Despliegue en Vercel

El filesystem de Vercel es efímero, por lo que se necesita **Turso** como base de datos persistente.

### 1. Crear la base de datos en Turso

```bash
# Instalar la CLI de Turso
curl -sSfL https://get.tur.so/install.sh | bash

# Iniciar sesión
turso auth login

# Crear la base de datos
turso db create vector-sur

# Obtener la URL de conexión
turso db show vector-sur --url

# Crear un token de acceso
turso db tokens create vector-sur
```

### 2. Migrar los datos locales a Turso (opcional)

Si quieres llevar los datos de `dev.db` a Turso:

```bash
turso db shell vector-sur < dev.db
```

O simplemente ejecuta el seed apuntando a Turso (cambia las variables de entorno y ejecuta `npm run seed`).

### 3. Variables de entorno en Vercel

En el panel de Vercel → Settings → Environment Variables, añade:

| Variable | Valor |
|---|---|
| `DATABASE_URL` | `libsql://vector-sur-tu-usuario.turso.io` |
| `TURSO_AUTH_TOKEN` | Token generado en el paso anterior |
| `NEXTAUTH_SECRET` | Una cadena aleatoria segura |
| `NEXTAUTH_URL` | `https://tu-dominio.vercel.app` |

### 4. Aplicar migraciones en producción

Antes del primer despliegue, aplica el esquema a la base de datos de Turso:

```bash
# Con las variables de entorno de producción activas
DATABASE_URL=libsql://... TURSO_AUTH_TOKEN=... npm run db:migrate
```

---

## Credenciales de desarrollo (tras el seed)

| Campo | Valor |
|---|---|
| Email | `admin@vectorsur.com` |
| Contraseña | `admin1234` |
| Panel admin | `http://localhost:3000/admin` |

---

## Stack

- **Framework**: Next.js 14 (App Router)
- **ORM**: Drizzle ORM + `@libsql/client`
- **Base de datos**: SQLite (`dev.db`)
- **Autenticación**: NextAuth.js (JWT + credenciales)
- **Estilos**: Tailwind CSS
- **Email**: Nodemailer
