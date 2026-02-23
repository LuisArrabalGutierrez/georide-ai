import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';
import type { Ride, AppScreenStatus } from '../types/index.ts';

export function useRealtimeRides(userId: string, setStatus: (s: AppScreenStatus) => void, setRideId: (id: string) => void) {
  const [myRides, setMyRides] = useState<Ride[]>([]);

  const fetchMyRides = useCallback(async () => {
    const { data } = await supabase.from('rides').select('*').eq('rider_id', userId)
      .order('created_at', { ascending: false }).limit(10);
    if (data) setMyRides(data);
  }, [userId]);

  useEffect(() => {
    fetchMyRides();

    const channel = supabase.channel(`rides-${userId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rides', filter: `rider_id=eq.${userId}` }, 
      (payload) => {
        fetchMyRides();
        if (payload.eventType === 'UPDATE' && payload.new.status === 'Accepted') {
          setStatus('CONFIRMED');
          setRideId(payload.new.id);
        }
      }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [userId, fetchMyRides, setStatus, setRideId]);

  return { myRides };
}