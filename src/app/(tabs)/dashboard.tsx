import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../features/auth/AuthContext';
import { tournamentsApi } from '../../api';
import { Avatar, Badge, Card } from '../../components/ui';
import { BorderRadius, Colors, Spacing, Typography } from '../../theme';
import { Tournament } from '../../types/domain';

export default function DashboardScreen() {
  const router = useRouter();
  const { user, refreshProfile } = useAuth();

  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loadingTournaments, setLoadingTournaments] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cricketSport = user?.sports?.find((s) => s.sportId === 'cricket');
  const level = cricketSport?.level || 'BRONZE';

  const loadData = useCallback(async () => {
    try {
      const [, tourneys] = await Promise.all([
        refreshProfile(),
        tournamentsApi.getTournaments(),
      ]);
      setTournaments(tourneys);
    } catch {
      // ignore
    } finally {
      setLoadingTournaments(false);
      setRefreshing(false);
    }
  }, [refreshProfile]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const firstName = user?.name ? user.name.split(' ')[0] : 'Player';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/(tabs)/profile')}
            style={styles.profileMeta}
          >
            <Avatar name={user?.name} size={48} />
            <View style={styles.nameContainer}>
              <Text style={styles.greetingText}>Hello, {firstName}!</Text>
              <View style={styles.roleRow}>
                <Text style={styles.roleText}>Cricket Player</Text>
                <Text style={styles.roleDot}>•</Text>
                <Text style={styles.tierText}>{level} Tier</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Notification Bell */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => Alert.alert('Notifications', 'You have no new notifications.')}
            style={styles.bellButton}
          >
            <Ionicons name="notifications-outline" size={22} color={Colors.textPrimary} />
            <View style={styles.bellBadge}>
              <Text style={styles.bellBadgeText}>2</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Upcoming Match Card */}
        <Card variant="outlined" style={styles.matchCard}>
          <View style={styles.matchHeader}>
            <View style={styles.matchHeaderLeft}>
              <Text style={styles.matchTitle}>Upcoming Match</Text>
              <Text style={styles.matchTime}>Sat, 12 Oct • 2:00 PM</Text>
            </View>
            <Badge label="UPCOMING" variant="success" size="sm" />
          </View>

          <View style={styles.teamsRow}>
            {/* Team 1 */}
            <View style={styles.teamCol}>
              <View style={[styles.teamLogoBox, { backgroundColor: '#FEF3C7' }]}>
                <MaterialCommunityIcons name="shield-crown" size={28} color="#D97706" />
              </View>
              <Text style={styles.teamName}>Lions CC</Text>
            </View>

            {/* VS */}
            <View style={styles.vsBadge}>
              <Text style={styles.vsText}>VS</Text>
            </View>

            {/* Team 2 */}
            <View style={styles.teamCol}>
              <View style={[styles.teamLogoBox, { backgroundColor: '#FEE2E2' }]}>
                <MaterialCommunityIcons name="fire" size={28} color="#DC2626" />
              </View>
              <Text style={styles.teamName}>Tigers CC</Text>
            </View>
          </View>

          <View style={styles.venueRow}>
            <Ionicons name="location-outline" size={15} color={Colors.textSecondary} />
            <Text style={styles.venueText}>Greenfield Cricket Ground</Text>
          </View>
        </Card>

        {/* Quick Actions (3 Cards) */}
        <View style={styles.quickActionsRow}>
          {/* My Tournaments */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/(tabs)/tournaments')}
            style={styles.actionCard}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="trophy" size={24} color="#D97706" />
            </View>
            <Text style={styles.actionTitle}>My Tournaments</Text>
          </TouchableOpacity>

          {/* My Teams */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/(tabs)/teams')}
            style={styles.actionCard}
          >
            <View style={[styles.actionIconBox, { backgroundColor: Colors.primaryLight }]}>
              <Ionicons name="people" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.actionTitle}>My Teams</Text>
          </TouchableOpacity>

          {/* My Stats */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/stats')}
            style={styles.actionCard}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#DCFCE7' }]}>
              <Ionicons name="bar-chart" size={24} color="#16A34A" />
            </View>
            <Text style={styles.actionTitle}>My Stats</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Tournaments Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Tournaments</Text>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/tournaments')}
            activeOpacity={0.7}
          >
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {loadingTournaments ? (
          <ActivityIndicator size="small" color={Colors.primary} style={styles.loader} />
        ) : tournaments.length === 0 ? (
          <Card variant="outlined" style={styles.emptyCard}>
            <Ionicons name="trophy-outline" size={32} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No tournaments found</Text>
            <Text style={styles.emptySubtitle}>
              Tournaments organized on the platform will appear here.
            </Text>
          </Card>
        ) : (
          tournaments.slice(0, 3).map((item) => (
            <Card
              key={item.id}
              variant="outlined"
              style={styles.tournamentCard}
              onPress={() => router.push('/(tabs)/tournaments')}
            >
              <View style={styles.tournamentCardTop}>
                <View style={styles.tournamentIconBox}>
                  <MaterialCommunityIcons name="cricket" size={24} color={Colors.primary} />
                </View>
                <View style={styles.tournamentMeta}>
                  <Text style={styles.tournamentName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.tournamentDesc}>
                    {item.location || 'Velocity Sports Arena'}
                  </Text>
                </View>
                <Badge
                  label={item.status || 'UPCOMING'}
                  variant={item.status === 'ACTIVE' ? 'success' : 'info'}
                  size="sm"
                />
              </View>

              <View style={styles.tournamentCardBottom}>
                <View style={styles.infoPill}>
                  <Ionicons name="calendar-outline" size={13} color={Colors.textSecondary} />
                  <Text style={styles.infoPillText}>
                    {item.startDate ? `${item.startDate} to ${item.endDate || ''}` : 'Dates TBA'}
                  </Text>
                </View>
                <View style={styles.infoPill}>
                  <Ionicons name="shield-outline" size={13} color={Colors.textSecondary} />
                  <Text style={styles.infoPillText}>
                    {item.format ? item.format.replace('_', ' ') : 'T20'}
                  </Text>
                </View>
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
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing['3xl'],
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.base,
  },
  profileMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  nameContainer: {
    marginLeft: 12,
  },
  greetingText: {
    fontSize: Typography.sizes.lg,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  roleText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  roleDot: {
    marginHorizontal: 5,
    color: Colors.textMuted,
    fontSize: Typography.sizes.xs,
  },
  tierText: {
    fontSize: Typography.sizes.xs,
    color: Colors.bronze,
    fontWeight: '700',
  },
  bellButton: {
    width: 42,
    height: 42,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
    borderWidth: 1.2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bellBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBadgeText: {
    color: Colors.textLight,
    fontSize: 9,
    fontWeight: '700',
  },
  matchCard: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
    marginBottom: Spacing.base,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  matchHeaderLeft: {
    flex: 1,
  },
  matchTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  matchTime: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  teamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: Spacing.sm,
  },
  teamCol: {
    alignItems: 'center',
  },
  teamLogoBox: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  teamName: {
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  vsBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vsText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textSecondary,
  },
  venueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
  },
  venueText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginLeft: 4,
    fontWeight: '500',
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: Spacing.lg,
  },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderWidth: 1.2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.xl,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconBox: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: Typography.sizes.xs,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  viewAllText: {
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
    color: Colors.primary,
  },
  loader: {
    marginVertical: Spacing.lg,
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  tournamentCard: {
    marginBottom: Spacing.sm,
  },
  tournamentCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tournamentIconBox: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  tournamentMeta: {
    flex: 1,
  },
  tournamentName: {
    fontSize: Typography.sizes.base,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  tournamentDesc: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  tournamentCardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: 8,
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoPillText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
});
