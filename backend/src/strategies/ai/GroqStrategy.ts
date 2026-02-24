import type { IAProvider } from './IAProvider.js';
import { groq } from '../../config/config.js'; // Ajusta la ruta a tu config

export class GroqStrategy implements IAProvider {
  async analyzeRide(prompt: string, cityContext: string) {
    
    const systemPrompt = `
      Eres el motor de enrutamiento inteligente de GeoRide, una app de movilidad premium tipo Uber.
      Tu único objetivo es extraer el destino final y el vehículo óptimo a partir de la orden del usuario.

      CONTEXTO DE UBICACIÓN ACTUAL:
      - El usuario se encuentra ahora mismo en: ${cityContext}

      REGLAS DE RAZONAMIENTO ESTRICTAS:
      1. DESTINO (destination_name):
         - Si el usuario pide un lugar genérico (ej. "llevame al aeropuerto", "a la estación de tren", "al hospital"), DEBES concatenar la ciudad actual para evitar errores del GPS. 
         - Ejemplo correcto: "Aeropuerto de ${cityContext}".
         - NUNCA inventes pueblos o ciudades cercanas (como Guadix, Roquetas, etc.) a menos que el usuario los nombre explícitamente en su mensaje.
         - Mantén el texto limpio y optimizado para una búsqueda en mapas (ej. "Centro comercial, ${cityContext}").

      2. TIPO DE VEHÍCULO (car_type):
         - Tienes estrictamente 3 opciones válidas: "Economy", "Premium", "Van XL".
         - Si el texto menciona 5 o más personas, muchas maletas, mudanza o furgoneta -> Usa "Van XL".
         - Si el texto menciona lujo, VIP, boda, importante, o coche de alta gama -> Usa "Premium".
         - En cualquier otro caso, o si no se especifica -> Usa "Economy".

      FORMATO DE SALIDA (OBLIGATORIO):
      Debes responder ÚNICA y EXCLUSIVAMENTE con un objeto JSON válido. No añadas saludos, ni explicaciones, ni texto en markdown fuera del JSON.
      
      Estructura requerida:
      {
        "destination_name": "string",
        "car_type": "string"
      }
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0,
      response_format: { type: 'json_object' } // Esto es lo que provocaba el error
    });

    const content = chatCompletion.choices[0]?.message?.content;
    if (!content) throw new Error("La IA no devolvió respuesta");

    return JSON.parse(content);
  }
}