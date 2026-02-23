import type { Ride } from '../types';
import { FaListUl, FaCarSide, FaTaxi, FaShuttleVan } from 'react-icons/fa';

interface Props {
  rides: Ride[];
}

export default function MyRides({ rides }: Props) {
  
  const getCarIcon = (type: string) => {
    if (type.includes('XL')) return <FaShuttleVan className="w-3 h-3" />;
    if (type.includes('Premium')) return <FaTaxi className="w-3 h-3" />;
    return <FaCarSide className="w-3 h-3" />;
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-gray-100 p-6 w-full max-h-[50vh] lg:max-h-[70vh] overflow-y-auto">
      <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
        <FaListUl className="text-gray-400 w-4 h-4" /> Mis Viajes
      </h2>
      
      {rides.length === 0 ? (
        <p className="text-sm text-gray-500 font-medium text-center py-4">Aún no tienes viajes.</p>
      ) : (
        <div className="space-y-3">
          {rides.map(ride => (
            <div key={ride.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col gap-2 hover:border-blue-200 transition-colors cursor-default">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">ID del Viaje</p>
                  <p className="text-xs font-mono font-bold text-gray-700">{ride.id.split('-')[0]}</p>
                </div>
                <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  ride.status.toLowerCase() === 'accepted' ? 'bg-green-100 text-green-700' :
                  ride.status.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-200 text-gray-700'
                }`}>
                  {ride.status}
                </div>
              </div>
              <p className="text-xs text-gray-500 font-medium capitalize flex items-center gap-1.5">
                {getCarIcon(ride.car_type)} {ride.car_type}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}