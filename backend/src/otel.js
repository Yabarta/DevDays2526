
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import {
    ATTR_SERVICE_NAME,
    ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ConsoleMetricExporter, MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { metrics } from '@opentelemetry/api';
import { SimpleExporter } from './simpleExporter.js';

const resource = resourceFromAttributes({
    [ATTR_SERVICE_NAME]: 'my-node-service',
    [ATTR_SERVICE_VERSION]: '1.0.0',
});

export const traceExporter = new SimpleExporter();

const tracerProvider = new NodeTracerProvider({
    resource,
    spanProcessors: [
        new SimpleSpanProcessor(new ConsoleSpanExporter()),
        new SimpleSpanProcessor(traceExporter),
    ],
});

tracerProvider.register();

registerInstrumentations({
    instrumentations: [
        new HttpInstrumentation({
            ignoreIncomingRequestHook(req) {
                return req.url?.includes('/telemetry');
            },
        }),
    ],
});

const meterProvider = new MeterProvider({
  resource,
  readers: [
    new PeriodicExportingMetricReader({
      exporter: new ConsoleMetricExporter(),
      exportIntervalMillis: 5000,
    }),
        // Prometheus exporter will expose a /metrics endpoint for scraping
        new PrometheusExporter({ startServer: true, port: 9464, endpoint: '/metrics' }),
  ],
});

// Registrar globalmente
metrics.setGlobalMeterProvider(meterProvider);
const meter = metrics.getMeter('user-controller-meter');
const userCreationCounter = meter.createCounter('user_creation_count', {
    description: 'Counts number of users created',
    unit: "users",
});
// Histograma para medir la duración de peticiones HTTP en milisegundos
const requestDurationHistogram = meter.createHistogram('http_request_duration_ms', {
    description: 'Duration of HTTP requests',
    unit: 'ms',
});

export const recordRequestDuration = (durationMs, attributes = {}) => {
    try {
        requestDurationHistogram.record(durationMs, attributes);
    } catch (err) {
        // no bloquear la aplicación si hay errores en métricas
        console.error('Error recording metric', err);
    }
};

export const addUser = (req, res) => {
        userCreationCounter.add(1);
        try {
                const newUser = createUser(req.body);
                res.status(201).json(newUser);
        } catch (error) {
                res.status(500).json({ message: 'Internal server error' });
        }
};
