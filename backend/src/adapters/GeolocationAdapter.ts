import {Redis} from 'ioredis';
import fetch from 'node-fetch';
import { redisOptions } from '../config/config.js'; 

const redisCache = new Redis(redisOptions);

export class GeolocationAdapter {
  private readonly CACHE_TTL = 86400; 

  async getCoordinates(destinationName: string, fallbackLat: number, fallbackLng: number) {
    const cacheKey = `geo:${destinationName.toLowerCase().trim()}`;

    try {
      // 1. Buscamos en Caché primero
      const cachedData = await redisCache.get(cacheKey);
      if (cachedData) {
        console.log(`[🟢 CACHE HIT] Destino cargado en 1ms: ${destinationName}`);
        return JSON.parse(cachedData);
      }

      console.log(`[🔴 CACHE MISS] Buscando en Photon (ElasticSearch): ${destinationName}`);
      
      // 🔥 MAGIA AQUÍ: Usamos Photon y le pasamos tu lat/lng para que priorice resultados cercanos
      const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(destinationName)}&lat=${fallbackLat}&lon=${fallbackLng}&limit=1`;
      
      const response = await fetch(url, {
        headers: { 'User-Agent': 'GeoRide-Backend-TFG/1.0' }
      });

      if (!response.ok) throw new Error(`Error de Photon: ${response.status}`);

      const geoData = await response.json() as any;
      
      // Photon devuelve un formato GeoJSON
      if (geoData && geoData.features && geoData.features.length > 0) {
        const feature = geoData.features[0];
        const result = {
          lat: feature.geometry.coordinates[1], // En GeoJSON el array es [longitud, latitud]
          lng: feature.geometry.coordinates[0],
          // Sacamos el nombre del sitio, o la calle si no tiene nombre
          name: feature.properties.name || feature.properties.street || destinationName 
        };

        // Guardamos en Redis
        await redisCache.set(cacheKey, JSON.stringify(result), 'EX', this.CACHE_TTL);
        
        return result;
      }

      throw new Error("No se encontraron resultados en el mapa");

    } catch (error: any) {
      console.error(`[⚠️ ADAPTER ERROR] Fallo al buscar "${destinationName}": ${error.message}`);
      return { lat: fallbackLat + 0.005, lng: fallbackLng + 0.005, name: destinationName }; 
    }
  }
}

export const geolocationAdapter = new GeolocationAdapter();