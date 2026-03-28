import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../constants/theme';
import ReserveBagModal from './ReserveBagModal';
import { MOCK_ORDERS } from '../constants/mockData';
import { getStoreById } from '../constants/mockData';
import { useLanguage } from '../contexts/LanguageContext';
import OmrCurrency from './OmrCurrency';

type UpcomingAppointmentProps = {
  onPress?: () => void;
};

export default function UpcomingAppointment({ onPress }: UpcomingAppointmentProps) {
  const { t, rtlMirror } = useLanguage();
  const [modalVisible, setModalVisible] = useState(false);

  const upcoming = MOCK_ORDERS.find((o) => o.status === 'upcoming');
  const store = upcoming ? getStoreById(upcoming.storeId) : undefined;
  const bag = store?.bags.find((b) => b.id === upcoming?.bagId) ?? store?.bags[0];

  if (!upcoming) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{t('upcoming.heading')}</Text>

      <Pressable
        onPress={() => {
          setModalVisible(true);
          onPress?.();
        }}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        accessibilityRole="button"
        accessibilityLabel={`${t('upcoming.heading')} ${t(`stores.${upcoming.storeId}.name`, upcoming.storeName)}`}
      >
        <BlurView intensity={20} tint="light" style={styles.cardBlur}>
          {store?.image ? (
            <Image source={store.image} style={styles.bg} contentFit="cover" />
          ) : null}
          <LinearGradient
            colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.75)']}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          <View style={styles.cardContent}>
            <View style={styles.detailsContainer}>
              <Text style={styles.storeName} numberOfLines={1}>
                {t(`stores.${upcoming.storeId}.name`, upcoming.storeName)}
              </Text>
              <Text style={styles.bagTitle} numberOfLines={1}>
                {t(`bags.${upcoming.bagId}.title`, upcoming.bagTitle)}
              </Text>
              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={16} color="#FFFFFF" />
                <Text style={styles.infoText}>
                  {t(`bags.${upcoming.bagId}.pickup`, upcoming.pickupWindow)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="cash-outline" size={16} color="#FFFFFF" />
                <View style={styles.paidRow}>
                  <OmrCurrency
                    amount={upcoming.price}
                    variant="full"
                    textStyle={styles.infoText}
                    iconSize={15}
                    iconTintColor="#FFFFFF"
                  />
                  <Text style={styles.infoText}> {t('upcoming.paidDemoSuffix')}</Text>
                </View>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={22}
              color="#FFFFFF"
              style={[styles.arrow, rtlMirror]}
            />
          </View>
        </BlurView>
      </Pressable>
      <ReserveBagModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        storeName={t(`stores.${upcoming.storeId}.name`, upcoming.storeName)}
        bag={bag ?? null}
      />
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
    color: '#2A3F4E',
    marginBottom: Theme.spacing.md,
  },
  card: {
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  cardBlur: {
    borderRadius: Theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    minHeight: 120,
    overflow: 'hidden',
    position: 'relative',
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.lg,
    zIndex: 1,
  },
  detailsContainer: {
    flex: 1,
    gap: 6,
  },
  storeName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bagTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.92)',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  paidRow: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  arrow: {
    marginLeft: Theme.spacing.sm,
  },
});
