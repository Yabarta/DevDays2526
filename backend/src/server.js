import './otel.js';
import app from './app.js';
import { connectDB } from './db/connection.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/isadevdays2025';

connectDB(MONGO_URI);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`API docs available at http://localhost:${PORT}/docs`);
});