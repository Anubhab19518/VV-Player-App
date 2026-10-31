import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { tournamentsApi } from '../../api';
import { Badge, Card, Header } from '../../components/ui';
import { BorderRadius, Colors, Spacing, Typography } from '../../theme';
import { Tournament } from '../../types/domain';

type TabType = 'upcoming' | 'ongoing' | 'completed';

export default function TournamentsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTournaments = async () => {
    try {
      const data = await tournamentsApi.getTournaments();
      setTournaments(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTournaments();
  };

  // Filter tournaments based on active tab
  const filteredTournaments = tournaments.filter((t) => {
    const status = (t.status || '').toUpperCase();
    if (activeTab === 'ongoing') {
      return status === 'ONGOING' || status === 'ACTIVE';
    }
    if (activeTab === 'completed') {
      return status === 'COMPLETED' || status === 'FINISHED';
    }
    // upcoming / draft
    return status === 'UPCOMING' || status === 'DRAFT' || !status;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="My Tournaments" showBack={false} />

      {/* Segmented Filter Tabs */}
      <View style={styles.segmentedContainer}>
        {(['upcoming', 'ongoing', 'completed'] as TabType[]).map((tab) => {
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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
        ) : filteredTournaments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="trophy-outline" size={38} color={Colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No {activeTab} tournaments</Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'upcoming'
                ? 'Join or register for a tournament to see your match schedule here.'
                : activeTab === 'ongoing'
                ? 'You do not have any tournaments currently underway.'
                : 'Your finished competitions and tournament history will appear here.'}
            </Text>
          </View>
        ) : (
          filteredTournaments.map((t) => (
            <Card key={t.id} variant="outlined" style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconBox}>
                  <MaterialCommunityIcons name="cricket" size={26} color={Colors.primary} />
                </View>
                <View style={styles.headerInfo}>
                  <Text style={styles.tournamentName}>{t.name}</Text>
                  <Text style={styles.organizerText}>
                    {t.description || 'Cricket Championship'}
                  </Text>
                </View>
                <Badge
                  label={t.status || 'UPCOMING'}
                  variant={t.status === 'ACTIVE' ? 'success' : 'info'}
                  size="sm"
                />
              </View>

              <View style={styles.metaRow}>
                <Ionicons name="calendar-outline" size={15} color={Colors.textSecondary} />
                <Text style={styles.metaText}>
                  {t.startDate ? `${t.startDate} to ${t.endDate || ''}` : 'Dates TBA'}
                </Text>
              </View>

              <View style={styles.metaRow}>
                <Ionicons name="location-outline" size={15} color={Colors.textSecondary} />
                <Text style={styles.metaText}>{t.location || 'Velocity Cricket Arena'}</Text>
              </View>

              <View style={styles.footerRow}>
                <View style={styles.badgePill}>
                  <Text style={styles.badgePillText}>
                    {t.format ? t.format.replace('_', ' ') : 'T20'}
                  </Text>
                </View>
                {t.maxTeams && (
                  <View style={styles.badgePill}>
                    <Text style={styles.badgePillText}>{t.maxTeams} Teams</Text>
                  </View>
                )}
              </View>
            </Card>
          ))
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
  loader: {
    marginVertical: Spacing['2xl'],
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
  card: {
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  tournamentName: {
    fontSize: Typography.sizes.base,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  organizerText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  metaText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginLeft: 6,
    fontWeight: '500',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: Spacing.sm,
  },
  badgePill: {
    backgroundColor: Colors.surfaceMuted,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  badgePillText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
});
