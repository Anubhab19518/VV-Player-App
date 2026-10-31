import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Badge, Card, Header } from '../../components/ui';
import { BorderRadius, Colors, Spacing, Typography } from '../../theme';

type TeamTab = 'current' | 'past';

export default function TeamsScreen() {
  const [activeTab, setActiveTab] = useState<TeamTab>('current');

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="My Teams" showBack={false} />

      {/* Tabs */}
      <View style={styles.segmentedContainer}>
        {(['current', 'past'] as TeamTab[]).map((tab) => {
          const isActive = activeTab === tab;
          const label = tab.charAt(0).toUpperCase() + tab.slice(1);
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.7}
              style={[styles.segmentButton, isActive && styles.segmentButtonActive]}
            >
              <Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'past' ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="time-outline" size={38} color={Colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No past teams</Text>
            <Text style={styles.emptySubtitle}>
              Teams from previous tournaments and leagues you participated in will appear here.
            </Text>
          </View>
        ) : (
          /* Clean team card & placeholder notice */
          <View>
            <Card variant="outlined" style={styles.teamCard}>
              <View style={styles.teamHeader}>
                <View style={[styles.teamLogoBox, { backgroundColor: '#FEF3C7' }]}>
                  <MaterialCommunityIcons name="shield-crown" size={30} color="#D97706" />
                </View>
                <View style={styles.teamMeta}>
                  <View style={styles.teamTitleRow}>
                    <Text style={styles.teamName}>Lions CC</Text>
                    <Badge label="CAPTAIN" variant="info" size="sm" style={styles.captainBadge} />
                  </View>
                  <Text style={styles.tournamentSubtitle}>Corporate Cricket Cup 2026</Text>
                  <Text style={styles.formatText}>Group Stage • T20</Text>
                </View>
              </View>

              {/* Record Summary */}
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statNum}>2</Text>
                  <Text style={styles.statLabel}>Matches</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                  <Text style={[styles.statNum, { color: Colors.success }]}>2</Text>
                  <Text style={styles.statLabel}>Wins</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                  <Text style={[styles.statNum, { color: Colors.error }]}>0</Text>
                  <Text style={styles.statLabel}>Losses</Text>
                </View>
              </View>

              {/* Action List Items */}
              <TouchableOpacity
                style={styles.actionRow}
                activeOpacity={0.7}
                onPress={() => Alert.alert('Team Squad', 'Squad management will open when the tournament starts.')}
              >
                <View style={styles.actionRowLeft}>
                  <Ionicons name="people-outline" size={18} color={Colors.textSecondary} />
                  <Text style={styles.actionRowText}>Team Squad</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionRow}
                activeOpacity={0.7}
                onPress={() => Alert.alert('Upcoming Matches', '3 matches scheduled for Lions CC in this edition.')}
              >
                <View style={styles.actionRowLeft}>
                  <Ionicons name="calendar-outline" size={18} color={Colors.textSecondary} />
                  <Text style={styles.actionRowText}>Upcoming Matches</Text>
                </View>
                <View style={styles.matchCountBadge}>
                  <Text style={styles.matchCountText}>3</Text>
                  <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionRow}
                activeOpacity={0.7}
                onPress={() => Alert.alert('Team Details', 'Lions Cricket Club - Registered for 2026.')}
              >
                <View style={styles.actionRowLeft}>
                  <Ionicons name="information-circle-outline" size={18} color={Colors.textSecondary} />
                  <Text style={styles.actionRowText}>Team Details</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
              </TouchableOpacity>
            </Card>

            <View style={styles.infoBox}>
              <Ionicons name="information-circle" size={18} color={Colors.primary} />
              <Text style={styles.infoBoxText}>
                When tournament organizers draft or invite you into a squad, your roster and invitations will update automatically.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceMuted,
    marginHorizontal: Spacing.base,
    borderRadius: BorderRadius.lg,
    padding: 4,
    marginBottom: Spacing.base,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
  segmentButtonActive: {
    backgroundColor: Colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontSize: Typography.sizes.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  segmentTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing['3xl'],
  },
  teamCard: {
    marginBottom: Spacing.base,
  },
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  teamLogoBox: {
    width: 54,
    height: 54,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  teamMeta: {
    flex: 1,
  },
  teamTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamName: {
    fontSize: Typography.sizes.base,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  captainBadge: {
    marginLeft: 8,
  },
  tournamentSubtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  formatText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    marginTop: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Colors.surfaceMuted,
    borderRadius: BorderRadius.lg,
    paddingVertical: 12,
    marginBottom: Spacing.base,
  },
  statBox: {
    alignItems: 'center',
  },
  statNum: {
    fontSize: Typography.sizes.lg,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  actionRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionRowText: {
    fontSize: Typography.sizes.sm,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  matchCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  matchCountText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['3xl'],
    paddingHorizontal: Spacing.xl,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.base,
  },
  emptyTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryLight,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    gap: 10,
  },
  infoBoxText: {
    flex: 1,
    fontSize: Typography.sizes.xs,
    color: Colors.primaryDark,
    lineHeight: 18,
  },
});
