import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Modal,
  Pressable,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../constants/theme';
import type { RescueBag } from '../constants/mockData';
import { useLanguage } from '../contexts/LanguageContext';
import OmrCurrency from './OmrCurrency';

const { height } = Dimensions.get('window');

type ReserveBagModalProps = {
  visible: boolean;
  onClose: () => void;
  storeName?: string;
  bag?: RescueBag | null;
  /** When `mode="cart"`, the confirm action will call `onConfirmQty` and label becomes "Add to cart". */
  mode?: 'reserve' | 'cart';
  onConfirmQty?: (qty: number) => void;
};

export default function ReserveBagModal({
  visible,
  onClose,
  storeName,
  bag,
  mode = 'reserve',
  onConfirmQty,
}: ReserveBagModalProps) {
  const { t, isRtl } = useLanguage();
  const [qty, setQty] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const maxQty = bag?.left ?? 1;
  const unitPrice = bag?.price ?? 0;
  const total = unitPrice * qty;

  const handleConfirm = () => {
    const chosenQty = qty;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setQty(1);
      onConfirmQty?.(chosenQty);
      onClose();
    }, 900);
  };

  if (!bag) {
    return null;
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <BlurView intensity={30} tint="light" style={styles.sheetBlur}>
            <LinearGradient
              colors={['rgba(255,255,255,0.98)', 'rgba(255,255,255,0.94)']}
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            />
            <View style={styles.drag} />
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.title}>{t('reserve.title')}</Text>
                {storeName ? <Text style={styles.sub}>{storeName}</Text> : null}
              </View>
              <Pressable onPress={onClose} style={styles.closeHit} accessibilityRole="button">
                <Ionicons name="close" size={22} color={Theme.colors.text.primary} />
              </Pressable>
            </View>

            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollInner}
              showsVerticalScrollIndicator={false}
            >
              <Image source={bag.image} style={styles.bagHero} contentFit="cover" />
              <Text style={styles.bagTitle}>{t(`bags.${bag.id}.title`, bag.title)}</Text>
              <Text style={styles.blurb}>{t(`bags.${bag.id}.blurb`, bag.blurb)}</Text>
              <View style={styles.row}>
                <Ionicons name="time-outline" size={18} color={Theme.colors.primary} />
                <Text style={styles.meta}>{t(`bags.${bag.id}.pickup`, bag.pickupWindow)}</Text>
              </View>
              <View style={styles.row}>
                <Ionicons name="pricetag-outline" size={18} color={Theme.colors.primary} />
                <View style={[styles.valueLineRow, isRtl && styles.valueLineRowRtl]}>
                  <Text style={styles.meta}>{t('reserve.valueLineTilde')}</Text>
                  <OmrCurrency
                    amount={bag.retailValue}
                    variant="short"
                    textStyle={styles.meta}
                    iconSize={14}
                  />
                  <Text style={styles.meta}>{t('reserve.valueLineMid')}</Text>
                  <OmrCurrency
                    amount={unitPrice}
                    variant="full"
                    textStyle={styles.meta}
                    iconSize={14}
                  />
                </View>
              </View>
              <Text style={styles.disclaimer}>{t('reserve.disclaimer')}</Text>

              <Text style={styles.qtyLabel}>{t('reserve.howMany')}</Text>
              <View style={styles.stepper}>
                <Pressable
                  style={[styles.stepBtn, qty <= 1 && styles.stepBtnOff]}
                  onPress={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                >
                  <Ionicons name="remove" size={20} color={Theme.colors.text.primary} />
                </Pressable>
                <Text style={styles.qtyNum}>{qty}</Text>
                <Pressable
                  style={[styles.stepBtn, qty >= maxQty && styles.stepBtnOff]}
                  onPress={() => setQty((q) => Math.min(maxQty, q + 1))}
                  disabled={qty >= maxQty}
                >
                  <Ionicons name="add" size={20} color={Theme.colors.text.primary} />
                </Pressable>
              </View>
              <View style={[styles.totalRow, isRtl && styles.totalRowRtl]}>
                <Text style={styles.total}>{t('reserve.totalDemoPrefix')}</Text>
                <OmrCurrency
                  amount={total}
                  variant="full"
                  textStyle={styles.total}
                  iconSize={17}
                />
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <Pressable style={styles.secondary} onPress={onClose}>
                <Text style={styles.secondaryText}>{t('reserve.notNow')}</Text>
              </Pressable>
              <Pressable
                style={[styles.primary, submitting && styles.primaryOff]}
                onPress={handleConfirm}
                disabled={submitting}
              >
                <LinearGradient
                  colors={[Theme.colors.primary, Theme.colors.primaryDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
                <Text style={styles.primaryText}>
                  {submitting
                    ? t('reserve.saving')
                    : mode === 'cart'
                      ? t('cart.addToCart', 'Add to cart')
                      : t('reserve.confirm')}
                </Text>
              </Pressable>
            </View>
          </BlurView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    maxHeight: height * 0.88,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  sheetBlur: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    paddingBottom: 24,
  },
  drag: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Theme.spacing.lg,
    paddingBottom: Theme.spacing.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Theme.colors.text.primary,
  },
  sub: {
    fontSize: 14,
    color: Theme.colors.text.muted,
    marginTop: 2,
  },
  closeHit: {
    padding: Theme.spacing.xs,
  },
  scroll: {
    maxHeight: height * 0.5,
  },
  scrollInner: {
    paddingHorizontal: Theme.spacing.lg,
    paddingBottom: Theme.spacing.md,
  },
  bagHero: {
    width: '100%',
    height: 168,
    borderRadius: Theme.borderRadius.lg,
    marginBottom: Theme.spacing.md,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  bagTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.sm,
  },
  blurb: {
    fontSize: 14,
    color: Theme.colors.text.muted,
    lineHeight: 20,
    marginBottom: Theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
  },
  meta: {
    fontSize: 14,
    color: Theme.colors.text.primary,
  },
  valueLineRow: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  valueLineRowRtl: {
    flexDirection: 'row-reverse',
  },
  disclaimer: {
    fontSize: 12,
    color: Theme.colors.text.muted,
    marginTop: Theme.spacing.sm,
    marginBottom: Theme.spacing.lg,
    lineHeight: 18,
  },
  qtyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.sm,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
  },
  stepBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(249, 115, 22, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepBtnOff: {
    opacity: 0.35,
  },
  qtyNum: {
    fontSize: 20,
    fontWeight: '700',
    minWidth: 32,
    textAlign: 'center',
    color: Theme.colors.text.primary,
  },
  totalRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 4,
  },
  totalRowRtl: {
    flexDirection: 'row-reverse',
  },
  total: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.text.primary,
  },
  footer: {
    flexDirection: 'row',
    gap: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  secondary: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: Theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
  },
  secondaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.text.primary,
  },
  primary: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryOff: {
    opacity: 0.7,
  },
  primaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.white,
  },
});
