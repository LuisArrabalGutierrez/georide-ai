import { Router } from 'express';
import { ridesQueue } from '../workers/ride.worker.ts';

import { AiService, geocodeDestination, getCityContext } from '../services/ai.services.ts';
import { GroqStrategy } from '../strategies/ai/GroqStrategy.ts';

import { profileRepository } from '../repositories/ProfileRepository.ts';

export const routes = Router();

const aiService = new AiService(new GroqStrategy());

routes.post('/api/ai-ride', async (req, res) => {
  const { prompt, currentLocation, is_mock } = req.body;
  
  try {
    const cityName = await getCityContext(currentLocation.lat, currentLocation.lng);
    const aiDecision = is_mock 
      ? { car_type: 'Economy', destination_name: 'Simulación' }
      : await aiService.analyzeRidePrompt(prompt, cityName);

    const dropoff = await geocodeDestination(aiDecision.destination_name, currentLocation.lat, currentLocation.lng);

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

routes.post('/api/rides', async (req, res) => {
  try {
    await ridesQueue.add('create-ride', req.body);
    res.status(202).json({ message: 'Viaje encolado' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
//  RUTA: PERFIL (Usando el Patrón Repository)
// ==========================================
routes.get('/api/profile/:userId', async (req, res) => {
  try {
    //  La ruta ya no sabe qué es Supabase, solo le pide datos al repositorio
    const profile = await profileRepository.getById(req.params.userId);
    res.json(profile);
  } catch (error: any) {
    res.status(404).json({ error: 'Perfil no encontrado' });
  }
});