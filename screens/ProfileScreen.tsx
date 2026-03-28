import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  Pressable,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '../constants/theme';
import BottomTabBar from '../components/BottomTabBar';
import DeliveryLocationBar from '../components/DeliveryLocationBar';
import { useLanguage } from '../contexts/LanguageContext';

const { width } = Dimensions.get('window');

const PROFILE_HEADER_CONTENT_HEIGHT = 48;

/**
 * Illustrative kg CO₂e avoided per rescued meal equivalent (demo only).
 * Based on rough “avoided food waste + supply chain” factors from public
 * lifecycle studies — not measured per user. Replace with API-driven model when live.
 */
const EST_KG_CO2E_PER_RESCUED_MEAL = 2.7;

type ProfileScreenProps = {
  onBack?: () => void;
  onReportsPress?: () => void;
  onLogout?: () => void;
  activeTab?: string;
  onTabPress?: (tabId: string) => void;
  cartCount?: number;
};

export default function ProfileScreen({
  onBack,
  onReportsPress,
  onLogout,
  activeTab = 'home',
  onTabPress,
  cartCount = 0,
}: ProfileScreenProps) {
  const { t, locale, setLocale, rtlMirror } = useLanguage();
  const insets = useSafeAreaInsets();
  const gutter = Theme.spacing.lg;
  const headerTop = insets.top + Theme.spacing.sm;

  // Sample user data - replace with actual data from your API/state
  const userData = {
    name: 'Sara Al-Nimah',
    email: 'sara@example.com',
    phone: '+1 555 0100',
    city: 'Your city',
  };

  const demoMealsSaved = 12;
  const impact = {
    mealsSaved: demoMealsSaved,
    co2Kg: Math.round(demoMealsSaved * EST_KG_CO2E_PER_RESCUED_MEAL),
    moneySaved: 84.5,
  };

  const renderInfoCard = (
    icon: string,
    label: string,
    value: string,
    onPress?: () => void
  ) => (
    <Pressable
      style={({ pressed }) => [
        styles.infoCard,
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${value}`}
    >
      <BlurView intensity={30} tint="light" style={styles.infoCardBlur}>
        <LinearGradient
          colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        <View style={styles.infoCardContent}>
          <View style={styles.infoIconContainer}>
            <Ionicons name={icon as any} size={22} color={Theme.colors.primary} />
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
          </View>
          {onPress && (
            <Ionicons name="chevron-forward" size={20} color={Theme.colors.text.muted} style={rtlMirror} />
          )}
        </View>
      </BlurView>
    </Pressable>
  );

  const renderActionCard = (
    icon: string,
    title: string,
    subtitle: string,
    onPress: () => void,
    color?: string
  ) => (
    <Pressable
      style={({ pressed }) => [
        styles.actionCard,
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <BlurView intensity={30} tint="light" style={styles.actionCardBlur}>
        <LinearGradient
          colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        <View style={styles.actionCardContent}>
          <View style={[styles.actionIconContainer, color && { backgroundColor: `${color}15` }]}>
            <Ionicons name={icon as any} size={24} color={color || Theme.colors.primary} />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>{title}</Text>
            <Text style={styles.actionSubtitle}>{subtitle}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Theme.colors.text.muted} style={rtlMirror} />
        </View>
      </BlurView>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.topHeaderRow,
            {
              marginTop: headerTop,
              minHeight: PROFILE_HEADER_CONTENT_HEIGHT,
              paddingHorizontal: insets.left + gutter,
            },
          ]}
        >
          <View style={styles.locationSlot}>
            <DeliveryLocationBar />
          </View>
          <Pressable
            style={styles.editButton}
            onPress={() => console.log('Edit profile')}
            accessibilityRole="button"
            accessibilityLabel={t('profile.editProfile')}
          >
            <BlurView intensity={22} tint="light" style={styles.editButtonBlur}>
              <LinearGradient
                colors={['rgba(255,255,255,0.34)', 'rgba(255,255,255,0.10)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
              />
              <Ionicons name="create-outline" size={20} color="#2A3F4E" />
            </BlurView>
          </Pressable>
        </View>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={50} color={Theme.colors.primary} />
            </View>
            <View style={styles.editAvatarBadge}>
              <Ionicons name="camera" size={16} color={Theme.colors.white} />
            </View>
          </View>
          <Text style={styles.profileName}>{userData.name}</Text>
          <Text style={styles.profileEmail}>{userData.email}</Text>
        </View>

        {/* Impact summary */}
        <View style={styles.section}>
          <View style={styles.impactHeaderRow}>
            <Text style={styles.impactSectionTitle}>{t('profile.impact')}</Text>
            <Pressable
              onPress={() =>
                Alert.alert(t('profile.co2InfoTitle'), t('profile.co2InfoBody'))
              }
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel={t('profile.co2InfoA11y')}
            >
              <Ionicons name="information-circle-outline" size={22} color={Theme.colors.text.muted} />
            </Pressable>
          </View>
          <View style={styles.impactRow}>
            <BlurView intensity={24} tint="light" style={styles.impactTile}>
              <Text style={styles.impactVal}>{impact.mealsSaved}</Text>
              <Text style={styles.impactLbl}>{t('profile.mealsSaved')}</Text>
            </BlurView>
            <BlurView intensity={24} tint="light" style={styles.impactTile}>
              <Text style={styles.impactVal}>{impact.co2Kg} kg</Text>
              <Text style={styles.impactLbl}>{t('profile.co2')}</Text>
            </BlurView>
            <BlurView intensity={24} tint="light" style={styles.impactTile}>
              <Text style={styles.impactVal}>{impact.moneySaved}</Text>
              <Text style={styles.impactLbl}>{t('profile.savedDemo')}</Text>
            </BlurView>
          </View>
          <Text style={styles.impactFoot}>{t('profile.impactFoot')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.language')}</Text>
          <View style={styles.langRow}>
            <Pressable
              style={[styles.langChip, locale === 'en' && styles.langChipOn]}
              onPress={() => setLocale('en')}
            >
              <Text style={[styles.langChipText, locale === 'en' && styles.langChipTextOn]}>
                {t('profile.english')}
              </Text>
            </Pressable>
            <Pressable
              style={[styles.langChip, locale === 'ar' && styles.langChipOn]}
              onPress={() => setLocale('ar')}
            >
              <Text style={[styles.langChipText, locale === 'ar' && styles.langChipTextOn]}>
                {t('profile.arabic')}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.account')}</Text>
          {renderInfoCard('person-outline', t('profile.name'), userData.name, () => console.log('Edit name'))}
          {renderInfoCard('mail-outline', t('profile.email'), userData.email, () => console.log('Edit email'))}
          {renderInfoCard('call-outline', t('profile.phone'), userData.phone, () => console.log('Edit phone'))}
          {renderInfoCard('location-outline', t('profile.area'), userData.city, () => console.log('Edit area'))}
        </View>

        {/* Quick Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.quickActions')}</Text>
          <View style={styles.actionsGrid}>
            {renderActionCard(
              'receipt-outline',
              t('profile.rescueHistory'),
              t('profile.rescueHistorySub'),
              () => onReportsPress?.(),
              '#4CAF50'
            )}
            {renderActionCard(
              'heart-outline',
              t('profile.favCard'),
              t('profile.favCardSub'),
              () => console.log('Favorites'),
              Theme.colors.primary
            )}
            {renderActionCard(
              'card-outline',
              t('profile.payCard'),
              t('profile.payCardSub'),
              () => console.log('Payments'),
              '#FF9800'
            )}
            {renderActionCard(
              'notifications-outline',
              t('profile.alertCard'),
              t('profile.alertCardSub'),
              () => console.log('Notifications'),
              '#2196F3'
            )}
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.settings')}</Text>
          {renderInfoCard(
            'notifications-outline',
            t('profile.notifSettings'),
            t('profile.notifStatus'),
            () => console.log('Notification settings')
          )}
          {renderInfoCard(
            'lock-closed-outline',
            t('profile.privacyTitle'),
            t('profile.privacySub'),
            () => console.log('Privacy settings')
          )}
          {renderInfoCard(
            'help-circle-outline',
            t('profile.help'),
            t('profile.helpSub'),
            () => console.log('Help')
          )}
          {renderInfoCard(
            'information-circle-outline',
            t('profile.aboutTitle'),
            t('profile.aboutVersion'),
            () => console.log('About')
          )}
        </View>

        {/* Logout Button */}
        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.cardPressed,
          ]}
          onPress={() => {
            Alert.alert(t('profile.logoutTitle'), t('profile.logoutConfirm'), [
              { text: t('common.cancel'), style: 'cancel' },
              {
                text: t('profile.logout'),
                style: 'destructive',
                onPress: () => onLogout?.(),
              },
            ]);
          }}
          accessibilityRole="button"
          accessibilityLabel={t('profile.logout')}
        >
          <BlurView intensity={30} tint="light" style={styles.logoutButtonBlur}>
            <LinearGradient
              colors={['rgba(249, 115, 22, 0.1)', 'rgba(249, 115, 22, 0.05)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            />
            <View style={styles.logoutContent}>
              <Ionicons name="log-out-outline" size={22} color={Theme.colors.primary} />
              <Text style={styles.logoutText}>{t('profile.logout')}</Text>
            </View>
          </BlurView>
        </Pressable>

        <View style={styles.bottomSpacer} />
      </ScrollView>
      
      {onTabPress && (
        <BottomTabBar activeTab={activeTab} onTabPress={onTabPress} cartCount={cartCount} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
  },
  locationSlot: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
  editButton: {
    flexShrink: 0,
  },
  editButtonBlur: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.26)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Theme.spacing.lg,
    paddingBottom: 100,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: Theme.spacing.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Theme.spacing.md,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Theme.colors.primary,
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Theme.colors.white,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.xs,
  },
  profileEmail: {
    fontSize: 15,
    color: Theme.colors.text.muted,
  },
  section: {
    marginBottom: Theme.spacing.xl,
  },
  impactHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.xs,
    marginBottom: Theme.spacing.md,
  },
  impactSectionTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: Theme.colors.text.primary,
    marginRight: Theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.xs,
  },
  infoCard: {
    marginBottom: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
  },
  infoCardBlur: {
    borderRadius: Theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  infoCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.md,
    gap: Theme.spacing.md,
  },
  infoIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Theme.colors.text.muted,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: Theme.colors.text.primary,
  },
  infoSubValue: {
    fontSize: 13,
    color: Theme.colors.text.muted,
    marginTop: 2,
  },
  impactRow: {
    flexDirection: 'row',
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.xs,
  },
  impactTile: {
    flex: 1,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    overflow: 'hidden',
    alignItems: 'center',
  },
  impactVal: {
    fontSize: 18,
    fontWeight: '800',
    color: Theme.colors.primary,
    marginBottom: 4,
  },
  impactLbl: {
    fontSize: 11,
    fontWeight: '600',
    color: Theme.colors.text.muted,
    textAlign: 'center',
  },
  impactFoot: {
    fontSize: 11,
    color: Theme.colors.text.muted,
    marginBottom: Theme.spacing.sm,
  },
  emergencyContactCard: {
    marginBottom: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.md,
  },
  actionCard: {
    width: (width - Theme.spacing.lg * 2 - Theme.spacing.md) / 2,
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: Theme.spacing.sm,
  },
  actionCardBlur: {
    borderRadius: Theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  actionCardContent: {
    padding: Theme.spacing.md,
    alignItems: 'flex-start',
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  actionTextContainer: {
    flex: 1,
    width: '100%',
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Theme.colors.text.primary,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: Theme.colors.text.muted,
  },
  logoutButton: {
    marginTop: Theme.spacing.lg,
    marginBottom: Theme.spacing.xl,
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
  },
  logoutButtonBlur: {
    borderRadius: Theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.2)',
    overflow: 'hidden',
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.md,
    gap: Theme.spacing.sm,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.primary,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  langRow: {
    flexDirection: 'row',
    gap: Theme.spacing.sm,
  },
  langChip: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(42,63,78,0.15)',
    backgroundColor: Theme.colors.white,
    alignItems: 'center',
  },
  langChipOn: {
    borderColor: Theme.colors.primary,
    backgroundColor: 'rgba(249,115,22,0.1)',
  },
  langChipText: {
    fontSize: 15,
    fontWeight: '600',
    color: Theme.colors.text.primary,
  },
  langChipTextOn: {
    color: Theme.colors.primaryDark,
    fontWeight: '800',
  },
  bottomSpacer: {
    height: Theme.spacing.lg,
  },
});
