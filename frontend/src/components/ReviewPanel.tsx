import { FaMapMarkerAlt, FaCarSide } from 'react-icons/fa';
import type { LocationData, CarType } from '../types';

interface Props {
  dropoff: LocationData;
  selectedCar: CarType;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ReviewPanel = ({ dropoff, selectedCar, onCancel, onConfirm }: Props) => (
  <div className="space-y-6 flex flex-col h-full justify-between animate-in slide-in-from-bottom-10">
    <div className="text-center pt-2">
      <h2 className="text-2xl font-black text-gray-900">Confirma tu viaje</h2>
    </div>
    <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-3xl space-y-4">
      <div className="flex items-center gap-4">
        <FaMapMarkerAlt className="text-blue-600" />
        <div className="overflow-hidden">
          <p className="text-[11px] font-extrabold text-blue-500 uppercase tracking-wider">Destino</p>
          <p className="font-bold text-gray-900 truncate">{dropoff.name}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <FaCarSide className="text-gray-700" />
        <p className="font-bold text-gray-900">{selectedCar}</p>
      </div>
    </div>
    <div className="flex gap-3">
      <button onClick={onCancel} className="flex-1 py-4 bg-gray-100 rounded-2xl font-bold">Cancelar</button>
      <button onClick={onConfirm} className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg">Confirmar</button>
    </div>
  </div>
);
