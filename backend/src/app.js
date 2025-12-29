import express from 'express';
import { userRouter } from './routes/user.routes.js';
import swaggerUi from 'swagger-ui-express';
import { bundle } from '@readme/openapi-parser';
import { issueRouter } from './routes/issue.routes.js';
import { auditRouter } from './routes/audit.routes.js';
import { aiRouter } from './routes/ai.routes.js';
import { githubRouter } from './routes/github.routes.js';
import { telemetryRouter } from './routes/telemetry.routes.js';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('APP: Hello, ISA DevDays 2025!');
});

app.use('/api/v1', telemetryRouter);
app.use('/api/v1', userRouter);
app.use('/api/v1', issueRouter);
app.use('/api/v1', auditRouter);
app.use('/api/v1', aiRouter);
app.use('/api/v1', githubRouter);


bundle('src/docs/openapi.yaml')
    .then((api) => {
        app.use('/docs', swaggerUi.serve, swaggerUi.setup(api));
    })
    .catch((err) => {
        console.error('Error loading OpenAPI document:', err);
    });


export default app;