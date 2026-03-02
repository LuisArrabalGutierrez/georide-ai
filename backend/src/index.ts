import express from 'express';
import cors from 'cors';
import { routes } from './routes/route.js';
import { startTrafficSimulator } from './workers/ride.worker.js';

const app = express();

const corsOptions = {
  origin: [
    'http://localhost:5173', // Permite tu entorno de desarrollo local
    'https://georide-ai.vercel.app' 
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true 
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(routes);

// Arrancamos el simulador
startTrafficSimulator();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en el puerto ${PORT}`));