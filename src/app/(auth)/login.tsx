import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../features/auth/AuthContext';
import { Button, CricketSilhouettes, Header, Input, VelocityLogo } from '../../components/ui';
import { BorderRadius, Colors, Spacing, Typography } from '../../theme';

export default function LoginScreen() {
  const router = useRouter();
  const { sendOtp } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (val: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const handleSendOtp = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setError('Please enter your email address');
      return;
    }
    if (!validateEmail(trimmedEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const result = await sendOtp(trimmedEmail);
      router.push({
        pathname: '/(auth)/verify-otp',
        params: { email: trimmedEmail, devOtp: result.devOtp || '' },
      });
    } catch (err: any) {
      const msg = err?.message || 'Failed to send OTP. Please check your connection and try again.';
      setError(msg);
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert('Notice', 'Google login is coming soon. Please continue with Email OTP.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header showBack onBack={() => router.replace('/')} />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <VelocityLogo size="md" showSubtitle={false} style={styles.logo} />

          {/* Heading */}
          <View style={styles.headingContainer}>
            <Text style={styles.title}>Welcome Player!</Text>
            <Text style={styles.subtitle}>Enter your email to continue</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              placeholder="player@example.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (error) setError(null);
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={error || undefined}
              leftIcon={<Ionicons name="mail-outline" size={20} color={Colors.textSecondary} />}
            />

            <Button
              title="Send OTP"
              onPress={handleSendOtp}
              loading={loading}
              style={styles.sendButton}
            />

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Login Option */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleGoogleLogin}
              style={styles.googleButton}
            >
              <Ionicons name="logo-google" size={18} color="#EA4335" style={styles.googleIcon} />
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            {/* Terms */}
            <Text style={styles.termsText}>
              By continuing, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>.
            </Text>
          </View>

          {/* Cricket Silhouette Decoration */}
          <CricketSilhouettes style={styles.silhouettes} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  logo: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.base,
  },
  headingContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  form: {
    width: '100%',
  },
  sendButton: {
    marginTop: Spacing.xs,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    marginHorizontal: Spacing.md,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1.2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
  },
  googleIcon: {
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  termsText: {
    textAlign: 'center',
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: Spacing.xl,
    lineHeight: 16,
    paddingHorizontal: Spacing.sm,
  },
  termsLink: {
    color: Colors.primary,
    fontWeight: '600',
  },
  silhouettes: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },
});
