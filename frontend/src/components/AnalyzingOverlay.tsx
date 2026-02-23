import { FaMagic } from 'react-icons/fa';

export const AnalyzingOverlay = () => (
  <div className="flex flex-col items-center justify-center py-10 animate-in zoom-in-95">
    <div className="relative w-24 h-24 mb-6">
      <div className="absolute inset-0 bg-purple-100 rounded-full animate-ping opacity-75"></div>
      <div className="relative w-full h-full bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-purple-500 text-3xl">
        <FaMagic className="text-purple-500" />
      </div>
    </div>
    <h2 className="text-2xl font-black text-gray-900 tracking-tight">IA Analizando...</h2>
    <p className="text-sm text-gray-500 mt-2 text-center">Calculando mejor ruta y vehículo.</p>
  </div>
);