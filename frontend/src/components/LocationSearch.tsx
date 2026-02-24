import { useState } from 'react';
import { FaArrowLeft, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import { CgSpinnerTwoAlt } from 'react-icons/cg';
import { useAddressSearch } from '../hooks/useAddressSearch';
import type { LocationData, SearchType } from '../types';

interface Props {
  type: SearchType;
  onClose: () => void;
  onSelect: (location: LocationData) => void;
}

export default function LocationSearch({ type, onClose, onSelect }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Aquí nuestro hook con Photon hace la magia de forma segura
  const { results, loading } = useAddressSearch(searchTerm);

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right-8 duration-300">
      
      {/* 🔍 Buscador */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-full transition-colors">
          <FaArrowLeft className="text-gray-600" />
        </button>
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={type === 'pickup' ? '¿Dónde estás?' : '¿A dónde vamos?'}
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:bg-white focus:outline-none focus:border-black transition-all font-medium text-gray-900"
          />
        </div>
      </div>

      {/* 📋 Lista de resultados */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center py-8">
            <CgSpinnerTwoAlt className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : (
          <div className="space-y-2">
            {results.map((result, index) => (
              <button
                key={index}
                onClick={() => onSelect(result)}
                className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <FaMapMarkerAlt className="text-gray-500" />
                </div>
                <div className="overflow-hidden">
                  {/* 🔥 EL ARREGLO: Ya no hacemos .split(), pintamos directamente el nombre */}
                  <p className="font-bold text-gray-900 truncate">{result.name}</p>
                  
                  {/* Si el hook nos mandó ciudad/estado, lo ponemos como subtítulo */}
                  {result.address && (
                    <p className="text-sm text-gray-500 truncate">{result.address}</p>
                  )}
                </div>
              </button>
            ))}
            
            {/* Mensaje de "Sin resultados" */}
            {searchTerm.length > 2 && results.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                No hemos encontrado resultados para "{searchTerm}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}