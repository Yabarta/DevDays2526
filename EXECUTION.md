# EXECUTION — Cómo lanzar y ejecutar todos los entregables

## Resumen
Este documento describe los requisitos y pasos para levantar la aplicación completa usando la infraestructura Docker incluida: base de datos MongoDB, backend, frontend, Ollama y Prometheus.

## Requisitos previos
- `Docker` y `Docker Compose`. Docker Desktop en Windows funciona bien.
- `Node.js` y `npm`.
- `MongoDB Compass` instalado.
- `Ollama` instalado localmente si quieres usar la integración con el modelo `llama3.2:1b`.

## Variables de entorno importantes
- `MONGO_URI`: URI de MongoDB. Default en código: `mongodb://localhost:27017/isadevdays2025`.
- `OPENAI_API_KEY`: (requerido para la generación de audio/TTS con OpenAI).
- `HOST_PORT`: puerto host para la app (opcional, usado en docker-compose como `HOST_PORT`).

La aplicación está diseñada para ejecutarse con la infraestructura Docker incluida; por tanto, los siguientes pasos asumen un despliegue mediante `docker compose`.

## 1) Levantar la infraestructura Docker 
La composición preparada está en `backend/infrastructure/docker-compose-local.yml` y contiene: proxy nginx, frontend estático (`index.html`), MongoDB y la imagen `devdays-app`.

Construir la imagen del backend y arrancar la infraestructura:

```bash
cd backend
docker build -t devdays-app:latest .

cd infrastructure
docker compose up -d
```

Esto arrancará:
- MongoDB en el contenedor `devdays-mongo` y publicará el puerto `27017` para acceso desde el host.
- nginx proxy en el puerto `80` y un frontend estático en el puerto `8080`.
- El servicio de la app (`devdays-app`) dentro de la red Docker.

Si necesitas ver logs del backend:

```bash
docker compose logs -f devdays-app
```

## 2) MongoDB — Conexión con MongoDB Compass

- El contenedor `devdays-mongo` expone MongoDB en el puerto `27017` del host.
- URI de ejemplo que usa la aplicación: `mongodb://localhost:27017/isadevdays2025`.

Conectar desde MongoDB Compass:

1. Abre **MongoDB Compass**.
2. En "New Connection" pega la cadena de conexión: `mongodb://localhost:27017`.
3. Pulsa `Connect` y selecciona la base de datos `isadevdays2025` para inspeccionar colecciones.

## 3) Ollama (modelo local requerido por `ollama.service.js`)

El servicio `backend/src/services/ollama.service.js` espera un servidor Ollama en `http://localhost:11434` y utiliza el modelo `llama3.2:1b`.

Comandos explícitos para asegurar la misma versión del modelo que usa el código:

```bash
# Instalar Ollama siguiendo la documentación oficial: https://ollama.com
# Descargar/pull del modelo exacto usado por la app:
ollama pull llama3.2:1b

# Iniciar el servidor local de Ollama (según tu instalación):
ollama serve
```

Verifica que la API esté disponible en `http://localhost:11434` (la app hace peticiones a `http://localhost:11434/v1`).

Nota: `ollama pull llama3.2:1b` descarga la versión del modelo que el servicio espera; no uses variantes sin confirmar compatibilidad.

## 4) Frontend

El `docker compose` incluido sirve un frontend estático en `http://localhost:8080` mediante el servicio `devdays-frontend`.

Si necesitas desarrollar el frontend con `next dev`, ejecuta localmente en otra máquina/puerto para evitar conflictos con el backend:

```bash
cd frontend/dev-days-25-frontend
npm install
npm run dev
```

Por defecto `next dev` arranca en `http://localhost:3000`.

## 5) Prometheus y métricas

- El servicio backend expone métricas Prometheus en `http://<host>:9464/metrics` (el exporter de OpenTelemetry arranca un server en el puerto `9464`).
- La configuración de Prometheus incluida está en `backend/monitoring/prometheus/prometheus.yml` y está preparada para scrapear `host.docker.internal:9464` (útil cuando Prometheus corre en un contenedor separado y quiere scrapear el host).

Para ejecutar Prometheus localmente con la configuración del repo:

```bash
docker run -d --name prometheus -p 9090:9090 \
  -v "$(pwd)/backend/monitoring/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml" \
  -v "$(pwd)/backend/monitoring/prometheus/alert_rules.yml:/etc/prometheus/alert_rules.yml" \
  prom/prometheus
```

Después, Prometheus estará en `http://localhost:9090`.

## 6) Cómo probar cada funcionalidad (ejemplos `curl`). Se pueden hacer también en postman.

Sustituye `HOST` por `localhost` y `PORT` por el puerto mapeado del servicio backend (por defecto `3000` en `docker-compose`).

- Meteorología — obtener temperaturas semanales:

```bash
curl "http://localhost:3000/api/v1/weather/weekly?city=Seville&weeks=4&threshold=18"
```

- Meteorología — resumen de la semana en audio (genera un WAV):

```bash
curl -v "http://localhost:3000/api/v1/weather/weekly-summary-audio?city=Seville&threshold=18" --output resumen.wav
```

- AI / Ollama — chat (POST JSON con `prompt`):

```bash
curl -X POST "http://localhost:3000/api/v1/ai/chat" \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Resume brevemente el tiempo en Sevilla esta semana."}'
```

- GitHub — listar repos de un usuario:

```bash
curl "http://localhost:3000/api/v1/github/users/<username>/repos"
```

- Issues — listar, obtener por id y sincronizar desde GitHub:

```bash
curl "http://localhost:3000/api/v1/issues"

curl "http://localhost:3000/api/v1/issues/<issueId>"

curl -X POST "http://localhost:3000/api/v1/issues/fetch" \
  -H "Content-Type: application/json" \
  -d '{"repository": { "owner": "octocat", "name": "Hello-World" }}'
```

- Usuarios — CRUD básico:

```bash
curl "http://localhost:3000/api/v1/users"

curl "http://localhost:3000/api/v1/users/<id>"

curl -X POST "http://localhost:3000/api/v1/users" \
  -H "Content-Type: application/json" \
  -d '{"name":"Juan","email":"juan@example.com"}'

curl -X PUT "http://localhost:3000/api/v1/users/<id>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Juan Actualizado"}'

curl -X DELETE "http://localhost:3000/api/v1/users/<id>"
```

- Telemetry — obtener spans finalizados (JSON):

```bash
curl "http://localhost:3000/api/v1/telemetry"
```

- Métricas Prometheus (exporter OpenTelemetry del servicio):

```bash
curl "http://localhost:9464/metrics"
```

Nota: algunas rutas dependen de servicios externos (Ollama, OpenAI para TTS, GitHub API). Si una funcionalidad falla, revisa los logs del contenedor `devdays-app`.