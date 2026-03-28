import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  ScrollView,
  Pressable,
  Modal,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../constants/theme';
import { useLanguage } from '../contexts/LanguageContext';
import OmrCurrency from '../components/OmrCurrency';

const { height } = Dimensions.get('window');

type ReportsScreenProps = {
  onBack?: () => void;
};

type RescueReceipt = {
  id: string;
  storeId: string;
  bagId: string;
  storeName: string;
  bagTitle: string;
  paid: number;
  retailValue: number;
  date: string;
  pickupWindow: string;
  note: string;
};

const receipts: RescueReceipt[] = [
  {
    id: '1',
    storeId: 'lovera',
    bagId: 'lov-dessert-magic',
    storeName: 'Lovera',
    bagTitle: 'Dessert magic box',
    paid: 5.49,
    retailValue: 18,
    date: '2026-03-20',
    pickupWindow: '8:30–9:00 PM',
    note: 'Thank you for rescuing surplus food.',
  },
  {
    id: '2',
    storeId: 'gregandi',
    bagId: 'greg-pizza-surprise',
    storeName: 'Gregandi',
    bagTitle: 'Pizza surprise plate',
    paid: 1.2,
    retailValue: 3,
    date: '2026-03-18',
    pickupWindow: '10:00–10:30 PM',
    note: 'Show this receipt at pickup.',
  },
  {
    id: '3',
    storeId: 'omani-house',
    bagId: 'oh-grill-plate',
    storeName: 'Omani House',
    bagTitle: 'Grill plate',
    paid: 1,
    retailValue: 5,
    date: '2026-03-10',
    pickupWindow: '8:00–8:30 PM',
    note: 'Contents vary — surplus only.',
  },
];

