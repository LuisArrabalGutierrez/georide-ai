import { useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../../supabase';
import { useNavigate } from 'react-router-dom';
import type { LocationData, CarType, SearchType, AppScreenStatus, AppMode } from '../../types';

// Componentes
import Header from '../../components/Header';
import MyRides from '../../components/MyRides';
import RideConfirmed from '../../components/RideConfirmed';
import MapView from '../../components/MapView';
import LocationSearch from '../../components/LocationSearch';
import { ReviewPanel } from '../../components/ReviewPanel';
import { TripPlanner } from '../../components/TripPlanner';
import { AnalyzingOverlay } from '../../components/AnalyzingOverlay';
import { ProcessingOverlay } from '../../components/ProcessingOverlay';

// Hooks 
import { useGeolocation } from '../../hooks/useGeolocation'; 
import { useRealtimeRides } from '../../hooks/useRealtimeRides'; 

export default function Home({ session }: { session: Session }) {
  const navigate = useNavigate();
  
  const [status, setStatus] = useState<AppScreenStatus>('IDLE');
  const [appMode, setAppMode] = useState<AppMode>('ai');
  const [isSearching, setIsSearching] = useState<SearchType>(null);
  const [rideId, setRideId] = useState<string | null>(null);

  const [aiPrompt, setAiPrompt] = useState('');
  const [selectedCar, setSelectedCar] = useState<CarType>('Economy');
  const [dropoff, setDropoff] = useState<LocationData>({ name: '¿A dónde vamos?', lat: 36.8400, lng: -2.4600 });

  const { pickup, setPickup, locationError } = useGeolocation(setAppMode);
  const { myRides } = useRealtimeRides(session.user.id, setStatus, setRideId);

  const isSplitScreen = status === 'REVIEW' || status === 'PROCESSING' || status === 'CONFIRMED';

  // 🔥 Lógica de API Restaurada Completa
  const handleAiRequest = async () => {
    if (!aiPrompt.trim()) return;
    setStatus('ANALYZING'); 
    try {
      const response = await fetch('http://localhost:3000/api/ai-ride', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt, currentLocation: pickup, is_mock: false })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setDropoff({ name: data.decision.destination_name, lat: data.decision.coords.lat, lng: data.decision.coords.lng });
      setSelectedCar(data.decision.car_type);
      setStatus('REVIEW');
    } catch (error: any) {
      alert(`Error de IA: ${error.message}`);
      setStatus('IDLE');
    }
  };

  const handleConfirmRide = async () => {
    setStatus('PROCESSING'); 
    try {
      const response = await fetch('http://localhost:3000/api/rides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rider_id: session.user.id, pickup_lat: pickup.lat, pickup_lng: pickup.lng,
          dropoff_lat: dropoff.lat, dropoff_lng: dropoff.lng, car_type: selectedCar
        })
      });
      if (!response.ok) throw new Error('Fallo al pedir coche');
    } catch (error: any) {
      alert(`Error: ${error.message}`);
      setStatus('IDLE');
    }
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col overflow-hidden font-sans">
      
      <div className={`relative w-full transition-all duration-500 z-0 flex-shrink-0 ${isSplitScreen ? 'h-[55vh]' : 'h-full absolute inset-0'}`}>
        <MapView pickup={pickup} dropoff={dropoff} />
      </div>

      <div className="absolute top-0 w-full z-50 pointer-events-none">
        <div className="pointer-events-auto">
          <Header email={session.user.email || ''} onSignOut={() => supabase.auth.signOut().then(() => navigate('/login'))} />
        </div>
      </div>

      {isSplitScreen ? (
        <div className="flex-1 bg-white rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.08)] z-20 flex flex-col animate-in slide-in-from-bottom-10 duration-500">
          <div className="w-full max-w-lg mx-auto px-6 py-6 flex flex-col h-full justify-center">
            {status === 'REVIEW' && <ReviewPanel dropoff={dropoff} selectedCar={selectedCar} onCancel={() => { setStatus('IDLE'); setDropoff({ name: '¿A dónde vamos?', lat: 36.8400, lng: -2.4600 }); }} onConfirm={handleConfirmRide} />}
            {status === 'PROCESSING' && <ProcessingOverlay />}
            {status === 'CONFIRMED' && <RideConfirmed rideId={rideId!} pickup={pickup} dropoff={dropoff} onFinish={() => { setStatus('IDLE'); setRideId(null); setAiPrompt(''); setDropoff({ name: '¿A dónde vamos?', lat: pickup.lat, lng: pickup.lng }); }} />}
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-end lg:justify-center p-4 pb-8 max-w-7xl mx-auto w-full">
          <div className="hidden lg:block absolute left-4 top-24 w-80 pointer-events-auto">
            <MyRides rides={myRides} />
          </div>

          <div className="pointer-events-auto w-full max-w-lg mx-auto bg-white/95 backdrop-blur-xl shadow-2xl rounded-[2.5rem] p-8 border border-gray-100">
            {isSearching ? (
              <LocationSearch type={isSearching} onClose={() => setIsSearching(null)} onSelect={(loc) => { if (isSearching === 'pickup') { setPickup(loc); } else { setDropoff(loc); } setIsSearching(null); }} />
            ) : (
              <>
                {status === 'IDLE' && <TripPlanner appMode={appMode} setAppMode={setAppMode} aiPrompt={aiPrompt} setAiPrompt={setAiPrompt} handleAiRequest={handleAiRequest} locationError={locationError} pickup={pickup} dropoff={dropoff} selectedCar={selectedCar} setSelectedCar={setSelectedCar} setIsSearching={setIsSearching} handleConfirmRide={handleConfirmRide} />}
                {status === 'ANALYZING' && <AnalyzingOverlay />}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}