import { getWeeklyTemperatureCheck } from '../services/weather.service.js';

export async function weeklyTemperatureController(req, res) {
  const city = req.query.city ? req.query.city : 'Sevilla';
  const weeks = req.query.weeks ? Number(req.query.weeks) : 4;
  const threshold = req.query.threshold ? Number(req.query.threshold) : 18;

  try {
    const result = await getWeeklyTemperatureCheck(city, weeks, threshold);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching weather data', error: err.message });
  }
}
