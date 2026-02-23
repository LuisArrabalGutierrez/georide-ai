import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabase';
import type { Session } from '@supabase/supabase-js';

// Importamos las Páginas
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Home from './pages/Home/Home';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Comprobamos la sesión inicial
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Pantalla de carga mientras comprobamos la sesión (Evita parpadeos)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        
        {/* Redirección por defecto */}
        <Route path="/" element={<Navigate to={session ? "/home" : "/login"} replace />} />

        {/* Rutas Públicas: Usamos los nuevos componentes Login y Signup */}
        <Route 
          path="/login" 
          element={session ? <Navigate to="/home" replace /> : <Login />} 
        />
        <Route 
          path="/signup" 
          element={session ? <Navigate to="/home" replace /> : <Signup />} 
        />

        {/* Rutas Privadas */}
        <Route 
          path="/home" 
          element={session ? <Home session={session} /> : <Navigate to="/login" replace />} 
        />
        
        {/* Ruta 404: Si escribe cualquier otra cosa en la URL */}
        <Route path="*" element={<Navigate to="/" replace />} />
        
      </Routes>
    </BrowserRouter>
  );
}