export default function ReportsScreen({ onBack }: ReportsScreenProps) {
  const { t, locale, rtlMirror, isRtl } = useLanguage();
  const [selected, setSelected] = useState<RescueReceipt | null>(null);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString(locale === 'ar' ? 'ar' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backButton} accessibilityRole="button">
          <BlurView intensity={22} tint="light" style={styles.backBlur}>
            <Ionicons name="arrow-back" size={20} color="#2A3F4E" style={rtlMirror} />
          </BlurView>
        </Pressable>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>{t('reports.title')}</Text>
          <Text style={styles.headerSub}>
            {t('reports.sub', undefined, { count: String(receipts.length) })}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollInner}
        showsVerticalScrollIndicator={false}
      >
        {receipts.map((r) => (
          <Pressable
            key={r.id}
            style={({ pressed }) => [styles.card, pressed && { opacity: 0.95 }]}
            onPress={() => setSelected(r)}
          >
            <BlurView intensity={28} tint="light" style={styles.cardBlur}>
              <LinearGradient
                colors={['rgba(255,255,255,0.96)', 'rgba(255,255,255,0.88)']}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
              />
              <View style={styles.cardTop}>
                <View style={styles.iconCircle}>
                  <Ionicons name="leaf" size={22} color={Theme.colors.primary} />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.store}>{t(`stores.${r.storeId}.name`, r.storeName)}</Text>
                  <Text style={styles.bag}>{t(`bags.${r.bagId}.title`, r.bagTitle)}</Text>
                </View>
                <OmrCurrency
                  amount={r.paid}
                  variant="full"
                  textStyle={styles.paid}
                  iconSize={16}
                  iconTintColor={Theme.colors.primary}
                />
              </View>
              <View style={[styles.metaRow, isRtl && styles.metaRowRtl]}>
                <Ionicons name="calendar-outline" size={14} color={Theme.colors.text.muted} />
                <Text style={styles.meta}>{formatDate(r.date)}</Text>
                <Text style={styles.dot}>·</Text>
                <View style={[styles.retailRow, isRtl && styles.retailRowRtl]}>
                  <Text style={styles.meta}>{t('reports.retailApprox')}</Text>
                  <OmrCurrency
                    amount={r.retailValue}
                    variant="short"
                    textStyle={styles.meta}
                    iconSize={12}
                  />
                  <Text style={styles.meta}> {t('reports.retailValueWord')}</Text>
                </View>
              </View>
            </BlurView>
          </Pressable>
        ))}
      </ScrollView>

      <Modal visible={!!selected} transparent animationType="fade" onRequestClose={() => setSelected(null)}>
        <Pressable style={styles.modalBg} onPress={() => setSelected(null)}>
          <Pressable style={styles.modalSheet} onPress={(e) => e.stopPropagation()}>
            <BlurView intensity={40} tint="light" style={styles.modalBlur}>
              {selected && (
                <>
                  <Text style={styles.modalTitle}>{t('reports.receiptTitle')}</Text>
                  <Text style={styles.modalStore}>
                    {t(`stores.${selected.storeId}.name`, selected.storeName)}
                  </Text>
                  <Text style={styles.modalBag}>
                    {t(`bags.${selected.bagId}.title`, selected.bagTitle)}
                  </Text>
                  <View style={[styles.modalRow, isRtl && styles.modalRowRtl]}>
                    <Text style={styles.modalLbl}>{t('reports.paid')}</Text>
                    <OmrCurrency
                      amount={selected.paid}
                      variant="full"
                      textStyle={styles.modalVal}
                      iconSize={17}
                      iconTintColor={Theme.colors.primary}
                    />
                  </View>
                  <View style={[styles.modalRow, isRtl && styles.modalRowRtl]}>
                    <Text style={styles.modalLbl}>{t('reports.pickup')}</Text>
                    <Text style={styles.modalVal}>
                      {t(`bags.${selected.bagId}.pickup`, selected.pickupWindow)}
                    </Text>
                  </View>
                  <View style={[styles.modalRow, isRtl && styles.modalRowRtl]}>
                    <Text style={styles.modalLbl}>{t('reports.date')}</Text>
                    <Text style={styles.modalVal}>{formatDate(selected.date)}</Text>
                  </View>
                  <Text style={styles.modalNote}>
                    {t(`reports.items.${selected.id}.note`, selected.note)}
                  </Text>
                  <Pressable style={styles.modalClose} onPress={() => setSelected(null)}>
                    <Text style={styles.modalCloseText}>{t('reports.close')}</Text>
                  </Pressable>
                </>
              )}
            </BlurView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 52,
    paddingHorizontal: Theme.spacing.lg,
    paddingBottom: Theme.spacing.md,
  },
  backButton: {
    marginRight: Theme.spacing.sm,
  },
  backBlur: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Theme.colors.text.primary,
  },
  headerSub: {
    fontSize: 13,
    color: Theme.colors.text.muted,
    marginTop: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollInner: {
    paddingHorizontal: Theme.spacing.lg,
    paddingBottom: 40,
  },
  card: {
    marginBottom: Theme.spacing.md,
    borderRadius: Theme.borderRadius.xl,
    overflow: 'hidden',
  },
  cardBlur: {
    borderRadius: Theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    padding: Theme.spacing.lg,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(249,115,22,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  store: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.text.primary,
  },
  bag: {
    fontSize: 13,
    color: Theme.colors.text.muted,
    marginTop: 2,
  },
  paid: {
    fontSize: 18,
    fontWeight: '800',
    color: Theme.colors.primary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  metaRowRtl: {
    flexDirection: 'row-reverse',
  },
  retailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  retailRowRtl: {
    flexDirection: 'row-reverse',
  },
  meta: {
    fontSize: 12,
    color: Theme.colors.text.muted,
  },
  dot: {
    color: Theme.colors.text.muted,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: Theme.spacing.lg,
  },
  modalSheet: {
    maxHeight: height * 0.55,
    borderRadius: Theme.borderRadius.xl,
    overflow: 'hidden',
  },
  modalBlur: {
    padding: Theme.spacing.xl,
    borderRadius: Theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.colors.text.muted,
    textTransform: 'uppercase',
    marginBottom: Theme.spacing.sm,
  },
  modalStore: {
    fontSize: 20,
    fontWeight: '800',
    color: Theme.colors.text.primary,
  },
  modalBag: {
    fontSize: 15,
    color: Theme.colors.text.muted,
    marginBottom: Theme.spacing.lg,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.sm,
  },
  modalRowRtl: {
    flexDirection: 'row-reverse',
  },
  modalLbl: {
    fontSize: 14,
    color: Theme.colors.text.muted,
  },
  modalVal: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.colors.text.primary,
  },
  modalNote: {
    fontSize: 13,
    color: Theme.colors.text.muted,
    marginTop: Theme.spacing.md,
    lineHeight: 18,
  },
  modalClose: {
    marginTop: Theme.spacing.lg,
    backgroundColor: Theme.colors.primary,
    paddingVertical: 14,
    borderRadius: Theme.borderRadius.lg,
    alignItems: 'center',
  },
  modalCloseText: {
    color: Theme.colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
});
