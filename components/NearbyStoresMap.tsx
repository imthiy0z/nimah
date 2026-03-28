import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../constants/theme';
import { MAP_DEMO_PARTNERS, MOCK_STORES } from '../constants/mockData';
import { useLanguage } from '../contexts/LanguageContext';

type NearbyStoresMapProps = {
  onPartnerPress?: (storeId: string) => void;
};

function distanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Demo partners are placed at fixed offsets from the map anchor (your GPS when
 * allowed, otherwise a fallback). ~0.4–1.1 km apart at mid-latitudes.
 */
const DEMO_SCATTER_DEG = [
  { dLat: 0.0068, dLng: 0.0016 },
  { dLat: -0.0036, dLng: 0.0074 },
  { dLat: -0.0024, dLng: -0.0062 },
] as const;

export default function NearbyStoresMap({ onPartnerPress }: NearbyStoresMapProps) {
  const { t } = useLanguage();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fallbackLat = MOCK_STORES[0]?.latitude ?? 23.6;
  const fallbackLng = MOCK_STORES[0]?.longitude ?? 58.55;

  const scatteredPartners = useMemo(() => {
    const anchorLat = location?.coords.latitude ?? fallbackLat;
    const anchorLng = location?.coords.longitude ?? fallbackLng;
    return MAP_DEMO_PARTNERS.map((store, i) => {
      const o = DEMO_SCATTER_DEG[i % DEMO_SCATTER_DEG.length];
      return {
        store,
        latitude: anchorLat + o.dLat,
        longitude: anchorLng + o.dLng,
      };
    });
  }, [location?.coords.latitude, location?.coords.longitude, fallbackLat, fallbackLng]);

  const nearest = useMemo(() => {
    if (!location) return null;
    let best: { storeId: string; km: number } | null = null;
    for (const { store, latitude, longitude } of scatteredPartners) {
      const km = distanceKm(
        location.coords.latitude,
        location.coords.longitude,
        latitude,
        longitude
      );
      if (!best || km < best.km) best = { storeId: store.id, km };
    }
    return best;
  }, [location, scatteredPartners]);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg(t('map.denied'));
          return;
        }
        let pos: Location.LocationObject | null = null;
        try {
          pos = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
        } catch {
          pos = null;
        }
        if (!pos) {
          pos = await Location.getLastKnownPositionAsync();
        }
        if (pos) {
          setLocation(pos);
        } else {
          setErrorMsg(t('map.noLocation'));
        }
      } catch {
        setErrorMsg(t('map.noLocation'));
      } finally {
        setLoading(false);
      }
    })();
  }, [t]);

  const region = location
    ? {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.042,
        longitudeDelta: 0.042,
      }
    : {
        latitude: fallbackLat,
        longitude: fallbackLng,
        latitudeDelta: 0.12,
        longitudeDelta: 0.12,
      };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{t('map.partnersOnMap')}</Text>
      <View style={styles.mapContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Theme.colors.primary} />
            <Text style={styles.loadingText}>{t('map.loading')}</Text>
          </View>
        ) : (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={region}
            showsUserLocation={!!location}
            showsMyLocationButton={false}
            mapType="standard"
          >
            {scatteredPartners.map(({ store, latitude, longitude }) => (
              <Marker
                key={store.id}
                coordinate={{ latitude, longitude }}
                anchor={{ x: 0.5, y: 1 }}
                tracksViewChanges={false}
                onPress={() => onPartnerPress?.(store.id)}
                accessibilityLabel={`${t(`stores.${store.id}.name`, store.name)}, ${t('map.partnerA11y')}`}
              >
                <View style={styles.partnerPin}>
                  <Ionicons name="restaurant" size={18} color="#FFFFFF" />
                </View>
              </Marker>
            ))}
          </MapView>
        )}
        <View style={styles.cardContainer}>
          <BlurView intensity={20} tint="light" style={styles.cardBlur}>
            <LinearGradient
              colors={['rgba(255,255,255,0.45)', 'rgba(255,255,255,0.2)']}
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            />
            <View style={styles.greyTint} />
            <View style={styles.cardContent}>
              <Ionicons name="restaurant" size={24} color={Theme.colors.primary} />
              <View style={styles.distanceInfo}>
                {nearest ? (
                  <>
                    <Text style={styles.distanceText}>
                      {t('map.kmNearest', undefined, { km: nearest.km.toFixed(1) })}
                    </Text>
                    <Text style={styles.hospitalName}>
                      {t(`stores.${nearest.storeId}.name`)}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.distanceText}>
                      {errorMsg ??
                        t('map.demoPartners', undefined, {
                          count: String(MAP_DEMO_PARTNERS.length),
                        })}
                    </Text>
                    <Text style={styles.hospitalName}>
                      {location ? t('map.placedNear') : t('map.demoData')}
                    </Text>
                  </>
                )}
              </View>
            </View>
          </BlurView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.md,
  },
  cardContainer: {
    position: 'absolute',
    top: Theme.spacing.md,
    left: Theme.spacing.md,
    right: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    zIndex: 10,
  },
  cardBlur: {
    borderRadius: Theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    padding: Theme.spacing.md,
  },
  greyTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    pointerEvents: 'none',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.md,
  },
  distanceInfo: {
    flex: 1,
  },
  distanceText: {
    fontSize: 15,
    fontWeight: '600',
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.xs,
  },
  hospitalName: {
    fontSize: 14,
    color: Theme.colors.text.muted,
  },
  mapContainer: {
    height: 220,
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.background,
  },
  loadingText: {
    marginTop: Theme.spacing.sm,
    fontSize: 14,
    color: Theme.colors.text.muted,
  },
  partnerPin: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.28,
    shadowRadius: 4,
    elevation: 5,
  },
});
