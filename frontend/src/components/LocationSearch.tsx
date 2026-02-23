import { useState } from 'react';
import type { SearchType, PlaceResult, LocationData } from '../types';
import { useAddressSearch } from '../hooks/useAddressSearch';
import { MdArrowBackIosNew, MdLocationOn } from 'react-icons/md';

interface Props {
  type: SearchType;
  onClose: () => void;
  onSelect: (location: LocationData) => void;
}

export default function LocationSearch({ type, onClose, onSelect }: Props) {
  const [query, setQuery] = useState('');
  const { results, isTyping } = useAddressSearch(query);

  const handleSelect = (place: PlaceResult) => {
    onSelect({
      name: `${place.display_name.split(',')[0]}, ${place.display_name.split(',')[1] || ''}`,
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon)
    });
  };

  if (!type) return null;

  return (
    <div className="flex flex-col h-full bg-gray-50 animate-in slide-in-from-bottom-8 duration-300 p-6 rounded-t-3xl">
      <div className="flex items-center gap-4 mb-6 relative z-50">
        <button onClick={onClose} aria-label="Volver" className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 cursor-pointer flex items-center justify-center">
          <MdArrowBackIosNew className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-xl font-bold text-gray-900">{type === 'pickup' ? 'Punto de Recogida' : 'Destino'}</h2>
      </div>
      
      <div className="relative z-50 pointer-events-auto">
        <input
          type="text" autoFocus placeholder="Ej: Puerta de Alcalá, Madrid..."
          value={query} onChange={(e) => setQuery(e.target.value)}
          className="w-full px-5 py-4 bg-white border-2 border-blue-500 text-gray-900 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 shadow-sm text-lg"
        />
      </div>

      <div className="mt-6 flex-1 overflow-y-auto space-y-2 relative z-40">
        {isTyping && <p className="text-sm text-gray-500 text-center animate-pulse">Buscando...</p>}
        {results.map((place, i) => (
          <button key={i} onClick={() => handleSelect(place)} className="w-full text-left p-4 bg-white rounded-xl border border-gray-100 hover:border-blue-300 hover:bg-blue-50 transition-colors flex items-center gap-4 cursor-pointer">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
               <MdLocationOn className="w-5 h-5" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="font-bold text-gray-900 text-sm truncate">{place.display_name.split(',')[0]}</p>
              <p className="text-xs text-gray-500 truncate">{place.display_name}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}