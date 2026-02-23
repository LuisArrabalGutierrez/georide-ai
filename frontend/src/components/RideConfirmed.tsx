import type { LocationData } from '../types';
import { FaStar } from 'react-icons/fa';

interface Props {
  rideId: string;
  pickup: LocationData;
  dropoff: LocationData;
  onFinish: () => void;
}

export default function RideConfirmed({ rideId, pickup, dropoff, onFinish }: Props) {
  return (
    <div className="animate-in slide-in-from-right-8 duration-500">
      <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl text-sm font-bold inline-flex items-center gap-2 mb-6">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        Tu conductor está en camino
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex items-center gap-4">
        <div className="w-14 h-14 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
          <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${rideId}&backgroundColor=e2e8f0`} alt="Conductor" loading="lazy" />
        </div>
        <div className="flex-1">
          <h3 className="font-black text-gray-900 text-lg">Carlos M.</h3>
          <div className="flex items-center gap-1 text-sm text-gray-500 font-medium">
            <FaStar className="text-yellow-400 w-3 h-3" /> 4.9
          </div>
        </div>
        <div className="text-right">
          <div className="bg-gray-100 px-2 py-1 rounded-md text-xs font-mono font-bold text-gray-700 mb-1">8492 KLM</div>
          <p className="text-xs text-gray-500 font-medium">Toyota Prius</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-3 border border-gray-100">
        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
            <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Desde</p><p className="text-xs font-bold text-gray-700 truncate max-w-[150px]">{pickup.name}</p></div>
            <div className="text-right"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Hasta</p><p className="text-xs font-bold text-gray-700 truncate max-w-[150px]">{dropoff.name}</p></div>
        </div>
      </div>

      <button onClick={onFinish} className="w-full py-4 text-sm font-bold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer">
        Salir
      </button>
    </div>
  );
}