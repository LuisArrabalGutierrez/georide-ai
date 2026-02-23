## 🧠 Decisiones de Diseño de Sistema (System Design Deep Dive)

### ¿Por qué Redis se usa en `/api/rides` y no en `/api/ai-ride`?
En este proyecto, hemos aplicado un patrón de **Separación de Responsabilidades** basado en la naturaleza de la tarea:

1.  **`/api/ai-ride` (Procesamiento Síncrono con IA):**
    * **Por qué NO usa Redis:** Introdujimos una pantalla de **Confirmación (Review)**. Necesitamos que el usuario valide que la IA ha entendido bien el destino (evitando errores como el del Aeródromo de Olula vs Aeropuerto) antes de persistir nada en la base de datos.
    * **El Flujo:** Es una operación de "solo lectura" y procesamiento lógico. No satura la base de datos porque no escribe. Priorizamos la **consistencia y validación humana** sobre la asincronía.

2.  **`/api/rides` (Escritura Asíncrona con Redis/BullMQ):**
    * **Por qué SÍ usa Redis:** Una vez que el usuario confirma, la prioridad cambia a **Escalabilidad**. 
    * **Manejo de Picos:** Si 10,000 usuarios confirman su viaje al terminar un evento masivo, no podemos abrir 10,000 conexiones a PostgreSQL.
    * **Nivelación de Carga (Load Leveling):** Redis actúa como un "amortiguador". La API acepta la petición en milisegundos y el Worker escribe en la base de datos a un ritmo que esta pueda soportar (`concurrency: 50`), garantizando que ninguna petición se pierda aunque la base de datos esté bajo estrés.



---

## 🧪 Estrategia de Testing de Carga (Stress Testing con k6)

Para validar la arquitectura, hemos realizado dos tipos de tests de carga utilizando **k6 (Grafana)**, simulando escenarios reales de alta demanda.

### 1. Test de Ingestión Masiva (Manual Flow)
* **Comando:** `k6 run test-manual.js`
* **Escenario:** 50 Usuarios Virtuales (VUs) concurrentes realizando peticiones sin descanso.
* **Objetivo:** Medir la capacidad de **BullMQ** y **Redis** para gestionar una cola de mensajes masiva.
* **Observaciones:** Se valida cómo el servidor Express mantiene una latencia baja (~60ms) mientras la cola de Redis se llena. El servidor no bloquea al usuario; el trabajo se delega.

### 2. Test de Lógica e Integración (AI Flow)
* **Comando:** `k6 run test-ai.js`
* **Escenario:** Rampa de subida hasta 50 VUs con un `sleep` de 1s entre peticiones para simular comportamiento humano.
* **Objetivo:** Testear la capacidad de la CPU de Node.js para procesar objetos JSON complejos y lógica de geolocalización.
* **Manejo de APIs Externas:** Durante el test, implementamos un **Mocking** para las llamadas a OpenStreetMap (Nominatim). 
    * *Lección aprendida:* Las APIs públicas gratuitas aplican *Rate Limiting* (Error 429) casi de inmediato. En producción, esto demuestra la necesidad de usar **Caché de Coordenadas** en Redis para evitar llamadas redundantes a servicios externos.

---

## 🛡️ Seguridad y Resiliencia

* **Hashing de Contraseñas:** La autenticación utiliza **Bcrypt** a través de Supabase Auth. Las contraseñas nunca se guardan en texto plano; se aplica un *Salt* único y una función de hash de una sola vía, cumpliendo con los estándares de la industria.
* **Graceful Degradation (Degradación Elegante):** Si el usuario deniega el acceso al GPS, el sistema desactiva automáticamente el "Modo IA" y ofrece una interfaz manual. Esto garantiza que la app sea usable incluso cuando las condiciones del entorno (hardware/permisos) no son óptimas.
* **Human-in-the-loop:** La arquitectura de la IA obliga a una revisión visual de la ruta en el mapa antes de crear el registro en la base de datos, reduciendo drásticamente los errores de procesamiento de lenguaje natural (NLP).