import http from 'k6/http';
import { check, sleep } from 'k6';

// Curva de carga: Sube a 50 usuarios, se mantiene 20s, y baja a 0  ( 1500 viajes en total )
export const options = {
  stages: [
    { duration: '10s', target: 50 },
    { duration: '20s', target: 50 },
    { duration: '10s', target: 0 }, 
  ],
};

export default function () {
  const url = 'http://localhost:3000/api/rides';
  
  // Datos exactos que espera tu endpoint manual
  const payload = JSON.stringify({
    rider_id: 'f28fc71c-9261-4cc6-9a2f-b03d64beb07b', // Tu ID Real
    pickup_lat: 36.8340,
    pickup_lng: -2.4637,
    dropoff_lat: 36.8400,
    dropoff_lng: -2.4600,
    car_type: 'Economy'
  });

  const params = { headers: { 'Content-Type': 'application/json' } };

  const res = http.post(url, payload, params);

  check(res, {
    'Viaje Manual Encolado (Status 202)': (r) => r.status === 202,
  });

  sleep(1); // 1 petición por segundo por usuario
}