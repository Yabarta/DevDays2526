import { Router } from 'express';
import { traceExporter } from '../otel.js';
import decircular from 'decircular';

const telemetryRouter = Router();

telemetryRouter.get('/telemetry', (req, res) => {
    res.status(200).send(decircular(traceExporter.getFinishedSpans()));
});

export { telemetryRouter };