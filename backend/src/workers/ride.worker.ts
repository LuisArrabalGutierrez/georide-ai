import { Queue, Worker } from 'bullmq';
import { supabase, redisOptions } from '../config/config.js';

export const ridesQueue = new Queue('rides-queue', { connection: redisOptions });

export const rideWorker = new Worker('rides-queue', async (job) => {
  const { rider_id, pickup_lat, pickup_lng, dropoff_lat, dropoff_lng, car_type } = job.data;
  const db_car_type = ['Economy', 'Premium', 'Van XL'].includes(car_type) ? car_type : 'Economy';

  const { data: ride, error: insertError } = await supabase
    .from('rides')
    .insert([{ rider_id, pickup_lat, pickup_lng, dropoff_lat, dropoff_lng, car_type: db_car_type, status: 'Pending' }])
    .select().single();

  if (insertError) throw insertError;
  
  await new Promise(resolve => setTimeout(resolve, 4000));

  const { error: updateError } = await supabase
    .from('rides')
    .update({ status: 'Accepted' })
    .eq('id', ride.id);

  if (updateError) throw updateError;
}, { connection: redisOptions, concurrency: 50 });

export function startTrafficSimulator() {
  setInterval(async () => {
    const { data: drivers } = await supabase.from('active_drivers').select('*').eq('status', 'available');
    if (!drivers) return;

    for (const driver of drivers) {
      const latChange = (Math.random() - 0.5) * 0.0005;
      const lngChange = (Math.random() - 0.5) * 0.0005;
      
      await supabase.from('active_drivers').update({ 
        lat: driver.lat + latChange, 
        lng: driver.lng + lngChange,
        updated_at: new Date().toISOString()
      }).eq('id', driver.id);
    }
  }, 3000);
}