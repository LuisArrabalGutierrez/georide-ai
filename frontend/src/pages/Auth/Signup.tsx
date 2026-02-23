import { useState } from 'react';
import { supabase } from '../../supabase';
import { Link, useNavigate } from 'react-router-dom';

const translateError = (errorMsg: string): string => {
  if (errorMsg.includes('User already registered')) return 'Este correo ya está registrado. Inicia sesión.';
  if (errorMsg.includes('Password should be at least')) return 'La contraseña es demasiado corta.';
  return 'Ha ocurrido un error inesperado. Inténtalo de nuevo.';
};

export default function Signup() {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const validateForm = () => {
    if (fullName.trim().length < 2) { setMessage({ text: 'Introduce tu nombre real.', type: 'error' }); return false; }
    if (!email.includes('@')) { setMessage({ text: 'Correo inválido.', type: 'error' }); return false; }
    if (password.length < 6) { setMessage({ text: 'Mínimo 6 caracteres de contraseña.', type: 'error' }); return false; }
    return true;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!validateForm()) return;
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password, 
        options: { data: { full_name: fullName.trim() } } 
      });
      if (error) throw error;
      
      setMessage({ text: '¡Casi listo! Revisa tu bandeja de entrada para confirmar.', type: 'success' });
      setTimeout(() => navigate('/login'), 3500); // Lo enviamos a login en 3.5 segundos
    } catch (error) {
      setMessage({ text: translateError((error as { message: string }).message), type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/home` }
      });
      if (error) throw error;
    } catch (error: unknown) {
      setMessage({ text: 'Ha ocurrido un error con Google.', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 selection:bg-blue-200">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Únete a GeoRide</h2>
          <p className="mt-2 text-sm text-gray-500">Crea tu cuenta en segundos</p>
        </div>

        {message && (
          <div className={`p-4 rounded-xl text-sm font-medium animate-in fade-in ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSignup} noValidate>
          <div className="space-y-4">
            <input type="text" required placeholder="Tu Nombre Completo" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl" />
            <input type="email" required placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl" />
            <input type="password" required placeholder="Contraseña (mín. 6 caracteres)" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl" />
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 px-4 font-bold rounded-xl text-white bg-black hover:bg-gray-800 transition-all active:scale-95 cursor-pointer">
            {loading ? 'Procesando...' : 'Crear cuenta'}
          </button>
        </form>

        <button onClick={handleGoogleSignup} type="button" disabled={loading} className="mt-6 w-full py-3 px-4 border border-gray-300 rounded-xl bg-white text-gray-700 font-bold hover:bg-gray-50 flex justify-center items-center gap-3 cursor-pointer">
          Registrarse con Google
        </button>

        <div className="text-center mt-6">
          <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-800">
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}