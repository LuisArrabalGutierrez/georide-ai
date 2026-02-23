import { useState, useEffect } from 'react';
import type { PlaceResult } from '../types';

export function useAddressSearch(query: string) {
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // No buscamos hasta que haya al menos 3 letras
    if (query.length < 3) {
      setResults([]);
      setIsTyping(false);
      return;
    }

    setIsTyping(true);
    
    // 🔥 EL TRUCO : "Debounce"
    // Esperamos 800ms desde que el usuario deja de escribir para hacer la petición.
    // Así evitamos que OpenStreetMap nos bloquee (Error 403).
    const delayDebounceFn = setTimeout(async () => {
      try {
        // 🔥 AÑADIMOS EL EMAIL: Es obligatorio por política de Nominatim para evitar bloqueos
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1&email=test@georideapp.com`);
        
        if (!res.ok) throw new Error('Network response was not ok');
        
        const data = await res.json();
        setResults(data);
      } catch (error) {
        console.error("Error buscando dirección:", error);
      } finally {
        setIsTyping(false);
      }
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return { results, isTyping };
}