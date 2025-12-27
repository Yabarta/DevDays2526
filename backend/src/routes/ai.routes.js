import { generateAIResponse } from '../controllers/ai.controller.js';
import { Router } from 'express';

const aiRouter = Router();

aiRouter.post('/ai/chat', generateAIResponse);

export { aiRouter };