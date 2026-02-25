import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Comprueba si las variables existen antes de intentar conectar
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("🚨 Faltan las variables en el archivo .env del frontend.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);