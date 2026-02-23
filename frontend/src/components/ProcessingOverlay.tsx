import { CgSpinnerTwoAlt } from 'react-icons/cg';

export const ProcessingOverlay = () => (
  <div className="flex flex-col items-center justify-center py-10 animate-in zoom-in-95">
    <div className="relative w-24 h-24 mb-6">
      <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
      <div className="relative w-full h-full bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-blue-500">
        <CgSpinnerTwoAlt className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    </div>
    <h2 className="text-2xl font-black text-gray-900">Contactando conductor...</h2>
    <p className="text-sm text-gray-500 mt-2 text-center">Buscando conductores disponibles en el mapa.</p>
  </div>
);