import { Queue, Worker } from 'bullmq';
import { redisOptions } from '../config/config.js';

// Importamos nuestros Repositorios (Patrón Repository)
import { rideRepository } from '../repositories/RideRepository.js';
import { driverRepository } from '../repositories/DriverRepository.js';

// 1. Exportamos la Cola
export const ridesQueue = new Queue('rides-queue', { connection: redisOptions });

// 2. Exportamos el Worker de BullMQ
export const rideWorker = new Worker('rides-queue', async (job) => {
  const { rider_id, pickup_lat, pickup_lng, dropoff_lat, dropoff_lng, car_type } = job.data;
  
  // Paso 1: Creamos el viaje usando el Repositorio
  const ride = await rideRepository.createRide({
    rider_id, pickup_lat, pickup_lng, dropoff_lat, dropoff_lng, car_type
  });
  
  // Paso 2: Simulamos que buscamos conductor durante 4 segundos
  await new Promise(resolve => setTimeout(resolve, 4000));

  // Paso 3: Actualizamos a "Aceptado" usando el Repositorio
  await rideRepository.updateRideStatus(ride.id, 'Accepted');

}, { connection: redisOptions, concurrency: 50 });

// 3. Exportamos el Simulador de Tráfico
export function startTrafficSimulator() {
  setInterval(async () => {
    try {
      // Obtenemos conductores desde el Repositorio
      const drivers = await driverRepository.getAvailableDrivers();
      if (!drivers) return;

      for (const driver of drivers) {
        // Lógica de movimiento aleatorio
        const latChange = (Math.random() - 0.5) * 0.0005;
        const lngChange = (Math.random() - 0.5) * 0.0005;
        
        // Actualizamos ubicación usando el Repositorio
        await driverRepository.updateDriverLocation(
          driver.id, 
          driver.lat + latChange, 
          driver.lng + lngChange
        );
      }
    } catch (error) {
      console.error("Error en el simulador de tráfico:", error);
    }
  }, 3000);
}