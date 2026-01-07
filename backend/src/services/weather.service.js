import axios from 'axios';

function formatDate(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

async function geocodeCity(city) {
  const url = 'https://geocoding-api.open-meteo.com/v1/search';
  const resp = await axios.get(url, { params: { name: city, count: 1 } });
  const res = resp.data;
  if (!res || !res.results || res.results.length === 0) {
    throw new Error(`City not found: ${city}`);
  }
  const { latitude, longitude, name, country } = res.results[0];
  return { latitude, longitude, name, country };
}

async function fetchDailyTemps(lat, lon, start_date, end_date) {
  const url = 'https://archive-api.open-meteo.com/v1/archive';
  const params = {
    latitude: lat,
    longitude: lon,
    start_date,
    end_date,
    daily: 'temperature_2m_max,temperature_2m_min',
    timezone: 'auto',
  };
  const resp = await axios.get(url, { params });
  return resp.data;
}

export async function getWeeklyTemperatureCheck(city, weeks = 4, threshold = 18) {
  const geo = await geocodeCity(city);
  const now = new Date();

  const results = [];

  for (let i = 0; i < weeks; i++) {
    
    const end = new Date(now);
    end.setDate(now.getDate() - i * 7);
    const start = new Date(end);
    start.setDate(end.getDate() - 6);

    const start_date = formatDate(start);
    const end_date = formatDate(end);

    let data;
    try {
      data = await fetchDailyTemps(geo.latitude, geo.longitude, start_date, end_date);
    } catch (err) {
      results.push({ start_date, end_date, error: err.message });
      continue;
    }

    const dailyMax = data.daily?.temperature_2m_max || [];
    const dailyMin = data.daily?.temperature_2m_min || [];

    const days = Math.min(dailyMax.length, dailyMin.length);
    if (days === 0) {
      results.push({ start_date, end_date, error: 'no data' });
      continue;
    }

    const dailyMeans = [];
    for (let d = 0; d < days; d++) {
      const max = dailyMax[d];
      const min = dailyMin[d];
      if (typeof max !== 'number' || typeof min !== 'number') continue;
      dailyMeans.push((max + min) / 2);
    }

    if (dailyMeans.length === 0) {
      results.push({ start_date, end_date, error: 'no numeric data' });
      continue;
    }

    const sum = dailyMeans.reduce((a, b) => a + b, 0);
    const avg = sum / dailyMeans.length;
    const above = avg > Number(threshold);

    results.push({ start_date, end_date, average_temperature: Number(avg.toFixed(2)), above_threshold: above });
  }

  return { city: city, latitude: geo.latitude, longitude: geo.longitude, weeks: results };
}
