import { Router } from 'express';
import { supabase } from '../config/config.ts';
import { analyzeRidePrompt, geocodeDestination, getCityContext } from '../services/ai.services.ts';
import { ridesQueue } from '../workers/ride.worker.ts';

export const routes = Router();

// ==========================================
// 🧠 RUTA: MODO IA (Solo analiza, NO reserva)
// ==========================================
routes.post('/api/ai-ride', async (req, res) => {
  const { prompt, currentLocation, is_mock } = req.body; // Ya no pedimos rider_id aquí
  
  try {
    const cityName = await getCityContext(currentLocation.lat, currentLocation.lng);
    const aiDecision = is_mock 
      ? { car_type: 'Economy', destination_name: 'Simulación' }
      : await analyzeRidePrompt(prompt, cityName);

    const dropoff = await geocodeDestination(aiDecision.destination_name, currentLocation.lat, currentLocation.lng);

    // 🔥 EL CAMBIO: Ya no añadimos a ridesQueue. Solo devolvemos la respuesta al Frontend.
    res.status(200).json({ 
      decision: { 
        car_type: aiDecision.car_type, 
        destination_name: dropoff.name, 
        coords: { lat: dropoff.lat, lng: dropoff.lng } 
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 🕹️ RUTA: RESERVAR VIAJE (La usaremos tras confirmar)
// ==========================================
routes.post('/api/rides', async (req, res) => {
  try {
    // Esto lo usaremos tanto para el modo manual como para cuando el usuario confirme el de la IA
    await ridesQueue.add('create-ride', req.body);
    res.status(202).json({ message: 'Viaje encolado' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint del Perfil
routes.get('/api/profile/:userId', async (req, res) => {
  const { data, error } = await supabase.from('profiles').eq('id', req.params.userId).single();
  if (error) return res.status(404).json({ error: 'Perfil no encontrado' });
  res.json(data);
});