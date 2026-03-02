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
// Si existe la variable REDIS_URL (en Render), la analizamos. Si no, usamos configuración local.
const redisUrl = process.env.REDIS_URL;

console.log("==========================================");
console.log("VARIABLE REDIS_URL LEÍDA:", redisUrl);
console.log("==========================================");

let redisHost = '127.0.0.1';
let redisPort = 6379;
let redisPassword = undefined;

if (redisUrl) {
  const parsedUrl = new URL(redisUrl);
  redisHost = parsedUrl.hostname;
  redisPort = Number(parsedUrl.port) || 6379;
  redisPassword = parsedUrl.password || undefined;
}

export const redisOptions = {
  host: redisHost,
  port: redisPort,
  password: redisPassword,
  maxRetriesPerRequest: null,
};