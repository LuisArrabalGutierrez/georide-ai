import { FaMagic, FaHandPointer, FaExclamationTriangle } from 'react-icons/fa';
import type { AppMode, LocationData, CarType, SearchType } from '../types';
import RideSelection from './RideSelection';

interface Props {
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
  aiPrompt: string;
  setAiPrompt: (prompt: string) => void;
  handleAiRequest: () => void;
  locationError: boolean;
  pickup: LocationData;
  dropoff: LocationData;
  selectedCar: CarType;
  setSelectedCar: (car: CarType) => void;
  setIsSearching: (searchType: SearchType) => void;
  handleConfirmRide: () => void;
}

export const TripPlanner = ({ 
  appMode, setAppMode, aiPrompt, setAiPrompt, handleAiRequest, locationError, 
  pickup, dropoff, selectedCar, setSelectedCar, setIsSearching, handleConfirmRide 
}: Props) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
    <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
      <button onClick={() => { if (!locationError) setAppMode('ai'); }} className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${appMode === 'ai' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'} ${locationError ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <FaMagic /> Modo IA
      </button>
      <button onClick={() => setAppMode('manual')} className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${appMode === 'manual' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>
        <FaHandPointer /> Manual
      </button>
    </div>

    {appMode === 'ai' && (
      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none"><FaMagic className="text-blue-500" /></div>
          <textarea rows={3} value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="Ej: Llevame al aeropuerto..." className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 text-gray-900 rounded-2xl focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none" />
        </div>
        <button onClick={handleAiRequest} disabled={!aiPrompt.trim()} className="w-full py-4.5 text-lg font-bold text-white bg-black rounded-2xl hover:bg-gray-800 transition-all active:scale-95 flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50">
          <FaMagic /> Analizar Petición
        </button>
        {locationError && (
          <div className="flex items-center gap-2 mt-2 text-amber-600 text-sm bg-amber-50 p-3 rounded-xl border border-amber-200">
             <FaExclamationTriangle /> <p>GPS desactivado. Pasa a modo manual.</p>
          </div>
        )}
      </div>
    )}

    {appMode === 'manual' && (
      <RideSelection pickup={pickup} dropoff={dropoff} selectedCar={selectedCar} onSelectCar={setSelectedCar} onSearchMode={setIsSearching} onConfirm={handleConfirmRide} />
    )}
  </div>
);