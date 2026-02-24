import { supabase } from '../config/config.js';

export class RideRepository {
  async createRide(rideData: any) {
    const db_car_type = ['Economy', 'Premium', 'Van XL'].includes(rideData.car_type) 
      ? rideData.car_type 
      : 'Economy';

    const { data, error } = await supabase
      .from('rides')
      .insert([{ 
        ...rideData, 
        car_type: db_car_type, 
        status: 'Pending' 
      }])
      .select().single();

    if (error) throw new Error(`Error insertando viaje: ${error.message}`);
    return data;
  }

  async updateRideStatus(id: string, status: string) {
    const { error } = await supabase
      .from('rides')
      .update({ status })
      .eq('id', id);

    if (error) throw new Error(`Error actualizando estado: ${error.message}`);
  }
}

export const rideRepository = new RideRepository();