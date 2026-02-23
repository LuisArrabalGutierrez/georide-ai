import { MapContainer, TileLayer, Marker, Polyline, useMap, AttributionControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import { useEffect, useState } from 'react';
import type { LocationData } from '../types';
import { supabase } from '../supabase';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const carIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3202/3202926.png', // Icono de vehículo actualizado
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  className: 'transition-transform duration-1000'
});

// 🔥 COMPONENTE ACTUALIZADO: Arregla el bug de los "cachos grises"
function MapResizer() {
  const map = useMap();
  
  useEffect(() => {
    // Escucha cualquier cambio de tamaño en el div del mapa
    const observer = new ResizeObserver(() => {
      // Usamos requestAnimationFrame para que no dé tirones al animarse
      requestAnimationFrame(() => {
        map.invalidateSize();
      });
    });
    
    observer.observe(map.getContainer());

    // Parche de seguridad extra: Forzamos un último cálculo justo cuando 
    // sabemos que la animación de 500ms del Tailwind ha terminado.
    const timeoutId = setTimeout(() => {
      map.invalidateSize();
    }, 550);

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [map]);
  
  return null;
}

function RouteFitter({ routeCoords }: { routeCoords: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (routeCoords.length > 0) {
      map.fitBounds(routeCoords, { padding: [40, 40], animate: true, duration: 1 });
    }
  }, [routeCoords, map]);
  return null;
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 15, { animate: true, duration: 1.5 });
  }, [center, map]);
  return null;
}

interface Driver { id: string; lat: number; lng: number; car_type: string; }
interface Props { pickup: LocationData; dropoff?: LocationData; }

export default function MapView({ pickup, dropoff }: Props) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [route, setRoute] = useState<[number, number][]>([]);

  useEffect(() => {
    const fetchDrivers = async () => {
      const { data } = await supabase.from('active_drivers').select('*').eq('status', 'available');
      if (data) setDrivers(data);
    };
    fetchDrivers();

    const channel = supabase.channel('drivers_map')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'active_drivers' }, 
        (payload) => {
          const updatedDriver = payload.new as Driver;
          setDrivers((current) => current.map(d => d.id === updatedDriver.id ? updatedDriver : d));
        }
      ).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    if (dropoff && dropoff.name !== '¿A dónde vamos?') {
      const fetchRoute = async () => {
        try {
          const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${dropoff.lng},${dropoff.lat}?geometries=geojson`);
          const data = await res.json();
          if (data.routes && data.routes[0]) {
            const coords = data.routes[0].geometry.coordinates.map((c: number[]) => [c[1], c[0]] as [number, number]);
            setRoute(coords);
          }
        } catch (error) {
          console.error("Error obteniendo la ruta:", error);
        }
      };
      fetchRoute();
    } else {
      setRoute([]);
    }
  }, [pickup, dropoff]);

  return (
    <div className="absolute inset-0 z-0 bg-gray-200">
      <MapContainer 
        center={[pickup.lat, pickup.lng]} 
        zoom={15} 
        zoomControl={false} 
        attributionControl={false}
        className="w-full h-full">
        
        <MapResizer />

        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
        {route.length > 0 ? <RouteFitter routeCoords={route} /> : <MapUpdater center={[pickup.lat, pickup.lng]} />}
        {route.length > 0 && <Polyline positions={route} color="#2563eb" weight={5} opacity={0.8} />}
        
        <Marker position={[pickup.lat, pickup.lng]} />
        {dropoff && dropoff.name !== '¿A dónde vamos?' && <Marker position={[dropoff.lat, dropoff.lng]} opacity={0.9} />}
        {drivers.map(driver => (
          <Marker key={driver.id} position={[driver.lat, driver.lng]} icon={carIcon} zIndexOffset={100} />
        ))}

      </MapContainer>
    </div>
  );
}