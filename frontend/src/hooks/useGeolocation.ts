import { useState, useEffect } from 'react';
import type { LocationData, AppMode } from '../types/index.ts';

// Control the geolocation logic and state

export function useGeolocation(setAppMode: (mode: AppMode) => void) {
  const [pickup, setPickup] = useState<LocationData>({ name: 'Buscando...', lat: 36.8340, lng: -2.4637 });
  const [locationError, setLocationError] = useState(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPickup({ name: 'Mi ubicación actual', lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocationError(false);
        },
        () => {
          setLocationError(true);
          setAppMode('manual');
        },
        { timeout: 10000 }
      );
    }
  }, [setAppMode]);

  return { pickup, setPickup, locationError };
}