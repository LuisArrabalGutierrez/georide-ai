import type { CarType, LocationData } from '../types';
import { FaCarSide, FaTaxi, FaShuttleVan } from 'react-icons/fa';

interface Props {
  pickup: LocationData;
  dropoff: LocationData;
  selectedCar: CarType;
  onSelectCar: (car: CarType) => void;
  onSearchMode: (type: 'pickup' | 'dropoff') => void;
  onConfirm: () => void;
}

const CAR_OPTIONS = [
  { id: 'Economy' as CarType, icon: <FaCarSide />, name: 'Economy', time: '3 min', price: '12,50 €' },
  { id: 'Premium' as CarType, icon: <FaTaxi />, name: 'Premium', time: '5 min', price: '18,20 €' },
  { id: 'Van XL' as CarType, icon: <FaShuttleVan />, name: 'Van XL', time: '4 min', price: '22,00 €' }
];

export default function RideSelection({ pickup, dropoff, selectedCar, onSelectCar, onSearchMode, onConfirm }: Props) {
  const isReady = dropoff.name !== '¿A dónde vamos?';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative flex flex-col gap-3">
        <div className="absolute left-4 top-[1.3rem] bottom-[1.3rem] w-0.5 bg-gray-200 z-0"></div>
        
        <button onClick={() => onSearchMode('pickup')} className="relative z-10 flex items-center gap-4 bg-gray-50 p-3.5 rounded-2xl border border-gray-200 hover:border-gray-400 transition-colors text-left w-full group cursor-pointer">
          <div className="w-2.5 h-2.5 bg-black rounded-full shadow-sm group-hover:scale-125 transition-transform"></div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Recogida</p>
            <p className="text-sm font-semibold text-gray-900 truncate">{pickup.name}</p>
          </div>
        </button>

        <button onClick={() => onSearchMode('dropoff')} className="relative z-10 flex items-center gap-4 bg-blue-50/50 p-3.5 rounded-2xl border border-blue-200 hover:border-blue-400 transition-colors text-left w-full group cursor-pointer">
          <div className="w-2.5 h-2.5 bg-blue-600 rounded-sm shadow-sm group-hover:scale-125 transition-transform"></div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-0.5">Destino</p>
            <p className="text-sm font-semibold text-blue-900 truncate">{dropoff.name}</p>
          </div>
        </button>
      </div>

      <div className="pt-2">
        <h3 className="text-sm font-bold text-gray-900 mb-3 px-1">Elige un vehículo</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x hide-scrollbar">
          {CAR_OPTIONS.map((car) => (
            <button key={car.id} onClick={() => onSelectCar(car.id)} className={`snap-center flex-shrink-0 w-28 p-4 rounded-2xl border-2 transition-all text-left cursor-pointer ${selectedCar === car.id ? 'border-black bg-gray-50 ring-4 ring-gray-100' : 'border-transparent bg-white shadow-sm hover:bg-gray-50'}`}>
              <div className="text-3xl mb-2 text-gray-700">{car.icon}</div>
              <h4 className="font-bold text-gray-900 text-sm">{car.name}</h4>
              <p className="text-xs text-gray-500 font-medium mb-1">{car.time}</p>
              <p className="font-black text-gray-900">{car.price}</p>
            </button>
          ))}
        </div>
      </div>

      <button onClick={onConfirm} disabled={!isReady} className="w-full py-4.5 mt-2 text-lg font-bold text-white bg-black rounded-2xl hover:bg-gray-800 transition-all active:scale-95 shadow-[0_8px_20px_rgba(0,0,0,0.2)] disabled:bg-gray-300 disabled:shadow-none cursor-pointer">
        Confirmar Viaje
      </button>
    </div>
  );
}