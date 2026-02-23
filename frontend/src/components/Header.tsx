export default function Header({ email, onSignOut }: { email: string; onSignOut: () => void }) {
  return (
    <header className="relative z-10 pt-8 pb-4 w-full flex justify-center items-center gap-6 px-4">
      
      {/* Logo GeoRide */}
      <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-sm border border-gray-200/50">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">GeoRide<span className="text-blue-600">.</span></h1>
      </div>

      {/* Perfil y Cerrar Sesión (Un poco separado justo al lado) */}
      <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-full shadow-sm border border-gray-200/50 flex items-center gap-3 pr-5">
        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold">
          {email.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-gray-900">Perfil</span>
          <button onClick={onSignOut} className="text-[10px] text-red-500 font-bold hover:underline cursor-pointer transition-colors">
            Cerrar Sesión
          </button>
        </div>
      </div>
      
    </header>
  );
}