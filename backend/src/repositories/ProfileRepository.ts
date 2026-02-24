import { supabase } from '../config/config.ts';

export class ProfileRepository {
  async getById(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .eq('id', userId)
      .single();

    if (error) throw new Error(`Error en DB: ${error.message}`);
    return data;
  }
}

// Exportamos una instancia para usarla directamente
export const profileRepository = new ProfileRepository();