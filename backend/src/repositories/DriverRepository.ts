import { supabase } from '../config/config.js';

export class DriverRepository {
  async getAvailableDrivers() {
    const { data, error } = await supabase
      .from('active_drivers')
      .select('*')
      .eq('status', 'available');
    
    if (error) throw error;
    return data;
  }

  async updateDriverLocation(id: string, lat: number, lng: number) {
    const { error } = await supabase
      .from('active_drivers')
      .update({ 
        lat, 
        lng,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
      
    if (error) throw error;
  }
}

export const driverRepository = new DriverRepository();