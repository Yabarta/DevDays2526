# Entregables

Los entregables solicitados (detallados):

### N0-1) Proyecto base realizado en clase (terminado con modificaciones propuestas).
- Descripción: correcciones y pequeñas mejoras en varios ficheros para dejar el proyecto base completado.
- Ubicación: varios ficheros pequeños en `backend/src/`.

Tareas y cómo se resolvieron (resumen breve):
- `update user` (servicio, controlador y ruta `PUT /api/v1/users/:id`): se actualizó la lógica en `src/services/user.service.js` para aplicar los cambios y persistirlos, se adaptó `src/controllers/user.controller.js` para usar la función `updateUserById(...)` y la ruta `src/routes/user.routes.js` ya expone el `PUT /users/:id`. Esto garantiza coherencia entre capa HTTP y lógica de negocio.
- Validación de longitud en `src/middlewares/user.middleware.js`: añadido check para que el campo `name` tenga máximo 50 caracteres; devuelve 400 si se excede. 
- `updatedAt` en `src/models/issue.model.js`: añadido el campo `updatedAt` (o habilitado `timestamps: true` en el esquema) y actualizado el servicio para establecer `updatedAt = new Date()` al modificar una issue, permitiendo seguimiento de cambios.
- Timeout en `getAllUsers` de `src/controllers/user.controller.js`: insertado `await new Promise(resolve => setTimeout(resolve, 100));` para simular retardo/processing y facilitar pruebas de métricas/latencia.

Estas tareas son cortas y directas; las he documentado aquí de forma compacta para no alargar demasiado el documento principal.

### N1-1) Función recursiva: paginación de datos de la API de GitHub.
- Descripción: Creación de una función genérica que consuma de la API REST de GitHub para poder obtener datos. Si hay varias páginas de información, la función debe paginar de forma automática para obtener toda la información.
- Ubicación: `backend/src/services/github.service.js`.

Cómo se resolvió:
- Implementado en `backend/src/services/github.service.js` con la función `fetchAllPages(startUrl, axiosConfig, extractPageData)`.
- Usa `axios` para realizar peticiones y detecta la cabecera `Link` buscando `rel="next"`; concatena cada página en `results` hasta que no exista `next`.
- Provee funciones auxiliares `fetchPage`, `getUserRepos` y `listOrgRepos` para casos concretos (usuarios/organizaciones). Esta solución centraliza la paginación y facilita reutilización y testeo.

### N1-2) Creación de métricas personalizadas.
- Descripción: Definir e instrumentar una nueva métrica distinta a la explicada en el tema 7. La métrica debe medir algún aspecto relevante del comportamiento o estado del sistema y no puede ser de tipo contador simple. El objetivo es evaluar la capacidad para identificar qué información es útil observar y aprender otro tipo de métricas.
- Ubicación: `backend/src/otel.js` y `backend/src/middlewares/metrics.middleware.js`.

Cómo se resolvió:
- En `backend/src/otel.js` se creó un histograma `http_request_duration_ms` (histograma) usando el API de métricas de OpenTelemetry; esto permite bucketed metrics, sum/count y cálculo de percentiles.
- En `backend/src/middlewares/metrics.middleware.js` se mide el tiempo de cada petición y se registra en el histograma mediante `recordRequestDuration(durationMs, attributes)` (atributos: método, ruta, status_code).

### N1-3) Usar Ollama local en lugar de llamar a OpenAI.
- Descripción: Usar Ollama local en lugar de llamar a OpenAI.
- Ubicación: `backend/src/services/ollama.service.js`.
- Detalle: Es importante descargar el modelo `llama3.2:1b`.

Cómo se resolvió:
- `backend/src/services/ollama.service.js` configura el cliente `openai` con `baseURL: 'http://localhost:11434/v1'` y `apiKey: 'ollama'` para dirigir las peticiones al servidor Ollama local.
- La función `generateText(prompt)` usa `openai.responses.create({ model: 'llama3.2:1b', input: prompt })` y devuelve `response.output_text`.
- `backend/src/controllers/ai.controller.js` consume `generateText` y expone `/api/v1/ai/chat`, por lo que la generación textual se realiza localmente en Ollama.

### N2-P2-A) Auditoría sobre datos meteorológicos.
- Descripción: Conexión con OpenMeteo para obtener el histórico meteorológico de las últimas semanas de una ciudad. A partir de esos datos, se calcula la temperatura media semanal y se verifica, para cada semana, si se cumple un umbral de temperatura definido. Por ejemplo, comprobar si la temperatura media semanal en Sevilla es superior a 18 °C.
- Ubicación: `backend/src/services/weather.service.js` y `backend/src/controllers/weather.controller.js`.

Cómo se resolvió:
- `backend/src/services/weather.service.js` implementa `getWeeklyTemperatureCheck(city, weeks, threshold)`:
	- Geocodifica la ciudad con `https://geocoding-api.open-meteo.com/v1/search`.
	- Solicita datos históricos diarios a `https://archive-api.open-meteo.com/v1/archive` (max/min diarios).
	- Calcula la media diaria ((max+min)/2) y luego la media semanal; devuelve `{ start_date, end_date, average_temperature, above_threshold }` por semana.
- `backend/src/controllers/weather.controller.js` expone estos resultados en `/api/v1/weather/weekly`.

### N2-P2-B) Audio resumen del tiempo pasado con IA.
- Descripción: Endpoint para obtener un archivo de audio con IA que nos haga un resumen del tiempo de los 7 últimos días.
- Ubicación: `backend/src/controllers/weather.audio.controller.js` y servicios en `backend/src/services/`.

Cómo se resolvió:
- `backend/src/controllers/weather.audio.controller.js` recoge los datos semanales desde `getWeeklyTemperatureCheck`, genera un `summaryPrompt` y obtiene el texto resumen.
- En la implementación actual el controlador usa `generateText` y `generateSpeechFromText` (TTS) para producir audio.
- `backend/src/services/openai.service.js` realiza la llamada a la API de audio para obtener un `Buffer` y el controlador devuelve el audio con cabeceras `Content-Type: audio/wav` y `Content-Disposition` para descarga.

### N2-P2-C) Instrumenta y mide el tiempo de respuesta de la API de Weather.
- Descripción: Instrumenta la aplicación de N2-P2-A (la que consulta el histórico meteorológico de OpenMeteo) para medir el tiempo de respuesta de cada endpoint y exponer estas métricas a Prometheus. Configura alertas si el tiempo medio de respuesta supera un umbral definido o visualiza los datos en un dashboard (Grafana).
- Ubicación: `backend/src/otel.js`, `backend/src/middlewares/metrics.middleware.js`, `backend/monitoring/prometheus/alert_rules.yml`.

Cómo se resolvió:
- `backend/src/otel.js` configura `PrometheusExporter` (puerto `9464`) y define el histograma `http_request_duration_ms`.
- `backend/src/middlewares/metrics.middleware.js` registra la duración por petición en el histograma con atributos útiles (método, ruta, status_code).
- `backend/monitoring/prometheus/alert_rules.yml` contiene la regla `HighHTTPAverageLatency` que calcula la media a partir de `http_request_duration_ms_sum` y `http_request_duration_ms_count` y dispara si supera 100 ms durante 1 minuto.
- Con estas piezas, Prometheus puede scrapear `/metrics`, generar alertas.


