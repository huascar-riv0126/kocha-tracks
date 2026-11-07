# Kocha Tracks

Kocha Tracks es un proyecto full-stack que permite a los usuarios consultar sobre eventos que afectan la transitabilidad de las calles de Cochabamba, sin requerir tener el GPS activo en todo momento ni iniciar sesión. 

Los usuarios que deseen registrarse con una cuenta podrán crear zonas personalizadas sobre el mapa para recibir notificaciones sobre nuevos eventos o actualizaciones de eventos ya existentes en sus áreas de interés.

## Stack y requisitos

| Componente | Versión / herramienta |
| --- | --- |
| Frontend | Angular 22.1, dependencias fijadas en `angular-frontend/package-lock.json` |
| Backend | Spring Boot 4.1.1 y Java **JDK 21** (incluye `javac`) |
| Base de datos | PostgreSQL 18 |
| Node.js | `^22.22.3`, `^24.15.0` o `>=26.0.0`, según Angular en el lockfile |
| npm | El proyecto declara `npm@11.19.0` en `angular-frontend/package.json` |
| Maven | El wrapper `mvnw` descarga Maven 3.9.16; no hace falta instalarlo globalmente |

Instala [Git](https://git-scm.com/downloads), [Node.js](https://nodejs.org/) y un [JDK 21, por ejemplo Eclipse Temurin](https://adoptium.net/temurin/releases/?version=21). Para la base local, elige **Docker con Compose** (ruta descrita abajo) o una instalación propia de [PostgreSQL 18](https://www.postgresql.org/download/). pgAdmin y DBeaver son opcionales.

Comprueba las herramientas antes de continuar:

```bash
git --version
node --version
npm --version
java -version
javac -version
docker compose version   # Solo si usarás la base con Docker
docker info             # Debe poder conectarse al motor de Docker
```

Se necesita conexión a Internet para descargar dependencias e imágenes y para las teselas del mapa. Los puertos predeterminados son `5432` (PostgreSQL), `8080` (API) y `4200` (frontend).

## Instalación y ejecución local

Los comandos siguientes usan Bash/Zsh y parten de la raíz del repositorio salvo que se indique otro directorio. En Windows usa `mvnw.cmd` en lugar de `./mvnw`; para copiar el ejemplo en PowerShell puedes usar `Copy-Item .env.example .env`.

### 1. Clonar el proyecto

```bash
git clone https://github.com/huascar-riv0126/kocha-tracks.git
cd kocha-tracks
```

Si ya clonaste el proyecto, entra en esa carpeta. No necesitas acceso a Trello, Supabase ni credenciales de staging/producción para el desarrollo local.

**Opcional, si ya utilizas mise:** puedes seleccionar las herramientas solo para este proyecto con `mise use --path mise.local.toml node@22 java@temurin-21`. `mise.local.toml` está ignorado por Git. Con otros gestores, selecciona un Node compatible y JDK 21 antes de continuar; `JAVA_HOME`, si está definido, debe apuntar al JDK seleccionado.

### 2. Crear la base local

**Opción A: Docker Compose (recomendada para un primer setup)**

Desde la raíz del repositorio:

```bash
docker compose up -d --wait db
docker compose ps
```

El servicio `db` debe aparecer como `healthy`. Compose crea una base independiente con estos valores públicos de desarrollo:

| Campo | Valor |
| --- | --- |
| Host / puerto | `localhost:5432` |
| Base de datos | `kocha_tracks_db` |
| Usuario | `kocha` |
| Contraseña local | `kocha_local` |

El puerto se publica únicamente en `127.0.0.1`. Estas credenciales son exclusivamente locales. Los datos persisten en el volumen `postgres_data` de este proyecto, incluso al detener el contenedor. En la [imagen oficial de PostgreSQL 18](https://hub.docker.com/_/postgres), el volumen se monta en `/var/lib/postgresql`.

No ejecutes manualmente la migración SQL: Flyway creará las tablas al iniciar el backend.

**Opción B: PostgreSQL ya instalado**

Arranca tu servicio PostgreSQL 18. En `psql`, conectado con un usuario administrador, crea un usuario y una base propios para el proyecto:

```sql
CREATE USER kocha WITH PASSWORD 'kocha_local';
CREATE DATABASE kocha_tracks_db OWNER kocha;
```

Puedes elegir otros valores; ajusta el `.env` del siguiente paso. No necesitas arrancar Compose si usas esta opción.

### 3. Configurar y arrancar el backend

Copia el ejemplo solo la primera vez; conserva tu `.env` si ya existe.

```bash
cd springboot-backend
cp .env.example .env
./mvnw --version
./mvnw spring-boot:run
```

El archivo queda en `springboot-backend/.env`, está ignorado por Git y contiene los valores de la base local de Compose:

```properties
DB_URL=jdbc:postgresql://localhost:5432/kocha_tracks_db
DB_USERNAME=kocha
DB_PASSWORD=kocha_local
```

Spring carga ese archivo mediante `spring.config.import=optional:file:.env[.properties]`, relativo al **directorio desde donde ejecutas Maven**. Por eso debes ejecutar el wrapper dentro de `springboot-backend`. Usa el formato `CLAVE=valor`, sin `export`; no hace falta cargarlo con `source`. Las variables exportadas en tu terminal tienen prioridad sobre el archivo: comprueba que no haya valores antiguos de `DB_URL`, `DB_USERNAME` o `DB_PASSWORD` antes de arrancar.

El wrapper debe mostrar Java 21. En el primer inicio, Flyway aplica `V1__baseline.sql` y Hibernate valida las entidades. Espera el mensaje `Started SpringbootBackendApplication`; la API queda en `http://localhost:8080`.

### 4. Instalar y arrancar el frontend

En una **segunda terminal**, desde la raíz del repositorio:

```bash
cd angular-frontend
npm ci
npm start
```

`npm ci` instala las versiones del lockfile. `npm start` usa el Angular CLI incluido en el proyecto; no necesitas instalar `ng` globalmente. Si quieres usar exactamente el npm declarado sin cambiar tu instalación global, puedes instalar las dependencias con `npx --yes npm@11.19.0 ci`.

Abre `http://localhost:4200`. Algunas rutas para explorar son `/map`, `/fuentes`, `/zonas-interes`, `/login`, `/register` y `/perfil`.

**Estado actual de la integración:** eventos, fuentes y zonas del frontend usan datos simulados (`EventMockService`, `SourcesService` y `ZONES_MOCK`). Las pantallas de login/registro no completan un flujo de autenticación contra la API. No hay un archivo `src/environments` ni una variable de URL de API que configurar actualmente. La interfaz puede arrancar sin el backend; para comprobar el entorno completo, verifica la API por separado.

### 5. Comprobar el entorno

En otra terminal:

```bash
curl -i http://localhost:8080/api/v1/sources
curl -I http://localhost:4200
```

En una base recién creada, la API debe responder `200` con `[]`. El frontend debe responder `200` y mostrar la página en el navegador. Una respuesta `404` en la raíz `http://localhost:8080/` es normal: no hay un controlador para `/`.

Con Compose, también puedes inspeccionar las migraciones aplicadas y las tablas:

```bash
docker compose exec db psql -U kocha -d kocha_tracks_db -c 'SELECT version, description, success FROM flyway_schema_history;'
docker compose exec db psql -U kocha -d kocha_tracks_db -c '\dt'
```

Se esperan la migración `1` exitosa y las tablas `employees`, `sources`, `users`, `zones` y `flyway_schema_history`. No se cargan datos de ejemplo automáticamente con `ddl-auto=validate`; el archivo heredado `import.sql` no es una migración ni debe ejecutarse para este setup.

### 6. Pruebas y compilación

Frontend, desde `angular-frontend`:

```bash
npm test -- --watch=false
npm run build
```

Las pruebas usan Vitest con jsdom; no requieren navegador ni API en ejecución. El build genera las salidas de navegador y SSR en `dist/angular-frontend`. Actualmente puede emitir advertencias de tamaño de bundles/estilos y de CommonJS por Leaflet; revisa el código de salida para distinguirlas de un fallo.

Backend, desde `springboot-backend`, con la base local disponible y `.env` configurado:

```bash
./mvnw verify
```

La prueba existente `contextLoads` inicia Spring y accede a la base configurada; Flyway puede aplicar migraciones pendientes. Usa tu base local de desarrollo. `verify` también compila, ejecuta las pruebas y genera el JAR en `target/`.

### 7. Detener y volver a iniciar

Detén frontend y backend con `Ctrl+C` en sus terminales. Para detener la base, desde la raíz:

```bash
docker compose stop db
```

Para retomarlo, ejecuta `docker compose up -d --wait db`, `./mvnw spring-boot:run` dentro del backend y `npm start` dentro del frontend. No repitas la copia de `.env` ni la instalación de dependencias salvo que sea necesario; ejecuta `npm ci` cuando cambie el lockfile. `docker compose down` elimina los contenedores conservando los datos; añadir `--volumes` elimina la base local.

## Problemas frecuentes del setup

| Síntoma | Qué revisar |
| --- | --- |
| `java`/`javac` no existe o Maven usa otra versión | Selecciona JDK 21 y revisa `JAVA_HOME` y `./mvnw --version`. Maven no incluye Java. |
| `Permission denied` al ejecutar `mvnw` | En Linux/macOS ejecuta `chmod +x mvnw` dentro de `springboot-backend`; en Windows usa `mvnw.cmd`. |
| Docker no conecta o no tiene permisos | Verifica `docker info`, el servicio Docker y los permisos de tu instalación. |
| El puerto `5432` está ocupado | Usa tu PostgreSQL existente, o inicia Compose con `POSTGRES_PORT=5433 docker compose up -d --wait db` y cambia `DB_URL` a `jdbc:postgresql://localhost:5433/kocha_tracks_db`. Mantén ese mismo `POSTGRES_PORT` en las siguientes invocaciones de Compose, por ejemplo con `export POSTGRES_PORT=5433`. |
| `Connection refused` o fallo al conectar a PostgreSQL | Revisa `docker compose ps`, `docker compose logs db`, el puerto y la URL JDBC completa; arranca primero la base. |
| Error de credenciales o variables `DB_*` sin resolver | Comprueba el archivo `springboot-backend/.env`, el directorio desde donde ejecutas Maven y si hay variables exportadas que lo sobrescriben. |
| Cambiar usuario/contraseña en Compose no cambia la base | Las variables `POSTGRES_*` solo inicializan un volumen vacío; una base existente conserva sus usuarios y contraseñas. |
| Fallo de Flyway o de validación de Hibernate | Revisa la primera causa en los logs y las migraciones; no cambies `ddl-auto=validate` para ocultarlo. |
| `ng: command not found` | Ejecuta `npm ci` y luego `npm start` desde `angular-frontend`. |
| Puerto `8080` o `4200` ocupado | Detén tu otro proceso o usa `PORT=8081 ./mvnw spring-boot:run` / `npm start -- --port 4201`; adapta las URLs de comprobación. El CORS del backend permite los orígenes locales `4200` y `4000`. |
| Respuesta `429` en la API durante comprobaciones repetidas | `/api/v1/sources` y sus subrutas comparten un límite de 5 solicitudes/minuto por IP; el resto de `/api/**` comparte uno de 10/minuto por IP. Espera a que se repongan antes de repetir. |
| El mapa no carga sus teselas | Revisa tu conexión a Internet y los errores de red del navegador. |

## Ramas y pull requests

Actualmente no hay una plantilla de PR ni un `CONTRIBUTING.md`. Los PRs recientes apuntan a `main`, describen los cambios en español y suelen adjuntar resultados de pruebas o capturas. Los trabajos asociados a una historia usan su identificador `UH-<n>` en la rama o el título; si tu tarea no tiene historia asignada, usa un nombre descriptivo sin inventar un identificador.

Como referencia para preparar un PR:

- Crea una rama desde `main` actualizada, por ejemplo `docs/readme-development-setup` para documentación o `feat/UH-<n>-descripcion` para una historia.
- Explica el problema, el comportamiento resultante y los cambios relevantes.
- Incluye los comandos de validación y sus resultados; adjunta capturas cuando haya cambios visuales.
- Indica cualquier limitación o paso que no pudiste verificar. No subas `.env`, credenciales, dependencias instaladas ni archivos de build.

Ejemplos del repositorio: [documentación del setup (#37)](https://github.com/huascar-riv0126/kocha-tracks/pull/37) y [localización con evidencia de build y pruebas (#51)](https://github.com/huascar-riv0126/kocha-tracks/pull/51).

---

## Migraciones de Base de Datos (Flyway + Hibernate)
El proyecto utiliza Flyway para versionar la **estructura** de la base de datos. Los scripts de migración se encuentran en `springboot-backend/src/main/resources/db/migration/` (las rutas de los ejemplos siguientes son relativas al backend). Al arrancar el proyecto, Flyway ejecutará automáticamente los scripts pendientes.

Hibernate solo **valida** que las entidades coincidan con la base de datos (`spring.jpa.hibernate.ddl-auto=validate`). Nunca crea ni modifica tablas.

> **Qué se versiona:** únicamente la estructura de las tablas y los cambios en sus columnas (crear tablas, agregar, modificar o eliminar columnas, constraints, índices).
> Los datos insertados desde la API (por ejemplo, usando Bruno, Postman o el frontend) **NO** se guardan en las migraciones.

> **Las migraciones se escriben manualmente en SQL.** No existe un comando que las genere automáticamente.

### Flujo de trabajo para crear una nueva migración

* Modifica o agrega tus entidades `@Entity` en el backend con Java.
* Crea un nuevo script en `src/main/resources/db/migration/` con el nombre `V<n>__descripcion_del_cambio.sql` (ej. `V2__add_notes_to_sources.sql`). Usa la siguiente versión consecutiva y **dos guiones bajos** después del número.
* Escribe a mano el SQL que refleje el cambio en la estructura:
```sql
-- V2__add_notes_to_sources.sql
ALTER TABLE sources ADD COLUMN notes TEXT;
```
* Arranca el proyecto. Flyway aplicará la migración y Hibernate validará que las entidades coincidan con la base de datos. Si no coinciden, la aplicación fallará al iniciar: falta o está mal la migración.
* Haz commit de la entidad y de su migración juntas.

*Reglas importantes:*
* **Nunca edites una migración que ya fue aplicada.** Flyway valida el checksum y fallará. Para corregir algo, crea una nueva migración.
* Nunca uses `spring.jpa.hibernate.ddl-auto=create` o `update`: borran o alteran tablas fuera del control de Flyway.
* Revisa el SQL antes de aplicarlo. Un renombre de columna debe escribirse como `ALTER TABLE ... RENAME COLUMN`, no como `DROP` + `ADD`, para no perder los datos de esa columna.

---

## Despliegue (Deploy)

El proyecto está diseñado para desplegarse en tres capas separadas utilizando servicios en la nube modernos y gratuitos (o de bajo costo).

### 1. Base de Datos: Supabase (PostgreSQL)

Supabase actúa como nuestro proveedor de base de datos en la nube.

* Crea un proyecto en [Supabase](https://supabase.com/)

> Anotate la contraseña que le pusiste o auto generaste para el acceso a la base de datos.

* No necesitas crear las tablas manualmente. Flyway se encargará de crear el esquema la primera vez que el Backend en producción se conecte a Supabase.
* Dirígete a la sección de conexion directa a la Base de Datos y obtén el **Connection String** usando *session pooler* y en formato *JDBC*.

> Supabase te dara un URL similar a: `jdbc:postgresql://[dominio-del-pooler]:5432/postgres?user=postgres.[id-dentro-del-dominio]&password=[YOUR-PASSWORD]` debes modificarla para que quede asi: `jdbc:postgresql://[dominio-del-pooler]:5432/postgres?sslmode=require`, no borres sin anotar antes el *id dentro del dominio* que te da Supabase. Este enlace de conexion directa y el id dentro del dominio se usan como variables de entorno para deployar el backend.

### 2. Backend: Render

El backend se despliega como un contenedor Docker en [Render](https://render.com/).

* Crea un nuevo "Web Service" en Render y conéctalo a tu repositorio de GitHub (puedes crear un fork si no te permite hacerlo con este repositorio).
* Configura el entorno de ejecución seleccionando **Docker** (Render detectará automáticamente el archivo `Dockerfile` ubicado en la carpeta del backend).
* En la sección "Environment Variables" de Render, agrega las variables de entorno para producción:
* `DB_URL`: La URL JDBC de Supabase modificada.
* `DB_USERNAME`: El usuario de Supabase con id del dominio (`postgres.[id]`).
* `DB_PASSWORD`: La contraseña de tu base de datos en Supabase.

> Si ya estas en el tablero de Trello, puedes usar los valores de *produccion* en la tarjeta que contiene las variables de entorno del backend.

*Durante el primer despliegue exitoso, Spring Boot y Flyway se conectarán a Supabase y ejecutarán los archivos `V<Version>__*.sql` automáticamente.*

### 3. Frontend: Netlify

El proyecto incluye SSR (`outputMode: "server"` en `angular.json`), además de rutas prerenderizadas. Una publicación estática de la carpeta `browser` no ejecuta el servidor SSR. Revisa la configuración de [Netlify para Angular](https://docs.netlify.com/frameworks/angular/) antes de desplegar; el setup local de este README no valida el despliegue.

* Crea un nuevo sitio en Netlify importando tu repositorio desde GitHub.
* Configura el "Base directory" apuntando a la carpeta `angular-frontend`.
* Configura el "Build command" como: `npm run build`.
* La salida del navegador está en `dist/angular-frontend/browser` y la del servidor en `dist/angular-frontend/server`; configura el soporte SSR de la plataforma si lo necesitas.
* Actualmente el frontend usa mocks y no tiene una URL de API configurable. La integración con la API desplegada requiere implementarse en el código; agregar una variable en Netlify por sí solo no la conecta.
