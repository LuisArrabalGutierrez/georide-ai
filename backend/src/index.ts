import express from 'express';
import cors from 'cors';
import { routes } from './routes/route.js';
import { startTrafficSimulator } from './workers/ride.worker.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

// Arrancamos el simulador
startTrafficSimulator();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor Enterprise iniciado en http://localhost:${PORT}`);
  console.log(`🧠 Inteligencia Artificial conectada.`);
  console.log(`🚕 Simulador de tráfico activo.`);
});