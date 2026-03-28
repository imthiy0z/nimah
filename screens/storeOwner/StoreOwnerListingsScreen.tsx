import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  ScrollView,
  Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../../constants/theme';
import StoreOwnerTabBar from '../../components/StoreOwnerTabBar';
import StoreOwnerHeader from '../../components/StoreOwnerHeader';
import { useLanguage } from '../../contexts/LanguageContext';
import { getStoreById, type RescueBag } from '../../constants/mockData';
import OmrCurrency from '../../components/OmrCurrency';
import { foodImages } from '../../constants/foodAssets';
import {
  ListingFormModal,
  ScanStockModal,
  BulkEditModal,
  emptyListingForm,
  listingFormFromBag,
  bagFromForm,
  type ListingFormValues,
} from '../../components/StoreOwnerListingModals';

const SCREEN_HPAD = Theme.spacing.sm + Theme.spacing.xs;

type Props = {
  storeId: string;
  activeTab: string;
  onTabPress: (tabId: string) => void;
  onNotificationsPress?: () => void;
  onSupportChatPress?: () => void;
  messageUnreadCount?: number;
};

export default function StoreOwnerListingsScreen({
  storeId,
  activeTab,
  onTabPress,
  onNotificationsPress,
  onSupportChatPress,
  messageUnreadCount = 0,
}: Props) {
  const { t } = useLanguage();
  const store = getStoreById(storeId);

  const defaultImage = store?.bags[0]?.image ?? foodImages.famousFood;
  const defaultTags = useMemo(
    () => (store?.categories?.length ? [store.categories[0]] : ['Meals']) as string[],
    [store?.categories]
  );

  const [bags, setBags] = useState<RescueBag[]>([]);
  useEffect(() => {
    const s = getStoreById(storeId);
    setBags((s?.bags ?? []).map((b) => ({ ...b })));
  }, [storeId]);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [formInitial, setFormInitial] = useState(emptyListingForm);
  const [editTargetId, setEditTargetId] = useState<string | null>(null);

  const [scanOpen, setScanOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);

  const openAdd = useCallback(() => {
    setFormMode('add');
    setEditTargetId(null);
    setFormInitial(emptyListingForm());
    setFormOpen(true);
  }, []);

  const openEdit = useCallback((id: string) => {
    const b = bags.find((x) => x.id === id);
    if (!b) return;
    setFormMode('edit');
    setEditTargetId(id);
    setFormInitial(listingFormFromBag(b));
    setFormOpen(true);
  }, [bags]);

  const handleFormSave = useCallback(
    (values: ListingFormValues) => {
      if (formMode === 'add') {
        const id = `owner-${Date.now()}`;
        const b = bagFromForm(id, values, defaultImage, defaultTags);
        if (!b) return;
        setBags((prev) => [...prev, { ...b, image: defaultImage }]);
      } else if (editTargetId) {
        setBags((prev) => {
          const existing = prev.find((x) => x.id === editTargetId);
          if (!existing) return prev;
          const b = bagFromForm(editTargetId, values, existing.image, existing.tags);
          if (!b) return prev;
          return prev.map((x) => (x.id === editTargetId ? b : x));
        });
      }
      setFormOpen(false);
    },
    [defaultImage, defaultTags, editTargetId, formMode]
  );

  const handleAddScanned = useCallback(
    (partial: Pick<RescueBag, 'title' | 'blurb'>) => {
      const id = `owner-scan-${Date.now()}`;
      const row: RescueBag = {
        id,
        title: partial.title,
        blurb: partial.blurb,
        retailValue: 5,
        price: 1.2,
        pickupWindow: 'Today 7:00–9:00 PM',
        left: 4,
        tags: [...defaultTags],
        image: defaultImage,
      };
      setBags((prev) => [...prev, row]);
    },
    [defaultImage, defaultTags]
  );

  const handleBulkSetStock = useCallback((selectedIds: string[], newLeft: number) => {
    setBags((prev) =>
      prev.map((b) => (selectedIds.includes(b.id) ? { ...b, left: newLeft } : b))
    );
  }, []);

  const handleBulkMinusOne = useCallback((selectedIds: string[]) => {
    setBags((prev) =>
      prev.map((b) =>
        selectedIds.includes(b.id) ? { ...b, left: Math.max(0, b.left - 1) } : b
      )
    );
  }, []);

  const formSheetTitle =
    formMode === 'add' ? t('storeOwner.listingFormAddTitle') : t('storeOwner.listingFormEditTitle');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollInner}
        showsVerticalScrollIndicator={false}
      >
        <StoreOwnerHeader
          title={t('storeOwner.listingsTitle')}
          subtitle={t('storeOwner.listingsSub')}
          onNotificationsPress={onNotificationsPress}
          onTabPress={onTabPress}
          onSupportChatPress={onSupportChatPress}
          activeTab={activeTab}
        />

        <Pressable
          style={[styles.addBtn, { marginHorizontal: SCREEN_HPAD }]}
          onPress={openAdd}
        >
          <Ionicons name="add-circle-outline" size={22} color={Theme.colors.white} />
          <Text style={styles.addBtnTxt}>{t('storeOwner.addListing')}</Text>
        </Pressable>

        <Text style={[styles.subSection, { paddingHorizontal: SCREEN_HPAD }]}>
          {t('storeOwner.listingsActionsTitle')}
        </Text>
        <View style={[styles.toolRow, { paddingHorizontal: SCREEN_HPAD }]}>
          <Pressable
            style={({ pressed }) => [styles.toolHalf, pressed && styles.pressed]}
            onPress={() => setScanOpen(true)}
          >
            <Ionicons name="barcode-outline" size={22} color={Theme.colors.primary} />
            <Text style={styles.toolTitle}>{t('storeOwner.scanStock')}</Text>
            <Text style={styles.toolSub}>{t('storeOwner.scanStockSub')}</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.toolHalf, pressed && styles.pressed]}
            onPress={() => setBulkOpen(true)}
          >
            <Ionicons name="layers-outline" size={22} color={Theme.colors.primary} />
            <Text style={styles.toolTitle}>{t('storeOwner.bulkEdit')}</Text>
            <Text style={styles.toolSub}>{t('storeOwner.bulkEditSub')}</Text>
          </Pressable>
        </View>

        <View style={[styles.jumpRow, { paddingHorizontal: SCREEN_HPAD }]}>
          <Pressable
            style={({ pressed }) => [styles.jumpBtn, pressed && styles.pressed]}
            onPress={() => onTabPress('owner-orders')}
          >
            <Ionicons name="bag-handle-outline" size={20} color={Theme.colors.white} />
            <Text style={styles.jumpTxt}>{t('storeOwner.linkOpenOrders')}</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.jumpBtnOutline, pressed && styles.pressed]}
            onPress={() => onSupportChatPress?.()}
          >
            <Ionicons name="help-circle-outline" size={20} color={Theme.colors.primary} />
            <Text style={styles.jumpOutlineTxt}>{t('storeOwner.menuHelp')}</Text>
          </Pressable>
        </View>

        {bags.map((bag) => (
          <View key={bag.id} style={[styles.row, { marginHorizontal: SCREEN_HPAD }]}>
            <Image source={bag.image} style={styles.thumb} contentFit="cover" />
            <View style={styles.rowMid}>
              <Text style={styles.itemTitle} numberOfLines={2}>
                {bag.title}
              </Text>
              <Text style={styles.leftLine}>
                {t('storeOwner.unitsLeft', undefined, { n: String(bag.left) })}
              </Text>
              <View style={styles.priceRow}>
                <OmrCurrency
                  amount={bag.price}
                  variant="full"
                  textStyle={styles.price}
                  iconSize={13}
                  iconTintColor={Theme.colors.primaryDark}
                />
                <Text style={styles.retail}>
                  {' '}
                  ~{bag.retailValue.toFixed(2)} {t('storeOwner.retailShort')}
                </Text>
              </View>
            </View>
            <Pressable style={styles.editBtn} onPress={() => openEdit(bag.id)}>
              <Ionicons name="create-outline" size={20} color={Theme.colors.primary} />
            </Pressable>
          </View>
        ))}
      </ScrollView>
      <StoreOwnerTabBar
        activeTab={activeTab}
        onTabPress={onTabPress}
        messageUnreadCount={messageUnreadCount}
      />

      <ListingFormModal
        visible={formOpen}
        initial={formInitial}
        sheetTitle={formSheetTitle}
        saveLabel={t('storeOwner.listingSave')}
        cancelLabel={t('common.cancel')}
        fieldTitle={t('storeOwner.listingFieldTitle')}
        fieldBlurb={t('storeOwner.listingFieldBlurb')}
        fieldRetail={t('storeOwner.listingFieldRetail')}
        fieldPrice={t('storeOwner.listingFieldPrice')}
        fieldUnits={t('storeOwner.listingFieldUnits')}
        fieldPickup={t('storeOwner.listingFieldPickup')}
        validationTitle={t('storeOwner.listingValidationTitle')}
        validationMessage={t('storeOwner.listingValidationMessage')}
        onClose={() => setFormOpen(false)}
        onSave={handleFormSave}
      />

      <ScanStockModal
        visible={scanOpen}
        t={t}
        onClose={() => setScanOpen(false)}
        onAddScanned={handleAddScanned}
      />

      <BulkEditModal
        visible={bulkOpen}
        bags={bags}
        t={t}
        onClose={() => setBulkOpen(false)}
        onApplyStock={handleBulkSetStock}
        onReduceOne={handleBulkMinusOne}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  scroll: { flex: 1 },
  scrollInner: { paddingBottom: 120, gap: 10 },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Theme.colors.primary,
    paddingVertical: 14,
    borderRadius: Theme.borderRadius.md,
    marginBottom: 4,
  },
  addBtnTxt: { color: Theme.colors.white, fontSize: 16, fontWeight: '800' },
  subSection: { fontSize: 13, fontWeight: '900', color: Theme.colors.text.muted, marginTop: 4 },
  toolRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  toolHalf: {
    flex: 1,
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.borderRadius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(42,63,78,0.08)',
    gap: 4,
  },
  toolTitle: { fontSize: 14, fontWeight: '900', color: Theme.colors.text.primary },
  toolSub: { fontSize: 11, fontWeight: '600', color: Theme.colors.text.muted, lineHeight: 14 },
  pressed: { opacity: 0.92 },
  jumpRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  jumpBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Theme.colors.primary,
    paddingVertical: 12,
    borderRadius: Theme.borderRadius.md,
  },
  jumpTxt: { fontSize: 14, fontWeight: '900', color: Theme.colors.white },
  jumpBtnOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: Theme.colors.primary,
    paddingVertical: 12,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.white,
  },
  jumpOutlineTxt: { fontSize: 14, fontWeight: '900', color: Theme.colors.primary },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.borderRadius.md,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(42,63,78,0.08)',
  },
  thumb: { width: 64, height: 64, borderRadius: Theme.borderRadius.sm, backgroundColor: '#E2E8F0' },
  rowMid: { flex: 1, minWidth: 0 },
  itemTitle: { fontSize: 15, fontWeight: '800', color: Theme.colors.text.primary },
  leftLine: { marginTop: 4, fontSize: 12, fontWeight: '700', color: Theme.colors.text.muted },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, flexWrap: 'wrap' },
  price: { fontSize: 15, fontWeight: '900', color: Theme.colors.primaryDark },
  retail: { fontSize: 12, fontWeight: '600', color: Theme.colors.text.muted },
  editBtn: { padding: 8 },
});
