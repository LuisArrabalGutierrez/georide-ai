import fetch from 'node-fetch';
import type { IAProvider } from '../strategies/ai/IAProvider.js';

// IMPORTAMOS NUESTRO NUEVO ADAPTADOR
import { geolocationAdapter } from '../adapters/GeolocationAdapter.js';

// ==========================================
// 🧠 1. EL SERVICIO DE IA (Patrón Strategy)
// ==========================================
export class AiService {
  private aiProvider: IAProvider;

  constructor(provider: IAProvider) {
    this.aiProvider = provider;
  }

  setProvider(provider: IAProvider) {
    this.aiProvider = provider;
  }

  async analyzeRidePrompt(prompt: string, cityContext: string) {
    return await this.aiProvider.analyzeRide(prompt, cityContext);
  }
}

// ==========================================
// 🌍 2. FUNCIONES DE GEOLOCALIZACIÓN
// ==========================================
export async function getCityContext(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
    const data = await res.json() as any;
    return data.address?.city || data.address?.town || data.address?.village || 'tu ciudad';
  } catch (e) {
    return 'tu ciudad';
  }
}

export async function geocodeDestination(destinationName: string, lat: number, lng: number) {
  if (destinationName === 'Simulación') {
    return { lat: lat + 0.01, lng: lng + 0.01, name: "Destino Simulado" };
  }
  
  // 🔥 PATRÓN CACHE-ASIDE: Delegamos la búsqueda al adaptador con Redis
  return await geolocationAdapter.getCoordinates(destinationName, lat, lng);
}