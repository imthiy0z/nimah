import React, { useMemo } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../constants/theme';
import { useLanguage } from '../contexts/LanguageContext';

export type MapCoord = { latitude: number; longitude: number };

type OrdersDeliveryMapProps = {
  store: MapCoord;
  destination: MapCoord;
  courier: MapCoord;
  showUserLocation?: boolean;
  loading?: boolean;
  etaMinutes: number;
  driverName: string;
  driverAvatar?: number;
};

function regionForRoute(
  store: MapCoord,
  destination: MapCoord,
  courier: MapCoord
) {
  const lats = [store.latitude, destination.latitude, courier.latitude];
  const lngs = [store.longitude, destination.longitude, courier.longitude];
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const midLat = (minLat + maxLat) / 2;
  const midLng = (minLng + maxLng) / 2;
  const latDelta = Math.max((maxLat - minLat) * 2.4, 0.035);
  const lngDelta = Math.max((maxLng - minLng) * 2.4, 0.035);
  return {
    latitude: midLat,
    longitude: midLng,
    latitudeDelta: latDelta,
    longitudeDelta: lngDelta,
  };
}

export default function OrdersDeliveryMap({
  store,
  destination,
  courier,
  showUserLocation = false,
  loading = false,
  etaMinutes,
  driverName,
  driverAvatar,
}: OrdersDeliveryMapProps) {
  const { t } = useLanguage();
  const routeCoords = useMemo(() => {
    const mid = {
      latitude: (store.latitude + destination.latitude) / 2 + 0.0011,
      longitude: (store.longitude + destination.longitude) / 2 - 0.0013,
    };
    return [store, mid, destination];
  }, [store, destination]);

  const region = useMemo(
    () => regionForRoute(store, destination, courier),
    [store, destination, courier]
  );

  if (loading) {
    return (
      <View style={[styles.mapShell, styles.loadingBox]}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
        <Text style={styles.loadingLabel}>{t('delivery.loadingMap')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <MapView
        key={`${region.latitude.toFixed(4)}-${region.longitude.toFixed(4)}`}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        showsUserLocation={showUserLocation}
        showsMyLocationButton={false}
        mapType="standard"
      >
        <Polyline
          coordinates={routeCoords}
          strokeColor={Theme.colors.primary}
          strokeWidth={4}
          lineCap="round"
          lineJoin="round"
        />
        <Marker coordinate={store} anchor={{ x: 0.5, y: 1 }} tracksViewChanges={false}>
          <View style={styles.storePin}>
            <Ionicons name="restaurant" size={16} color="#FFFFFF" />
          </View>
        </Marker>
        <Marker coordinate={courier} anchor={{ x: 0.5, y: 1 }} tracksViewChanges={false}>
          <View style={styles.courierPin}>
            {driverAvatar != null ? (
              <Image
                source={driverAvatar}
                style={styles.courierImg}
                contentFit="cover"
              />
            ) : (
              <Ionicons name="bicycle" size={18} color={Theme.colors.primary} />
            )}
          </View>
        </Marker>
        {!showUserLocation ? (
          <Marker coordinate={destination} anchor={{ x: 0.5, y: 1 }} tracksViewChanges={false}>
            <View style={styles.homePin}>
              <Ionicons name="home" size={16} color="#FFFFFF" />
            </View>
          </Marker>
        ) : null}
      </MapView>
      <View style={styles.etaBadge} pointerEvents="none">
        <Ionicons name="time-outline" size={18} color={Theme.colors.primary} />
        <View style={styles.etaTextCol}>
          <Text style={styles.etaText}>
          {t('orders.mapEta', undefined, { min: String(etaMinutes) })}
        </Text>
          <Text style={styles.driverHint}>{driverName}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    height: 220,
    position: 'relative',
  },
  mapShell: {
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    height: 220,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loadingBox: {
    backgroundColor: Theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingLabel: {
    marginTop: Theme.spacing.sm,
    fontSize: 14,
    color: Theme.colors.text.muted,
  },
  storePin: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  homePin: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Theme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    elevation: 4,
  },
  courierPin: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Theme.colors.primary,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 4,
    elevation: 5,
  },
  courierImg: {
    width: '100%',
    height: '100%',
  },
  etaBadge: {
    position: 'absolute',
    left: Theme.spacing.md,
    top: Theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    backgroundColor: 'rgba(255,255,255,0.96)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  etaTextCol: {
    flexShrink: 1,
  },
  etaText: {
    fontSize: 16,
    fontWeight: '800',
    color: Theme.colors.text.primary,
  },
  driverHint: {
    fontSize: 12,
    fontWeight: '600',
    color: Theme.colors.text.muted,
    marginTop: 2,
  },
});
