import { useState, useEffect } from 'react';
import type { LocationData } from '../types'; // Asegúrate de que la ruta sea correcta

export function useAddressSearch(query: string, currentLat?: number, currentLng?: number) {
  const [results, setResults] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Si la búsqueda es muy corta, limpiamos y no hacemos nada
    if (!query || query.length < 3) {
      setResults([]);
      return;
    }

    // Usamos un "Debounce" (esperar 500ms tras la última tecla) 
    // para no saturar la API mientras el usuario está escribiendo.
    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        // 🔥 Migramos a Photon: Sin problemas de CORS y con búsqueda difusa
        let url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`;

        // 🎯 Si tenemos tu ubicación (ej: Granada), priorizamos los resultados cercanos
        if (currentLat && currentLng) {
          url += `&lat=${currentLat}&lon=${currentLng}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error('Error en la API de Photon');
        
        const data = await response.json();
        
        // Mapeamos la respuesta de GeoJSON al formato que necesita tu app
        const formattedResults: LocationData[] = data.features.map((feature: any) => ({
          name: feature.properties.name || feature.properties.street || 'Dirección desconocida',
          // Opcional: puedes crear un string con la ciudad/país para dar más contexto
          address: [feature.properties.city, feature.properties.state].filter(Boolean).join(', '),
          lat: feature.geometry.coordinates[1], // Photon usa [lng, lat]
          lng: feature.geometry.coordinates[0],
        }));

        // Limpiamos resultados sin nombre
        setResults(formattedResults.filter(r => r.name !== 'Dirección desconocida'));
      } catch (error) {
        console.error("Error buscando dirección:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500); 

    return () => clearTimeout(timeoutId);
  }, [query, currentLat, currentLng]);

  return { results, loading };
}