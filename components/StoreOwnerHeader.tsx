import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '../constants/theme';
import { useLanguage } from '../contexts/LanguageContext';

export type StoreOwnerHeaderProps = {
  title: string;
  subtitle?: string;
  onNotificationsPress?: () => void;
  onTabPress: (tabId: string) => void;
  onSupportChatPress?: () => void;
  /** Highlight current tab in menu */
  activeTab?: string;
};

const MENU_ITEMS: { tabId: string; icon: React.ComponentProps<typeof Ionicons>['name']; labelKey: string }[] = [
  { tabId: 'owner-dashboard', icon: 'home-outline', labelKey: 'storeOwner.menuNavHome' },
  { tabId: 'owner-orders', icon: 'bag-handle-outline', labelKey: 'storeOwner.menuNavOrders' },
  { tabId: 'owner-listings', icon: 'restaurant-outline', labelKey: 'storeOwner.menuNavListings' },
  { tabId: 'owner-messages', icon: 'chatbubbles-outline', labelKey: 'storeOwner.menuNavMessages' },
  { tabId: 'owner-profile', icon: 'storefront-outline', labelKey: 'storeOwner.menuNavStore' },
];

export default function StoreOwnerHeader({
  title,
  subtitle,
  onNotificationsPress,
  onTabPress,
  onSupportChatPress,
  activeTab,
}: StoreOwnerHeaderProps) {
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const [menuOpen, setMenuOpen] = useState(false);

  const goTo = (tabId: string) => {
    setMenuOpen(false);
    onTabPress(tabId);
  };

  return (
    <>
      <View style={[styles.row, { paddingTop: insets.top + Theme.spacing.sm }]}>
        <Pressable
          style={styles.menuBtn}
          onPress={() => setMenuOpen(true)}
          accessibilityRole="button"
          accessibilityLabel={t('storeOwner.menuOpenA11y')}
        >
          <Ionicons name="menu" size={26} color={Theme.colors.primary} />
        </Pressable>
        <View style={styles.titleBlock}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={2}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        <Pressable
          style={styles.iconBtn}
          onPress={onNotificationsPress}
          accessibilityLabel={t('home.notif')}
        >
          <Ionicons name="notifications-outline" size={24} color={Theme.colors.primary} />
        </Pressable>
      </View>

      <Modal
        visible={menuOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setMenuOpen(false)}
      >
        <View style={styles.modalRoot}>
          <Pressable style={styles.modalBackdrop} onPress={() => setMenuOpen(false)}>
            <BlurView intensity={32} tint="dark" style={StyleSheet.absoluteFill} />
          </Pressable>
          <View
            style={[styles.sheetOuter, { paddingBottom: Math.max(insets.bottom, 16) }]}
            pointerEvents="box-none"
          >
            <View style={[styles.sheet, { maxHeight: height * 0.78 }]}>
              <View style={styles.sheetGrabber} />
              <Text style={styles.sheetTitle}>{t('storeOwner.menuTitle')}</Text>
              <Text style={styles.sheetSub}>{t('storeOwner.menuSub')}</Text>
              <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                {MENU_ITEMS.map((item) => {
                  const active = activeTab === item.tabId;
                  return (
                    <Pressable
                      key={item.tabId}
                      style={({ pressed }) => [
                        styles.menuRow,
                        active && styles.menuRowActive,
                        pressed && styles.menuRowPressed,
                      ]}
                      onPress={() => goTo(item.tabId)}
                    >
                      <View style={[styles.menuIconWrap, active && styles.menuIconWrapActive]}>
                        <Ionicons
                          name={item.icon}
                          size={22}
                          color={active ? Theme.colors.primary : Theme.colors.text.muted}
                        />
                      </View>
                      <Text style={[styles.menuLabel, active && styles.menuLabelActive]}>
                        {t(item.labelKey)}
                      </Text>
                      <Ionicons name="chevron-forward" size={18} color="rgba(42,63,78,0.35)" />
                    </Pressable>
                  );
                })}
                <View style={styles.menuDivider} />
                <Pressable
                  style={({ pressed }) => [styles.menuRow, pressed && styles.menuRowPressed]}
                  onPress={() => {
                    setMenuOpen(false);
                    onSupportChatPress?.();
                  }}
                >
                  <View style={styles.menuIconWrap}>
                    <Ionicons name="headset-outline" size={22} color={Theme.colors.primary} />
                  </View>
                  <Text style={styles.menuLabel}>{t('storeOwner.menuHelp')}</Text>
                  <Ionicons name="open-outline" size={16} color="rgba(42,63,78,0.35)" />
                </Pressable>
              </ScrollView>
              <Pressable style={styles.closeBtn} onPress={() => setMenuOpen(false)}>
                <Text style={styles.closeBtnTxt}>{t('common.cancel')}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingHorizontal: Theme.spacing.sm + Theme.spacing.xs,
    marginBottom: Theme.spacing.sm,
  },
  menuBtn: {
    padding: Theme.spacing.xs,
    marginTop: 2,
  },
  titleBlock: { flex: 1, minWidth: 0 },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: Theme.colors.text.primary,
    letterSpacing: -0.4,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '600',
    color: Theme.colors.text.muted,
    lineHeight: 18,
  },
  iconBtn: { padding: Theme.spacing.xs, marginTop: 2 },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetOuter: {
    width: '100%',
  },
  sheet: {
    backgroundColor: Theme.colors.white,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: Theme.spacing.md,
    paddingTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(42,63,78,0.08)',
  },
  sheetGrabber: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(42,63,78,0.15)',
    marginBottom: Theme.spacing.md,
  },
  sheetTitle: { fontSize: 20, fontWeight: '900', color: Theme.colors.text.primary },
  sheetSub: {
    marginTop: 4,
    marginBottom: Theme.spacing.md,
    fontSize: 13,
    color: Theme.colors.text.muted,
    fontWeight: '600',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderRadius: Theme.borderRadius.md,
  },
  menuRowActive: { backgroundColor: 'rgba(249, 115, 22, 0.08)' },
  menuRowPressed: { opacity: 0.9 },
  menuIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(42,63,78,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIconWrapActive: {
    backgroundColor: 'rgba(249, 115, 22, 0.15)',
  },
  menuLabel: { flex: 1, fontSize: 16, fontWeight: '700', color: Theme.colors.text.primary },
  menuLabelActive: { color: Theme.colors.primaryDark },
  menuDivider: {
    height: 1,
    backgroundColor: 'rgba(42,63,78,0.08)',
    marginVertical: 8,
  },
  closeBtn: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 4,
  },
  closeBtnTxt: { fontSize: 16, fontWeight: '800', color: Theme.colors.primary },
});
