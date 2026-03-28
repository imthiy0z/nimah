import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Modal,
  ScrollView,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '../constants/theme';
import { MOCK_PICKUP_LOCATION } from '../constants/mockData';
import { PICKUP_PLACE_IDS, type PickupPlaceId } from '../constants/pickupPlaces';
import { useLanguage } from '../contexts/LanguageContext';
import { usePickupLocation } from '../contexts/PickupLocationContext';

type DeliveryLocationBarProps = {
  /** @deprecated Sheet opens on tap; kept for rare overrides */
  onPress?: () => void;
  headline?: string;
  addressLine?: string;
  /** Light text / icon for orange or dark headers */
  variant?: 'default' | 'onGradient';
};

export default function DeliveryLocationBar({
  onPress,
  headline: headlineProp,
  addressLine: addressProp,
  variant = 'default',
}: DeliveryLocationBarProps) {
  const { t } = useLanguage();
  const { placeId, setPlaceId } = usePickupLocation();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const [sheetOpen, setSheetOpen] = useState(false);

  const headline = headlineProp ?? t('pickup.headline', MOCK_PICKUP_LOCATION.headline);
  const resolvedAddress =
    addressProp ??
    t(`pickup.places.${placeId}`, t('pickup.addressLine', MOCK_PICKUP_LOCATION.addressLine));
  const hint = t('pickup.hint', MOCK_PICKUP_LOCATION.hint);
  const onG = variant === 'onGradient';

  const openSheet = () => {
    onPress?.();
    setSheetOpen(true);
  };

  const selectPlace = async (id: PickupPlaceId) => {
    await setPlaceId(id);
    setSheetOpen(false);
  };

  const useGps = () => {
    Alert.alert(
      t('pickup.useCurrentLocation'),
      t('pickup.currentLocationComingSoon'),
      [{ text: t('common.cancel') }]
    );
  };

  return (
    <>
      <Pressable
        onPress={openSheet}
        style={({ pressed }) => [styles.wrap, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityHint={hint}
        accessibilityLabel={`${headline}, ${resolvedAddress}`}
      >
        <View style={[styles.iconCircle, onG && styles.iconCircleOnGradient]}>
          <Ionicons
            name="location"
            size={20}
            color={onG ? '#FFFFFF' : Theme.colors.primary}
          />
        </View>
        <View style={styles.textCol}>
          <Text style={[styles.headline, onG && styles.headlineOnGradient]} numberOfLines={1}>
            {headline}
          </Text>
          <View style={styles.addressRow}>
            <Text style={[styles.address, onG && styles.addressOnGradient]} numberOfLines={1}>
              {resolvedAddress}
            </Text>
            <Ionicons
              name="chevron-down"
              size={16}
              color={onG ? 'rgba(255,255,255,0.75)' : Theme.colors.text.muted}
            />
          </View>
        </View>
      </Pressable>

      <Modal
        visible={sheetOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setSheetOpen(false)}
      >
        <View style={styles.modalRoot}>
          <Pressable style={styles.backdrop} onPress={() => setSheetOpen(false)}>
            <BlurView intensity={28} tint="dark" style={StyleSheet.absoluteFill} />
          </Pressable>
          <View
            style={[styles.sheetOuter, { paddingBottom: Math.max(insets.bottom, 16) }]}
            pointerEvents="box-none"
          >
            <View style={[styles.sheet, { maxHeight: height * 0.75 }]}>
              <View style={styles.grabber} />
              <Text style={styles.sheetTitle}>{t('pickup.sheetTitle')}</Text>
              <Text style={styles.sheetSub}>{t('pickup.sheetSub')}</Text>

              <Pressable
                style={({ pressed }) => [styles.gpsRow, pressed && styles.rowPressed]}
                onPress={useGps}
              >
                <View style={styles.gpsIcon}>
                  <Ionicons name="navigate-outline" size={22} color={Theme.colors.primary} />
                </View>
                <View style={styles.gpsText}>
                  <Text style={styles.gpsTitle}>{t('pickup.useCurrentLocation')}</Text>
                  <Text style={styles.gpsSub}>{t('pickup.currentLocationHint')}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={Theme.colors.text.muted} />
              </Pressable>

              <Text style={styles.savedLabel}>{t('pickup.savedAreas')}</Text>
              <ScrollView
                style={styles.list}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {PICKUP_PLACE_IDS.map((id) => {
                  const label = t(
                    `pickup.places.${id}`,
                    id === 'default' ? MOCK_PICKUP_LOCATION.addressLine : id
                  );
                  const selected = placeId === id;
                  return (
                    <Pressable
                      key={id}
                      style={({ pressed }) => [
                        styles.placeRow,
                        selected && styles.placeRowSelected,
                        pressed && styles.rowPressed,
                      ]}
                      onPress={() => selectPlace(id)}
                    >
                      <Ionicons
                        name="location-outline"
                        size={20}
                        color={selected ? Theme.colors.primary : Theme.colors.text.muted}
                      />
                      <Text
                        style={[styles.placeLabel, selected && styles.placeLabelSelected]}
                        numberOfLines={2}
                      >
                        {label}
                      </Text>
                      {selected ? (
                        <Ionicons name="checkmark-circle" size={22} color={Theme.colors.primary} />
                      ) : (
                        <View style={styles.radio} />
                      )}
                    </Pressable>
                  );
                })}
              </ScrollView>

              <Pressable style={styles.doneBtn} onPress={() => setSheetOpen(false)}>
                <Text style={styles.doneBtnTxt}>{t('pickup.done')}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
    gap: Theme.spacing.sm,
    paddingVertical: 2,
  },
  pressed: {
    opacity: 0.85,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(249, 115, 22, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleOnGradient: {
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  textCol: {
    flex: 1,
    minWidth: 0,
  },
  headline: {
    fontSize: 11,
    fontWeight: '600',
    color: Theme.colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 1,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  address: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: Theme.colors.text.primary,
    minWidth: 0,
  },
  headlineOnGradient: {
    color: 'rgba(255,255,255,0.8)',
  },
  addressOnGradient: {
    color: '#FFFFFF',
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetOuter: {
    width: '100%',
  },
  sheet: {
    backgroundColor: Theme.colors.white,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(42,63,78,0.08)',
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(42,63,78,0.15)',
    marginBottom: Theme.spacing.md,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: Theme.colors.text.primary,
  },
  sheetSub: {
    marginTop: 4,
    marginBottom: Theme.spacing.md,
    fontSize: 14,
    fontWeight: '600',
    color: Theme.colors.text.muted,
    lineHeight: 20,
  },
  gpsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: 'rgba(249, 115, 22, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.22)',
    marginBottom: Theme.spacing.md,
  },
  rowPressed: { opacity: 0.92 },
  gpsIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gpsText: { flex: 1, minWidth: 0 },
  gpsTitle: { fontSize: 16, fontWeight: '800', color: Theme.colors.text.primary },
  gpsSub: { marginTop: 2, fontSize: 12, fontWeight: '600', color: Theme.colors.text.muted },
  savedLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: Theme.colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  list: { maxHeight: 280 },
  placeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: Theme.borderRadius.md,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(42,63,78,0.08)',
    backgroundColor: Theme.colors.white,
  },
  placeRowSelected: {
    borderColor: Theme.colors.primary,
    backgroundColor: 'rgba(249, 115, 22, 0.06)',
  },
  placeLabel: { flex: 1, fontSize: 16, fontWeight: '700', color: Theme.colors.text.primary },
  placeLabelSelected: { color: Theme.colors.primaryDark },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: 'rgba(42,63,78,0.2)',
  },
  doneBtn: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 4,
  },
  doneBtnTxt: { fontSize: 17, fontWeight: '900', color: Theme.colors.primary },
});
