import http from 'k6/http';
import { check, sleep } from 'k6';

// Misma curva de carga para poder comparar resultados de forma justa ( 1500 viajes en total )
export const options = {
  stages: [
    { duration: '10s', target: 50 },
    { duration: '20s', target: 50 },
    { duration: '10s', target: 0 },
  ],
};

export default function () {
  const url = 'http://localhost:3000/api/ai-ride';
  
  // Datos exactos que espera tu endpoint de IA
  const payload = JSON.stringify({
    rider_id: 'f28fc71c-9261-4cc6-9a2f-b03d64beb07b', // Tu ID Real
    prompt: "Necesito ir al centro urgente somos 4 personas", 
    currentLocation: { lat: 36.8340, lng: -2.4637 },
    is_mock: true // 🔥 VITAL: Saltamos Groq y Nominatim para evitar baneos por DDoS
  });

  const params = { headers: { 'Content-Type': 'application/json' } };

  const res = http.post(url, payload, params);

  check(res, {
    'Viaje IA Encolado (Status 202)': (r) => r.status === 202,
  });

  sleep(1); // 1 petición por segundo por usuario
}