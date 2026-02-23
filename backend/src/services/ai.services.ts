import { groq } from '../config/config.ts';
import fetch from 'node-fetch';

export async function getCityContext(lat: number, lng: number) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`, {
      headers: { 'User-Agent': 'GeoRide-Backend/1.0', 'Accept-Language': 'es' }
    });
    const data = await res.json();
    return data.address?.city || data.address?.town || data.address?.county || data.address?.state || "España";
  } catch (error) {
    return "España";
  }
}

export async function analyzeRidePrompt(prompt: string, cityName: string) {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `Eres el GPS inteligente de GeoRide. El usuario está en: ${cityName}.
        
        Extrae:
        1. "car_type": 'Economy', 'Premium', o 'Van XL'.
        2. "destination_name": El lugar exacto al que quiere ir. 
        
        REGLAS DE ORO: 
        - Si pide un lugar genérico, añade la ciudad (Ej: "Estación de tren de ${cityName}").
        - 🔥 IMPORTANTE: Si pide ir al "Aeropuerto", debes devolver EXACTAMENTE "Aeropuerto de ${cityName}" (el principal comercial), NUNCA un aeródromo pequeño o base militar.
        
        Devuelve ÚNICA Y EXCLUSIVAMENTE un JSON válido.`
      },
      { role: 'user', content: prompt }
    ],
    model: 'llama-3.1-8b-instant',
    temperature: 0,
    response_format: { type: 'json_object' }
  });

  return JSON.parse(chatCompletion.choices[0]?.message?.content || '{}');
}

export async function geocodeDestination(destinationName: string, lat: number, lng: number) {
  try {
    let query = destinationName;

    // 🔥 TRUCO SENIOR (POI Override): Forzamos la dirección exacta si menciona el aeropuerto de Almería
    if (query.toLowerCase().includes('aeropuerto') && query.toLowerCase().includes('almería')) {
      query = 'Aeropuerto de Almería, Carretera de Níjar - Alquián'; 
    }

    // 🔥 Forzamos que siempre busque en España para evitar que se vaya a otros países
    const finalQuery = `${query}, España`;

    const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(finalQuery)}&limit=1`, {
      headers: { 'User-Agent': 'GeoRide-Backend/1.0', 'Accept-Language': 'es' }
    });
    const geoData = await geoRes.json();
    
    if (geoData && geoData.length > 0) {
      return {
        lat: parseFloat(geoData[0].lat),
        lng: parseFloat(geoData[0].lon),
        name: geoData[0].display_name.split(',')[0]
      };
    }
  } catch (error) {
    console.error("Error buscando coordenadas:", error);
  }
  return { lat, lng, name: destinationName }; 
}