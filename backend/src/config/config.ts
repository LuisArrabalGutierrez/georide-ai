import { createClient } from '@supabase/supabase-js';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

// 1. Conexión a Supabase
export const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

// 2. Conexión a la IA de Groq
export const groq = new Groq({ apiKey: process.env.GROQ_KEY });

// 3. Conexión a Redis para el sistema de colas
export const redisOptions = {
  host: '127.0.0.1',
  port: 6379,
  maxRetriesPerRequest: null,
};