import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  Pressable,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Theme } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';

const { width, height } = Dimensions.get('window');

type LoginScreenProps = {
  onBack?: () => void;
  onLogin?: () => void;
  /** Optional store name hint to match a partner in mock data */
  onStoreOwnerLogin?: (storeHint?: string) => void;
  onSignUp?: () => void;
};

export default function LoginScreen({
  onBack,
  onLogin,
  onStoreOwnerLogin,
  onSignUp,
}: LoginScreenProps) {
  const { t, rtlMirror } = useLanguage();
  const [role, setRole] = useState<'customer' | 'storeOwner'>('customer');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Full Screen Image Background */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/onboarding-image.png')}
          style={styles.image}
          contentFit="cover"
        />
        
        {/* Bottom gradient overlay for contrast */}
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)']}
          locations={[0, 1]}
          style={styles.bottomFade}
          pointerEvents="none"
        />
        
        {/* Back Button */}
        <Pressable
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <BlurView intensity={22} tint="light" style={styles.backButtonBlur}>
            <LinearGradient
              colors={['rgba(255,255,255,0.34)', 'rgba(255,255,255,0.10)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            />
            <Ionicons name="arrow-back" size={20} color={Theme.colors.white} style={rtlMirror} />
          </BlurView>
        </Pressable>
      </View>

      {/* Login Card Overlay - Positioned on top of image with curved top */}
      <View style={styles.cardWrapper}>
        <BlurView intensity={50} tint="light" style={styles.cardBlur}>
          <LinearGradient
            colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.15)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
          
          {/* Card Content */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.card}>
            {/* Welcome Text */}
            <Text style={styles.welcomeText}>Nimah</Text>
          <Text style={styles.subtitle}>
            {role === 'customer'
              ? t('login.subtitle', 'Sign in to rescue food near you')
              : t('login.subtitleStoreOwner', 'Sign in as a store owner')}
          </Text>

            {/* Decorative Leaf Icon */}
            <View style={styles.leafIcon}>
              <Ionicons name="leaf" size={24} color={Theme.colors.primary} />
            </View>

            {/* Input Fields */}
            <View style={styles.inputContainer}>
            {/* Customer name / Store name input */}
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={Theme.colors.text.muted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                placeholder={
                  role === 'customer'
                    ? t('login.fullName', 'Full Name')
                    : t('login.storeName', 'Store Name')
                }
                  placeholderTextColor={Theme.colors.text.muted}
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={Theme.colors.text.muted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder={t('login.password')}
                  placeholderTextColor={Theme.colors.text.muted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color={Theme.colors.text.muted}
                  />
                </Pressable>
              </View>
            </View>

            {/* Remember Me & Forgot Password */}
            <View style={styles.optionsRow}>
              <Pressable
                onPress={() => setRememberMe(!rememberMe)}
                style={styles.rememberMeRow}
              >
                <View
                  style={[
                    styles.checkbox,
                    rememberMe && styles.checkboxChecked,
                  ]}
                >
                  {rememberMe && (
                    <Ionicons
                      name="checkmark"
                      size={16}
                      color={Theme.colors.white}
                    />
                  )}
                </View>
                <Text style={styles.rememberMeText}>{t('login.rememberMe')}</Text>
              </Pressable>

              <Pressable>
                <Text style={styles.forgotPasswordText}>{t('login.forgotPassword')}</Text>
              </Pressable>
            </View>

            {/* Login Button */}
            <Pressable
              style={styles.loginButton}
              onPress={() => {
                if (role === 'storeOwner') {
                  onStoreOwnerLogin?.(fullName.trim() || undefined);
                } else {
                  onLogin?.();
                }
              }}
              accessibilityRole="button"
              accessibilityLabel={
                role === 'storeOwner'
                  ? t('login.loginStoreOwner', 'Login as store owner')
                  : t('login.loginCustomer', 'Login')
              }
            >
              <Text style={styles.loginButtonText}>
                {role === 'storeOwner'
                  ? t('login.loginStoreOwner', 'Login as store owner')
                  : t('login.loginCustomer', 'Login')}
              </Text>
            </Pressable>

            {/* Sign Up Link */}
            <View style={styles.signUpRow}>
              <Text style={styles.signUpText}>{t('login.noAccount')}</Text>
              <Pressable onPress={onSignUp}>
                <Text style={styles.signUpLink}>{t('login.signUp')}</Text>
              </Pressable>
            </View>

            {/* Store owner/customer switch - placed below sign-up row */}
            <View style={styles.storeRow}>
              {role === 'customer' ? (
                <>
                  <Text style={styles.signUpText}>{t('login.registeredStoreQ', 'Registered store? ')}</Text>
                  <Pressable
                    onPress={() => setRole('storeOwner')}
                    accessibilityRole="button"
                    accessibilityLabel={t('login.switchToStoreOwner', 'Login as store owner')}
                  >
                    <Text style={styles.signUpLink}>
                      {t('login.switchToStoreOwner', 'Login as store owner')}
                    </Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <Text style={styles.signUpText}>{t('login.customerAccountQ', 'Customer account? ')}</Text>
                  <Pressable
                    onPress={() => setRole('customer')}
                    accessibilityRole="button"
                    accessibilityLabel={t('login.switchToCustomer', 'Login as customer')}
                  >
                    <Text style={styles.signUpLink}>
                      {t('login.switchToCustomer', 'Login as customer')}
                    </Text>
                  </Pressable>
                </>
              )}
            </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.primary,
  },
  imageContainer: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  bottomFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 300,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: Theme.spacing.lg,
    zIndex: 10,
  },
  backButtonBlur: {
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
  cardWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: height * 0.32, // Card starts from ~32% of screen height
  },
  cardBlur: {
    flex: 1,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.26)',
    borderBottomWidth: 0,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Theme.spacing.xxl,
  },
  card: {
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.lg,
    paddingBottom: Theme.spacing.lg,
    minHeight: 420,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: Theme.colors.text.primary,
    textAlign: 'center',
    marginTop: Theme.spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    color: Theme.colors.text.muted,
    textAlign: 'center',
    marginTop: Theme.spacing.xs,
    marginBottom: Theme.spacing.lg,
  },
  leafIcon: {
    position: 'absolute',
    top: Theme.spacing.xl + 10,
    right: Theme.spacing.xl + 20,
  },
  inputContainer: {
    marginTop: Theme.spacing.xl,
    gap: Theme.spacing.md,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: Theme.borderRadius.lg,
    paddingHorizontal: Theme.spacing.md,
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(42, 63, 78, 0.12)',
  },
  inputIcon: {
    marginRight: Theme.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Theme.colors.text.primary,
    paddingVertical: 0,
  },
  eyeIcon: {
    padding: Theme.spacing.xs,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.xl,
  },
  rememberMeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Theme.colors.text.muted,
    backgroundColor: 'rgba(255,255,255,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  rememberMeText: {
    fontSize: 14,
    color: Theme.colors.text.primary,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: Theme.colors.text.primary,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius.lg,
    paddingVertical: Theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Theme.spacing.md,
    borderWidth: 0,
  },
  loginButtonText: {
    color: Theme.colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  signUpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Theme.spacing.xl,
  },
  storeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Theme.spacing.md,
  },
  signUpText: {
    fontSize: 14,
    color: Theme.colors.text.muted,
  },
  signUpLink: {
    fontSize: 14,
    color: Theme.colors.primaryDark,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

