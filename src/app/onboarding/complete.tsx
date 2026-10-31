import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../features/auth/AuthContext';
import { Button, CricketEquipmentBadge, TierBadge } from '../../components/ui';
import { BorderRadius, Colors, Spacing, Typography } from '../../theme';

export default function OnboardingCompleteScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const cricketSport = user?.sports?.find((s) => s.sportId === 'cricket');
  const level = cricketSport?.level || 'BRONZE';

  const positions = cricketSport?.positions || [];
  const primaryPos = positions.find((p) => p.priority === 1)?.positionId;
  const secondaryPos = positions.find((p) => p.priority === 2)?.positionId;

  const formatPositionName = (id?: string): string => {
    if (!id) return 'Not selected';
    return id
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleGoToDashboard = () => {
    router.replace('/(tabs)/dashboard');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Success Badge */}
        <View style={styles.successIconCircle}>
          <Ionicons name="checkmark" size={36} color={Colors.textLight} />
        </View>

        {/* Cricket Graphic */}
        <CricketEquipmentBadge style={styles.equipmentBadge} />

        {/* Headings */}
        <View style={styles.headingSection}>
          <Text style={styles.title}>All Set, Player!</Text>
          <Text style={styles.subtitle}>
            Your profile has been created successfully.
          </Text>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          {/* Sport */}
          <View style={styles.summaryRow}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#FEE2E2' }]}>
                <MaterialCommunityIcons name="cricket" size={20} color="#DC2626" />
              </View>
              <View>
                <Text style={styles.rowLabel}>Sport</Text>
                <Text style={styles.rowValue}>Cricket</Text>
              </View>
            </View>
          </View>

          <View style={styles.rowDivider} />

          {/* Tier */}
          <View style={styles.summaryRow}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconBox, { backgroundColor: Colors.bronzeBg }]}>
                <Ionicons name="trophy" size={18} color={Colors.bronze} />
              </View>
              <View>
                <Text style={styles.rowLabel}>Tier</Text>
                <TierBadge level={level} size="sm" style={styles.tierBadge} />
              </View>
            </View>
          </View>

          <View style={styles.rowDivider} />

          {/* Primary Position */}
          <View style={styles.summaryRow}>
            <View style={styles.rowLeft}>
              <View style={[styles.iconBox, { backgroundColor: Colors.primaryLight }]}>
                <MaterialCommunityIcons name="bat" size={18} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.rowLabel}>Primary Position</Text>
                <Text style={styles.rowValue}>{formatPositionName(primaryPos)}</Text>
              </View>
            </View>
          </View>

          {/* Secondary Position */}
          {secondaryPos && (
            <>
              <View style={styles.rowDivider} />
              <View style={styles.summaryRow}>
                <View style={styles.rowLeft}>
                  <View style={[styles.iconBox, { backgroundColor: '#F0FDF4' }]}>
                    <MaterialCommunityIcons name="shield-star-outline" size={18} color="#16A34A" />
                  </View>
                  <View>
                    <Text style={styles.rowLabel}>Secondary Position</Text>
                    <Text style={styles.rowValue}>{formatPositionName(secondaryPos)}</Text>
                  </View>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Go to Dashboard */}
        <Button
          title="Go to Dashboard"
          onPress={handleGoToDashboard}
          style={styles.dashboardButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing['3xl'],
    alignItems: 'center',
  },
  successIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  equipmentBadge: {
    marginBottom: Spacing.xl,
  },
  headingSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: Typography.sizes['3xl'],
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  summaryCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.base,
    borderWidth: 1.2,
    borderColor: Colors.border,
    marginBottom: Spacing['2xl'],
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginBottom: 2,
  },
  rowValue: {
    fontSize: Typography.sizes.base,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  tierBadge: {
    marginTop: 2,
  },
  rowDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 4,
  },
  dashboardButton: {
    width: '100%',
  },
});
