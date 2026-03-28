import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../constants/theme';
import { useLanguage } from '../contexts/LanguageContext';

type TabItem = {
  id: string;
  icon: string;
  iconFilled: string;
  labelKey: string;
  useLogo?: boolean;
};

const tabs: TabItem[] = [
  {
    id: 'owner-dashboard',
    icon: 'home-outline',
    iconFilled: 'home',
    labelKey: 'storeOwner.tabs.dashboard',
    useLogo: true,
  },
  { id: 'owner-orders', icon: 'bag-handle-outline', iconFilled: 'bag-handle', labelKey: 'storeOwner.tabs.orders' },
  {
    id: 'owner-listings',
    icon: 'restaurant-outline',
    iconFilled: 'restaurant',
    labelKey: 'storeOwner.tabs.listings',
  },
  {
    id: 'owner-messages',
    icon: 'chatbubbles-outline',
    iconFilled: 'chatbubbles',
    labelKey: 'storeOwner.tabs.messages',
  },
  {
    id: 'owner-profile',
    icon: 'person-circle-outline',
    iconFilled: 'person-circle',
    labelKey: 'storeOwner.tabs.profile',
  },
];

type StoreOwnerTabBarProps = {
  activeTab: string;
  onTabPress: (tabId: string) => void;
  messageUnreadCount?: number;
};

export default function StoreOwnerTabBar({
  activeTab,
  onTabPress,
  messageUnreadCount = 0,
}: StoreOwnerTabBarProps) {
  const { t } = useLanguage();
  return (
    <View style={styles.container}>
      <BlurView intensity={30} tint="light" style={styles.blurContainer}>
        <View style={styles.greyTint} />
        <LinearGradient
          colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.6)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        <View style={styles.tabBar}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <Pressable
                key={tab.id}
                onPress={() => onTabPress(tab.id)}
                style={styles.tabItem}
                accessibilityRole="button"
                accessibilityLabel={t(tab.labelKey)}
              >
                {isActive ? (
                  <View style={styles.activePill}>
                    <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill}>
                      <LinearGradient
                        colors={['rgba(255,255,255,0.5)', 'rgba(255,255,255,0.3)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                        pointerEvents="none"
                      />
                    </BlurView>
                  </View>
                ) : null}
                {tab.useLogo ? (
                  <Image
                    source={require('../assets/logo.png')}
                    style={[styles.homeLogo, !isActive && styles.homeLogoMuted]}
                    contentFit="contain"
                  />
                ) : (
                  <Ionicons
                    name={isActive ? (tab.iconFilled as any) : (tab.icon as any)}
                    size={24}
                    color={isActive ? Theme.colors.primary : 'rgba(42, 63, 78, 0.5)'}
                    style={styles.icon}
                  />
                )}
                {tab.id === 'owner-messages' && messageUnreadCount > 0 ? (
                  <View style={styles.badge} pointerEvents="none">
                    <Text style={styles.badgeText} numberOfLines={1}>
                      {messageUnreadCount > 99 ? '99+' : messageUnreadCount}
                    </Text>
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    paddingBottom: 20,
    paddingHorizontal: Theme.spacing.lg,
    justifyContent: 'flex-end',
  },
  blurContainer: {
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    position: 'relative',
  },
  greyTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    pointerEvents: 'none',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: Theme.spacing.sm,
    position: 'relative',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    borderRadius: 10,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.85)',
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  activePill: {
    position: 'absolute',
    width: 56,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    overflow: 'hidden',
  },
  icon: {
    zIndex: 1,
  },
  homeLogo: {
    width: 28,
    height: 28,
    zIndex: 1,
  },
  homeLogoMuted: {
    opacity: 0.45,
  },
});
