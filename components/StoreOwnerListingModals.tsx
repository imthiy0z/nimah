import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../constants/theme';
import type { RescueBag } from '../constants/mockData';
import { foodImages } from '../constants/foodAssets';

export type ListingFormValues = {
  title: string;
  blurb: string;
  retailValue: string;
  price: string;
  left: string;
  pickupWindow: string;
};

export function emptyListingForm(): ListingFormValues {
  return {
    title: '',
    blurb: '',
    retailValue: '4',
    price: '1',
    left: '5',
    pickupWindow: 'Today 7:00–9:00 PM',
  };
}

export function listingFormFromBag(b: RescueBag): ListingFormValues {
  return {
    title: b.title,
    blurb: b.blurb,
    retailValue: String(b.retailValue),
    price: String(b.price),
    left: String(b.left),
    pickupWindow: b.pickupWindow,
  };
}

export function bagFromForm(
  id: string,
  v: ListingFormValues,
  image: any,
  tags: string[]
): RescueBag | null {
  const retailValue = parseFloat(v.retailValue.replace(/,/g, ''));
  const price = parseFloat(v.price.replace(/,/g, ''));
  const left = parseInt(v.left, 10);
  if (
    !v.title.trim() ||
    !Number.isFinite(retailValue) ||
    !Number.isFinite(price) ||
    !Number.isInteger(left) ||
    left < 0
  ) {
    return null;
  }
  return {
    id,
    title: v.title.trim(),
    blurb: v.blurb.trim() || 'Surplus rescue — contents vary by day.',
    retailValue,
    price,
    pickupWindow: v.pickupWindow.trim() || 'Today 7:00–9:00 PM',
    left,
    tags: tags.length ? tags : ['Meals'],
    image,
  };
}

const SCAN_CATALOG: Record<string, { title: string; blurb: string }> = {
  '501234': { title: 'Labelled bakery surplus', blurb: 'Matched from demo barcode — pastries & breads.' },
  '882010': { title: 'Chilled combo surplus', blurb: 'Demo scan — sandwiches or salads when available.' },
  '770099': { title: 'Produce rescue tray', blurb: 'Demo scan — fruit & veg nearing display date.' },
};

type TFn = (path: string, fallback?: string, vars?: Record<string, string | number>) => string;

type ListingFormModalProps = {
  visible: boolean;
  initial: ListingFormValues;
  sheetTitle: string;
  saveLabel: string;
  cancelLabel: string;
  fieldTitle: string;
  fieldBlurb: string;
  fieldRetail: string;
  fieldPrice: string;
  fieldUnits: string;
  fieldPickup: string;
  validationTitle: string;
  validationMessage: string;
  onClose: () => void;
  onSave: (values: ListingFormValues) => void;
};

export function ListingFormModal({
  visible,
  initial,
  sheetTitle,
  saveLabel,
  cancelLabel,
  fieldTitle,
  fieldBlurb,
  fieldRetail,
  fieldPrice,
  fieldUnits,
  fieldPickup,
  validationTitle,
  validationMessage,
  onClose,
  onSave,
}: ListingFormModalProps) {
  const [values, setValues] = useState<ListingFormValues>(initial);

  useEffect(() => {
    if (visible) setValues(initial);
  }, [visible, initial]);

  const set =
    (key: keyof ListingFormValues) => (text: string) =>
      setValues((s) => ({ ...s, [key]: text }));

  const submit = useCallback(() => {
    onSave(values);
  }, [onSave, values]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.grabber} />
          <Text style={styles.sheetTitle}>{sheetTitle}</Text>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.formScroll}
          >
            <Text style={styles.label}>{fieldTitle}</Text>
            <TextInput
              style={styles.input}
              value={values.title}
              onChangeText={set('title')}
              placeholder={fieldTitle}
            />
            <Text style={styles.label}>{fieldBlurb}</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              value={values.blurb}
              onChangeText={set('blurb')}
              placeholder={fieldBlurb}
              multiline
            />
            <View style={styles.row2}>
              <View style={styles.row2col}>
                <Text style={styles.label}>{fieldRetail}</Text>
                <TextInput
                  style={styles.input}
                  value={values.retailValue}
                  onChangeText={set('retailValue')}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={styles.row2col}>
                <Text style={styles.label}>{fieldPrice}</Text>
                <TextInput
                  style={styles.input}
                  value={values.price}
                  onChangeText={set('price')}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
            <Text style={styles.label}>{fieldUnits}</Text>
            <TextInput
              style={styles.input}
              value={values.left}
              onChangeText={set('left')}
              keyboardType="number-pad"
            />
            <Text style={styles.label}>{fieldPickup}</Text>
            <TextInput
              style={styles.input}
              value={values.pickupWindow}
              onChangeText={set('pickupWindow')}
              placeholder={fieldPickup}
            />
          </ScrollView>
          <View style={styles.formActions}>
            <Pressable style={styles.btnGhost} onPress={onClose}>
              <Text style={styles.btnGhostTxt}>{cancelLabel}</Text>
            </Pressable>
            <Pressable
              style={styles.btnPrimary}
              onPress={() => {
                const b = bagFromForm('validate', values, foodImages.famousFood, ['Meals']);
                if (!b) Alert.alert(validationTitle, validationMessage);
                else submit();
              }}
            >
              <Text style={styles.btnPrimaryTxt}>{saveLabel}</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

