import { useState } from 'react';
import { supabase } from '../../supabase';
import { Link, useNavigate } from 'react-router-dom';

const translateError = (errorMsg: string): string => {
  if (errorMsg.includes('Invalid login credentials')) return 'Correo o contraseña incorrectos.';
  return 'Ha ocurrido un error inesperado. Inténtalo de nuevo.';
};

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!email.includes('@') || password.length < 6) {
      setMessage({ text: 'Por favor, introduce credenciales válidas.', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/home'); // Redirigimos al Home si hay éxito
    } catch (error) {
      setMessage({ text: translateError((error as { message: string }).message), type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/home` }
      });
      if (error) throw error;
    } catch {
      setMessage({ text: 'Ha ocurrido un error con Google.', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 selection:bg-blue-200">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Bienvenido</h2>
          <p className="mt-2 text-sm text-gray-500">Inicia sesión para continuar</p>
        </div>

        {message && (
          <div className={`p-4 rounded-xl text-sm font-medium animate-in fade-in ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleLogin} noValidate>
          <div className="space-y-4">
            <input type="email" required placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl" />
            <input type="password" required placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl" />
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 px-4 font-bold rounded-xl text-white bg-black hover:bg-gray-800 transition-all active:scale-95 cursor-pointer">
            {loading ? 'Procesando...' : 'Entrar a la app'}
          </button>
        </form>

        <button onClick={handleGoogleLogin} type="button" disabled={loading} className="mt-6 w-full py-3 px-4 border border-gray-300 rounded-xl bg-white text-gray-700 font-bold hover:bg-gray-50 flex justify-center items-center gap-3 cursor-pointer">
          Continuar con Google
        </button>

        <div className="text-center mt-6">
          <Link to="/signup" className="text-sm font-medium text-blue-600 hover:text-blue-800">
            ¿No tienes cuenta? Regístrate gratis
          </Link>
        </div>
      </div>
    </div>
  );
}