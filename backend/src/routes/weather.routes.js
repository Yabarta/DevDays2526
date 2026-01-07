import express from 'express';
import { weeklyTemperatureController } from '../controllers/weather.controller.js';

export const weatherRouter = express.Router();

// GET /api/v1/weather/weekly?city=Seville&weeks=4&threshold=18
weatherRouter.get('/weather/weekly', weeklyTemperatureController);