type ScanStockModalProps = {
  visible: boolean;
  t: TFn;
  onClose: () => void;
  onAddScanned: (partial: Pick<RescueBag, 'title' | 'blurb'>) => void;
};

export function ScanStockModal({ visible, t, onClose, onAddScanned }: ScanStockModalProps) {
  const [code, setCode] = useState('');
  const [found, setFound] = useState<{ title: string; blurb: string } | null>(null);

  useEffect(() => {
    if (!visible) {
      setCode('');
      setFound(null);
    }
  }, [visible]);

  const lookup = () => {
    const key = code.trim();
    if (!key) return;
    const hit = SCAN_CATALOG[key];
    if (hit) {
      setFound(hit);
    } else {
      setFound(null);
      Alert.alert(t('storeOwner.scanNotFound'), t('storeOwner.scanTryCodes'));
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlayCenter}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('storeOwner.scanTitle')}</Text>
          <Text style={styles.cardSub}>{t('storeOwner.scanHint')}</Text>
          <TextInput
            style={styles.input}
            value={code}
            onChangeText={setCode}
            placeholder={t('storeOwner.scanPlaceholder')}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Pressable style={styles.btnPrimaryWide} onPress={lookup}>
            <Ionicons name="barcode-outline" size={20} color={Theme.colors.white} />
            <Text style={styles.btnPrimaryTxt}>{t('storeOwner.scanLookup')}</Text>
          </Pressable>
          {found ? (
            <View style={styles.foundBox}>
              <Text style={styles.foundTitle}>{found.title}</Text>
              <Text style={styles.foundSub}>{found.blurb}</Text>
              <Pressable
                style={styles.btnPrimaryWide}
                onPress={() => {
                  onAddScanned({ title: found.title, blurb: found.blurb });
                  onClose();
                }}
              >
                <Text style={styles.btnPrimaryTxt}>{t('storeOwner.scanAddListing')}</Text>
              </Pressable>
            </View>
          ) : null}
          <Pressable style={styles.btnGhost} onPress={onClose}>
            <Text style={styles.btnGhostTxt}>{t('common.cancel')}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

type BulkEditModalProps = {
  visible: boolean;
  bags: RescueBag[];
  t: TFn;
  onClose: () => void;
  onApplyStock: (selectedIds: string[], newLeft: number) => void;
  onReduceOne: (selectedIds: string[]) => void;
};

export function BulkEditModal({
  visible,
  bags,
  t,
  onClose,
  onApplyStock,
  onReduceOne,
}: BulkEditModalProps) {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [stockText, setStockText] = useState('');

  useEffect(() => {
    if (visible) {
      setSelected({});
      setStockText('');
    }
  }, [visible]);

  const selectedIds = useMemo(
    () => Object.keys(selected).filter((id) => selected[id]),
    [selected]
  );

  const toggle = (id: string) => setSelected((s) => ({ ...s, [id]: !s[id] }));

  const apply = () => {
    const n = parseInt(stockText, 10);
    if (!Number.isInteger(n) || n < 0) {
      Alert.alert(t('storeOwner.bulkInvalidStock'));
      return;
    }
    if (selectedIds.length === 0) {
      Alert.alert(t('storeOwner.bulkSelectFirst'));
      return;
    }
    onApplyStock(selectedIds, n);
    onClose();
  };

  const reduce = () => {
    if (selectedIds.length === 0) {
      Alert.alert(t('storeOwner.bulkSelectFirst'));
      return;
    }
    onReduceOne(selectedIds);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.grabber} />
          <Text style={styles.sheetTitle}>{t('storeOwner.bulkTitle')}</Text>
          <Text style={styles.sheetSub}>{t('storeOwner.bulkSub')}</Text>
          <ScrollView style={styles.bulkList} keyboardShouldPersistTaps="handled">
            {bags.map((b) => {
              const on = !!selected[b.id];
              return (
                <Pressable
                  key={b.id}
                  style={[styles.bulkRow, on && styles.bulkRowOn]}
                  onPress={() => toggle(b.id)}
                >
                  <Ionicons
                    name={on ? 'checkbox' : 'square-outline'}
                    size={22}
                    color={on ? Theme.colors.primary : Theme.colors.text.muted}
                  />
                  <View style={styles.bulkRowText}>
                    <Text style={styles.bulkRowTitle} numberOfLines={2}>
                      {b.title}
                    </Text>
                    <Text style={styles.bulkRowMeta}>
                      {t('storeOwner.unitsLeft', undefined, { n: String(b.left) })}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
          <Text style={styles.label}>{t('storeOwner.bulkSetStockLabel')}</Text>
          <TextInput
            style={styles.input}
            value={stockText}
            onChangeText={setStockText}
            keyboardType="number-pad"
            placeholder="0"
          />
          <View style={styles.bulkActions}>
            <Pressable style={[styles.btnSecondaryWide, styles.bulkPrimaryInRow]} onPress={reduce}>
              <Text style={styles.btnSecondaryTxt}>{t('storeOwner.bulkMinusOne')}</Text>
            </Pressable>
            <Pressable style={[styles.btnPrimaryWide, styles.bulkPrimaryInRow]} onPress={apply}>
              <Text style={styles.btnPrimaryTxt}>{t('storeOwner.bulkApplyStock')}</Text>
            </Pressable>
          </View>
          <Pressable style={styles.btnGhost} onPress={onClose}>
            <Text style={styles.btnGhostTxt}>{t('common.cancel')}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlayCenter: {
    flex: 1,
    justifyContent: 'center',
    padding: Theme.spacing.lg,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(42,63,78,0.45)',
  },
  sheet: {
    backgroundColor: Theme.colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: Theme.spacing.lg,
    paddingBottom: Theme.spacing.lg,
    maxHeight: '88%',
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(42,63,78,0.15)',
    marginTop: 8,
    marginBottom: 12,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: Theme.colors.text.primary,
    marginBottom: 4,
  },
  sheetSub: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.colors.text.muted,
    marginBottom: 12,
  },
  formScroll: { paddingBottom: 12, gap: 0 },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: Theme.colors.text.muted,
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(42,63,78,0.12)',
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.text.primary,
    backgroundColor: Theme.colors.background,
  },
  inputMultiline: { minHeight: 72, textAlignVertical: 'top' },
  row2: { flexDirection: 'row', gap: 10 },
  row2col: { flex: 1 },
  formActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  btnGhost: { paddingVertical: 12, paddingHorizontal: 8 },
  btnGhostTxt: { fontSize: 16, fontWeight: '800', color: Theme.colors.text.muted },
  btnPrimary: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: Theme.borderRadius.md,
  },
  btnPrimaryTxt: { fontSize: 16, fontWeight: '900', color: Theme.colors.white },
  btnPrimaryWide: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Theme.colors.primary,
    paddingVertical: 14,
    borderRadius: Theme.borderRadius.md,
    marginTop: 12,
  },
  bulkPrimaryInRow: {
    flex: 1,
    marginTop: 0,
  },
  btnSecondaryWide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Theme.colors.primary,
    paddingVertical: 12,
    borderRadius: Theme.borderRadius.md,
  },
  btnSecondaryTxt: { fontSize: 15, fontWeight: '900', color: Theme.colors.primary },
  card: {
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
  },
  cardTitle: { fontSize: 18, fontWeight: '900', color: Theme.colors.text.primary },
  cardSub: {
    marginTop: 6,
    marginBottom: 12,
    fontSize: 14,
    fontWeight: '600',
    color: Theme.colors.text.muted,
    lineHeight: 20,
  },
  foundBox: {
    marginTop: 16,
    padding: 12,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: 'rgba(249, 115, 22, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.25)',
    gap: 8,
  },
  foundTitle: { fontSize: 16, fontWeight: '900', color: Theme.colors.text.primary },
  foundSub: { fontSize: 13, fontWeight: '600', color: Theme.colors.text.muted, lineHeight: 18 },
  bulkList: { maxHeight: 220, marginBottom: 8 },
  bulkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(42,63,78,0.08)',
    marginBottom: 6,
  },
  bulkRowOn: {
    borderColor: Theme.colors.primary,
    backgroundColor: 'rgba(249, 115, 22, 0.06)',
  },
  bulkRowText: { flex: 1, minWidth: 0 },
  bulkRowTitle: { fontSize: 14, fontWeight: '800', color: Theme.colors.text.primary },
  bulkRowMeta: { fontSize: 12, fontWeight: '600', color: Theme.colors.text.muted, marginTop: 2 },
  bulkActions: { flexDirection: 'row', gap: 10, marginTop: 12 },
});
