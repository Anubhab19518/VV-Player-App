import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../features/auth/AuthContext';
import { BorderRadius, Colors, Spacing, Typography } from '../theme';

export default function SplashScreen() {
  const router = useRouter();
  const { isLoading, isAuthenticated, needsOnboarding } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        if (isAuthenticated) {
          if (needsOnboarding) {
            router.replace('/onboarding/personal-details');
          } else {
            router.replace('/(tabs)/dashboard');
          }
        }
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [isLoading, isAuthenticated, needsOnboarding, router]);

  const handleStart = () => {
    if (isAuthenticated) {
      if (needsOnboarding) {
        router.replace('/onboarding/personal-details');
      } else {
        router.replace('/(tabs)/dashboard');
      }
    } else {
      router.replace('/(auth)/login');
    }
  };

  return (
    <View style={styles.container}>
      {/* Dark stadium background ambiance */}
      <View style={styles.stadiumGlow} />

      <SafeAreaView style={styles.safeArea}>
        {/* Brand Header */}
        <View style={styles.headerSection}>
          <View style={styles.logoBadge}>
            <MaterialCommunityIcons name="lightning-bolt" size={36} color="#3B82F6" />
          </View>
          <Text style={styles.brandTitle}>VELOCITY</Text>
          <Text style={styles.brandSubtitle}>VENTURES</Text>
          <Text style={styles.tagline}>PLAY  •  COMPETE  •  GROW</Text>
        </View>

        {/* Cricket Hero Illustration */}
        <View style={styles.centerSection}>
          <View style={styles.cricketSphere}>
            <View style={styles.ballSeam} />
            <View style={styles.ballShine} />
          </View>
          <View style={styles.turfPatch}>
            <View style={styles.grassBlade1} />
            <View style={styles.grassBlade2} />
            <View style={styles.grassBlade3} />
          </View>
        </View>

        {/* Bottom CTA / Status */}
        <View style={styles.bottomSection}>
          <Text style={styles.journeyText}>Your Cricket Journey Starts Here</Text>

          {isLoading ? (
            <ActivityIndicator size="small" color="#60A5FA" style={styles.loader} />
          ) : (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleStart}
              style={styles.startButton}
            >
              <Text style={styles.startButtonText}>Get Started</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={styles.arrowIcon} />
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070D1E', // Dark stadium night theme
  },
  stadiumGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 380,
    backgroundColor: '#0F275A',
    opacity: 0.65,
    borderBottomLeftRadius: 180,
    borderBottomRightRadius: 180,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.xl,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(96, 165, 250, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  brandTitle: {
    fontSize: Typography.sizes['3xl'],
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 3,
  },
  brandSubtitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: '800',
    color: '#3B82F6',
    letterSpacing: 2,
    marginTop: -4,
  },
  tagline: {
    fontSize: Typography.sizes.xs,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 2.5,
    marginTop: Spacing.sm,
  },
  centerSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing['2xl'],
  },
  cricketSphere: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#DC2626',
    borderWidth: 3,
    borderColor: '#991B1B',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  ballSeam: {
    width: 128,
    height: 3,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '38deg' }],
  },
  ballShine: {
    position: 'absolute',
    top: 18,
    left: 24,
    width: 28,
    height: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    transform: [{ rotate: '-25deg' }],
  },
  turfPatch: {
    width: 190,
    height: 24,
    backgroundColor: '#15803D',
    borderRadius: BorderRadius.full,
    marginTop: -10,
    zIndex: -1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    opacity: 0.9,
  },
  grassBlade1: {
    width: 4,
    height: 12,
    backgroundColor: '#22C55E',
    borderRadius: 2,
  },
  grassBlade2: {
    width: 4,
    height: 16,
    backgroundColor: '#4ADE80',
    borderRadius: 2,
  },
  grassBlade3: {
    width: 4,
    height: 10,
    backgroundColor: '#22C55E',
    borderRadius: 2,
  },
  bottomSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  journeyText: {
    fontSize: Typography.sizes.base,
    fontWeight: '600',
    color: '#E2E8F0',
    letterSpacing: 0.5,
    marginBottom: Spacing.xl,
  },
  loader: {
    height: 52,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: BorderRadius.full,
    width: '100%',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
  },
  startButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  arrowIcon: {
    marginLeft: 8,
  },
});
