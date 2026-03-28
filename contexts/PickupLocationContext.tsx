import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  PICKUP_PLACE_STORAGE_KEY,
  type PickupPlaceId,
  isPickupPlaceId,
} from '../constants/pickupPlaces';
import { safeStorageGet, safeStorageSet } from '../utils/safeStorage';

type PickupLocationContextValue = {
  placeId: PickupPlaceId;
  setPlaceId: (id: PickupPlaceId) => Promise<void>;
  ready: boolean;
};

const PickupLocationContext = createContext<PickupLocationContextValue | null>(null);

export function PickupLocationProvider({ children }: { children: React.ReactNode }) {
  const [placeId, setPlaceIdState] = useState<PickupPlaceId>('default');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await safeStorageGet(PICKUP_PLACE_STORAGE_KEY);
        if (!cancelled && raw && isPickupPlaceId(raw)) {
          setPlaceIdState(raw);
        }
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setPlaceId = useCallback(async (id: PickupPlaceId) => {
    setPlaceIdState(id);
    await safeStorageSet(PICKUP_PLACE_STORAGE_KEY, id);
  }, []);

  const value = useMemo(
    () => ({ placeId, setPlaceId, ready }),
    [placeId, setPlaceId, ready]
  );

  return (
    <PickupLocationContext.Provider value={value}>{children}</PickupLocationContext.Provider>
  );
}

export function usePickupLocation(): PickupLocationContextValue {
  const ctx = useContext(PickupLocationContext);
  if (!ctx) {
    throw new Error('usePickupLocation must be used within PickupLocationProvider');
  }
  return ctx;
}
