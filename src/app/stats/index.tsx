import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../components/ui';
import { BorderRadius, Colors, Spacing, Typography } from '../../theme';

export default function StatsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="My Stats" showBack onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Career Overview Banner Card */}
        <View style={styles.overviewCard}>
          <View style={styles.overviewHeader}>
            <Text style={styles.overviewTitle}>Career Overview</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => Alert.alert('Filter', 'All Tournaments selected.')}
              style={styles.filterDropdown}
            >
              <Text style={styles.filterText}>All Tournaments</Text>
              <Ionicons name="chevron-down" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Stats 4-grid */}
          <View style={styles.statsGrid}>
            <View style={styles.gridCol}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Matches</Text>
            </View>
            <View style={styles.gridCol}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Runs</Text>
            </View>
            <View style={styles.gridCol}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Wickets</Text>
            </View>
            <View style={styles.gridCol}>
              <Text style={styles.statNumber}>0*</Text>
              <Text style={styles.statLabel}>Best Score</Text>
            </View>
          </View>
        </View>

        {/* Empty State Card */}
        <View style={styles.emptyCard}>
          <View style={styles.trophyIconBox}>
            <Ionicons name="trophy-outline" size={48} color={Colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>Your performance stats will appear here</Text>
          <Text style={styles.emptySubtitle}>
            Once you participate in tournaments and matches are scored by officials, your official performance statistics will be automatically calculated and displayed.
          </Text>
        </View>
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
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing['3xl'],
  },
  overviewCard: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  overviewTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  filterDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  filterText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gridCol: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: Typography.sizes.xs,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
  emptyCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing['2xl'],
    alignItems: 'center',
    borderWidth: 1.2,
    borderColor: Colors.border,
    marginTop: Spacing.md,
  },
  trophyIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 290,
  },
});
