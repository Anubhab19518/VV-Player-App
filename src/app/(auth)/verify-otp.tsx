import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../features/auth/AuthContext';
import { Button, CricketSilhouettes, Header } from '../../components/ui';
import { BorderRadius, Colors, Spacing, Typography } from '../../theme';

export default function VerifyOtpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email: string; devOtp?: string }>();
  const email = params.email || '';
  const initialDevOtp = params.devOtp || '';

  const { verifyOtp, sendOtp, lastDevOtp } = useAuth();

  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(30);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Automatically populate OTP in development mode if returned
  useEffect(() => {
    const effectiveOtp = initialDevOtp || lastDevOtp;
    if (effectiveOtp && effectiveOtp.length === 6) {
      setOtpValues(effectiveOtp.split(''));
    }
  }, [initialDevOtp, lastDevOtp]);

  // Resend countdown timer
  useEffect(() => {
    if (timerSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerSeconds]);

  const handleOtpChange = (value: string, index: number) => {
    // Handle paste of 6 digits
    if (value.length > 1) {
      const cleanDigits = value.replace(/[^0-9]/g, '').slice(0, 6);
      const newValues = [...otpValues];
      for (let i = 0; i < 6; i++) {
        newValues[i] = cleanDigits[i] || '';
      }
      setOtpValues(newValues);
      if (cleanDigits.length === 6) {
        inputRefs.current[5]?.focus();
      }
      return;
    }

    const newValues = [...otpValues];
    newValues[index] = value.replace(/[^0-9]/g, '');
    setOtpValues(newValues);
    setError(null);

    // Auto focus next box
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = async () => {
    if (timerSeconds > 0) return;
    try {
      setLoading(true);
      setError(null);
      const res = await sendOtp(email);
      setTimerSeconds(30);
      if (res.devOtp && res.devOtp.length === 6) {
        setOtpValues(res.devOtp.split(''));
      }
      Alert.alert('Success', 'A new verification code has been sent.');
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    const fullOtp = otpValues.join('');
    if (fullOtp.length < 6) {
      setError('Please enter the complete 6-digit verification code');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const me = await verifyOtp(email, fullOtp);
      // Check onboarding requirement
      const hasPlayerProfile = Boolean(me.profiles?.player);
      const hasRegisteredSports = Boolean(me.sports && me.sports.length > 0);

      if (!hasPlayerProfile || !hasRegisteredSports) {
        router.replace('/onboarding/personal-details');
      } else {
        router.replace('/(tabs)/dashboard');
      }
    } catch (err: any) {
      const msg = err?.message || 'Invalid or expired OTP. Please try again.';
      setError(msg);
      Alert.alert('Verification Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  const formattedTimer = `00:${timerSeconds < 10 ? '0' : ''}${timerSeconds}`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header showBack onBack={() => router.back()} />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Heading */}
            <View style={styles.headingContainer}>
              <Text style={styles.title}>Verify Your Email</Text>
              <Text style={styles.subtitle}>
                We've sent a 6-digit code to{'\n'}
                <Text style={styles.emailHighlight}>{email}</Text>
              </Text>
            </View>

            {/* Development OTP Banner */}
            {(initialDevOtp || lastDevOtp) && (
              <View style={styles.devOtpBanner}>
                <Ionicons name="information-circle" size={16} color={Colors.primary} />
                <Text style={styles.devOtpText}>
                  Development mode: Code pre-filled
                </Text>
              </View>
            )}

            {/* 6 Digit Inputs */}
            <View style={styles.otpRow}>
              {otpValues.map((val, idx) => (
                <TextInput
                  key={idx}
                  ref={(ref) => {
                    inputRefs.current[idx] = ref;
                  }}
                  value={val}
                  onChangeText={(text) => handleOtpChange(text, idx)}
                  onKeyPress={(e) => handleKeyPress(e, idx)}
                  keyboardType="number-pad"
                  maxLength={idx === 0 ? 6 : 1}
                  selectTextOnFocus
                  style={[
                    styles.otpBox,
                    val ? styles.otpBoxFilled : null,
                    error ? styles.otpBoxError : null,
                  ]}
                />
              ))}
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            {/* Resend Link */}
            <View style={styles.resendRow}>
              {timerSeconds > 0 ? (
                <Text style={styles.timerText}>
                  Resend OTP in <Text style={styles.timerHighlight}>{formattedTimer}</Text>
                </Text>
              ) : (
                <TouchableOpacity onPress={handleResendOtp} disabled={loading}>
                  <Text style={styles.resendLink}>Resend OTP</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Action */}
            <Button
              title="Verify & Continue"
              onPress={handleVerify}
              loading={loading}
              disabled={otpValues.join('').length < 6}
              style={styles.verifyButton}
            />
          </View>

          {/* Cricket Silhouettes */}
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
  content: {
    width: '100%',
  },
  headingContainer: {
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  emailHighlight: {
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  devOtpBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  devOtpText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primaryDark,
    fontWeight: '600',
    marginLeft: 6,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: Spacing.md,
  },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  otpBoxFilled: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surface,
  },
  otpBoxError: {
    borderColor: Colors.error,
    backgroundColor: Colors.errorBg,
  },
  errorText: {
    color: Colors.error,
    fontSize: Typography.sizes.xs,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  resendRow: {
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  timerText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  timerHighlight: {
    fontWeight: '700',
    color: Colors.primary,
  },
  resendLink: {
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
    color: Colors.primary,
  },
  verifyButton: {
    marginTop: Spacing.xs,
  },
  silhouettes: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },
});
