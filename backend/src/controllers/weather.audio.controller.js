import { getWeeklyTemperatureCheck } from '../services/weather.service.js';
import { generateText, generateSpeechFromText } from '../services/openai.service.js';

// curl -v "http://localhost:3000/api/v1/weather/weekly-summary-audio?city=Seville&threshold=18" --output resumen.wav
export async function weeklyWeatherAudioController(req, res) {
  const city = req.query.city ? req.query.city : 'Sevilla';
  const threshold = req.query.threshold ? Number(req.query.threshold) : 18;

  try {
    const data = await getWeeklyTemperatureCheck(city, 1, threshold);
    const week = data.weeks && data.weeks[0] ? data.weeks[0] : null;
    if (!week || week.error) {
      return res.status(500).json({ message: 'No weather data available', detail: week?.error });
    }

    const summaryPrompt = `Resume en un párrafo breve (30-50 palabras) el tiempo en ${city} entre ${week.start_date} y ${week.end_date}. ` +
      `La temperatura media fue ${week.average_temperature} °C. ` +
      (week.above_threshold ? `Esto está por encima del umbral de ${threshold} °C.` : `Esto está por debajo o en el umbral de ${threshold} °C.`) +
      ' Finaliza con una frase de recomendación breve (por ejemplo: "ropa ligera" o "llevar abrigo").';

    const summaryText = await generateText(summaryPrompt);

    const audioBuffer = await generateSpeechFromText(summaryText, { format: 'wav' });

    res.setHeader('Content-Type', 'audio/wav');
    res.setHeader('Content-Disposition', `attachment; filename="weather_summary_${city}.wav"`);
    res.send(audioBuffer);
  } catch (err) {
    res.status(500).json({ message: 'Error generating audio summary', error: err.message });
  }
}
