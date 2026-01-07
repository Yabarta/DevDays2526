import { recordRequestDuration } from '../otel.js';

export default function metricsMiddleware(req, res, next) {
  const start = process.hrtime();

  res.on('finish', () => {
    const diff = process.hrtime(start);
    const durationMs = diff[0] * 1000 + diff[1] / 1e6;

    const attrs = {
      method: req.method,
      route: req.route && req.route.path ? req.route.path : req.path,
      status_code: String(res.statusCode),
    };

    recordRequestDuration(durationMs, attrs);
  });

  next();
}
