# Kocha Tracks

Kocha Tracks es un proyecto full-stack que permite a los usuarios consultar sobre eventos que afectan la transitabilidad de las calles de Cochabamba, sin requerir tener el GPS activo en todo momento ni iniciar sesión. 

Los usuarios que deseen registrarse con una cuenta podrán crear zonas personalizadas sobre el mapa para recibir notificaciones sobre nuevos eventos o actualizaciones de eventos ya existentes en sus áreas de interés.

## Stack Tecnológico y Requerimientos

Para el desarrollo de Kocha Tracks, se utilizan las siguientes tecnologías:
- **Frontend:** Angular 22
- **Backend:** Spring Boot 4.1.1 con Maven
- **Base de Datos:** PostgreSQL 18

Para poder desarrollar, modificar, mantener y ejecutar el proyecto localmente, es necesario tener instalado:

### Herramientas Requeridas
- [Node.js](https://nodejs.org/) (Versión 22.22.3 o superior)
- [Java Eclipse Temurin SDK 21](https://adoptium.net/es/temurin/releases/?version=21)
- Maven (Versión compatible con Java 21, por lo general ya viene incluido)
- [PostgreSQL](https://www.postgresql.org/download/) (Versión 18)

### Herramientas Recomendadas
Para facilitar el desarrollo se recomienda tener instalado:
- pgAdmin 4 o DBeaver (Para la gestión visual de la base de datos)
- Docker

---

## Instalación, Configuración y Ejecución Local

Lo primero es clonar el repositorio localmente en tu equipo:
```bash
git clone [https://github.com/huascar-riv0126/kocha-tracks.git](https://github.com/huascar-riv0126/kocha-tracks.git)

```

### 1. Base de Datos Local

Abre tu consola de PostgreSQL (psql) o tu gestor de base de datos preferido (pgAdmin por ejemplo) y crea una nueva base de datos para el proyecto:

```sql
CREATE DATABASE kocha_tracks_db;

```

*Nota: Puedes usar el nombre que desees, pero deberás recordarlo para configurar el backend.*

### 2. Backend (Spring Boot)

1. **Ubicarse en el directorio del backend:**
Desde la raíz del proyecto clonado, muévete a la carpeta del backend.
```bash
cd springboot-backend

```

2. **Configurar variables de entorno:**
Crea un archivo llamado `.env` en la raíz de `springboot-backend`.
```bash
touch .env

```

Agrega las siguientes variables, reemplazando los valores con tus credenciales de PostgreSQL:
```properties
DB_URL=jdbc:postgresql://localhost:5432/kocha_tracks_db
DB_USERNAME=tu_usuario_postgres
DB_PASSWORD=tu_contrasena
```

3. **Migraciones de Base de Datos (Flyway + Hibernate):**
El proyecto utiliza Flyway para versionar la base de datos. Los scripts de migración se encuentran en `src/main/resources/db/migration/`. Al arrancar el proyecto, Flyway ejecutará automáticamente los scripts pendientes.
*Flujo de trabajo para generar nuevas migraciones en desarrollo:*
* Modifica tus entidades `@Entity` en Java.
* En `application.properties`, habilita temporalmente la exportación de DDL de Hibernate:
```properties
spring.jpa.hibernate.ddl-auto=create
spring.jpa.properties.jakarta.persistence.schema-generation.scripts.action=create
spring.jpa.properties.jakarta.persistence.schema-generation.scripts.create-target=schema.sql
```

* Ejecuta el proyecto. Hibernate generará un archivo `schema.sql` en la raíz.
* Copia el contenido de `schema.sql` y pégalo en un nuevo script de Flyway (ej. `V2__descripcion_del_cambio.sql`) dentro de la carpeta `db/migration/`.
* Restaura tu `application.properties` para que Flyway retome el control (`spring.jpa.hibernate.ddl-auto=validate`).

3. **Descargar dependencias, compilar y ejecutar:**
```bash
./mvnw spring-boot:run

```

*El comando instala dependencias si no las encuentra, compila y ejecuta el proyecto. El backend debería estar corriendo típicamente en el puerto 8080.*
*(Opcional)* Para ver mensajes de DEBUG o TRACE en Windows, puedes usar el script creado:
```cmd
./spring.cmd run -log=debug

```

### 3. Frontend (Angular)

Abre una **nueva terminal** para no detener la ejecución del backend.

1. **Ubicarse en el directorio del frontend:**
Desde la raíz del proyecto clonado:
```bash
cd angular-frontend

```

2. **Instalar Angular CLI globalmente:**
*(Si ya lo tienes instalado, puedes omitir este paso)*
```bash
npm install -g @angular/cli

```

3. **Instalar dependencias del proyecto:**
```bash
npm install

```

4. **Inicializar proyecto:**
```bash
ng serve

```

*El frontend estará disponible en `http://localhost:4200`.*

---

## Despliegue (Deploy)

El proyecto está diseñado para desplegarse en tres capas separadas utilizando servicios en la nube modernos y gratuitos (o de bajo costo).

### 1. Base de Datos: Supabase (PostgreSQL)

Supabase actúa como nuestro proveedor de base de datos en la nube.

* Crea un proyecto en [Supabase](https://supabase.com/).
* Dirígete a la sección de configuración de Base de Datos (Database) y obtén el **Connection String** (URI de conexión JDBC).
* No necesitas crear las tablas manualmente. Flyway se encargará de crear el esquema la primera vez que el Backend en producción se conecte a Supabase.

### 2. Backend: Render

El backend se despliega como un contenedor Docker en [Render](https://render.com/).

* Crea un nuevo "Web Service" en Render y conéctalo a tu repositorio de GitHub.
* Configura el entorno de ejecución seleccionando **Docker** (Render detectará automáticamente el archivo `Dockerfile` ubicado en la carpeta del backend).
* En la sección "Environment Variables" de Render, agrega las variables de entorno para producción:
* `DB_URL`: La URL JDBC obtenida de Supabase.
* `DB_USERNAME`: El usuario de Supabase (usualmente `postgres`).
* `DB_PASSWORD`: La contraseña de tu base de datos en Supabase.

*Durante el primer despliegue exitoso, Spring Boot y Flyway se conectarán a Supabase y ejecutarán los archivos `V<Version>__*.sql` automáticamente.*

### 3. Frontend: Netlify

El cliente Angular se despliega de manera estática en [Netlify](https://www.netlify.com/).

* Crea un nuevo sitio en Netlify importando tu repositorio desde GitHub.
* Configura el "Base directory" apuntando a la carpeta `angular-frontend`.
* Configura el "Build command" como: `ng build --configuration production`
* Configura el "Publish directory" apuntando a la carpeta de salida `dist/angular-frontend/browser`.
* Asegúrate de configurar las variables de entorno (environments) de Angular en Netlify para que el frontend apunte a la URL pública proporcionada por Render (ej. `https://kocha-tracks-api.onrender.com`).
