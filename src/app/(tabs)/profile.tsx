import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../features/auth/AuthContext';
import { Avatar, Button, Card, Header, TierBadge, isoToDisplayDate } from '../../components/ui';
import { BorderRadius, Colors, Spacing, Typography } from '../../theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, refreshProfile, logout } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshProfile();
    setRefreshing(false);
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const cricketSport = user?.sports?.find((s) => s.sportId === 'cricket');
  const level = cricketSport?.level || 'BRONZE';

  const positions = cricketSport?.positions || [];
  const primaryPos = positions.find((p) => p.priority === 1)?.positionId;
  const secondaryPos = positions.find((p) => p.priority === 2)?.positionId;

  const formatPosition = (pos?: string): string => {
    if (!pos) return 'None';
    return pos
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  const profile = user?.playerProfile;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="My Profile"
        showBack={false}
        rightAction={
          <TouchableOpacity
            onPress={() => Alert.alert('Settings', 'App version: 1.0.0 (Expo SDK 57)')}
            style={styles.settingsButton}
          >
            <Ionicons name="settings-outline" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        {/* User Card */}
        <View style={styles.userCard}>
          <Avatar
            name={user?.name || 'Player'}
            size={86}
            showCameraBadge
            onCameraPress={() => router.push('/profile/edit')}
          />
          <Text style={styles.userName}>{user?.name || 'Player'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>

          <View style={styles.tierContainer}>
            <TierBadge level={level} size="md" />
            <Text style={styles.sportRoleText}>Cricket Player</Text>
          </View>

          <Text style={styles.tierHelpText}>
            Your tier may be updated by an authorized administrator.
          </Text>

          <Button
            title="Edit Profile"
            variant="outline"
            size="sm"
            onPress={() => router.push('/profile/edit')}
            icon={<Ionicons name="create-outline" size={16} color={Colors.textPrimary} />}
            style={styles.editProfileButton}
          />
        </View>

        {/* Personal Details Card */}
        <Card variant="outlined" style={styles.detailsCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Personal Details</Text>
            <TouchableOpacity onPress={() => router.push('/profile/edit')}>
              <Text style={styles.editActionText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date of Birth</Text>
            <Text style={styles.detailValue}>
              {profile?.dateOfBirth ? isoToDisplayDate(profile.dateOfBirth) : 'Not provided'}
            </Text>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Blood Group</Text>
            <Text style={styles.detailValue}>{profile?.bloodGroup || 'Not provided'}</Text>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Phone</Text>
            <Text style={styles.detailValue}>{profile?.phone || 'Not provided'}</Text>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>City</Text>
            <Text style={styles.detailValue}>{profile?.city || 'Not provided'}</Text>
          </View>
        </Card>

        {/* Emergency Contact Card */}
        <Card variant="outlined" style={styles.detailsCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Emergency Contact</Text>
            <TouchableOpacity onPress={() => router.push('/profile/edit')}>
              <Text style={styles.editActionText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Contact Name</Text>
            <Text style={styles.detailValue}>
              {profile?.emergencyContactName || 'Not provided'}
            </Text>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Contact Phone</Text>
            <Text style={styles.detailValue}>
              {profile?.emergencyContactPhone || 'Not provided'}
            </Text>
          </View>
        </Card>

        {/* Playing Positions Card */}
        <Card variant="outlined" style={styles.detailsCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Cricket Positions</Text>
            <TouchableOpacity onPress={() => router.push('/profile/edit')}>
              <Text style={styles.editActionText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Primary Position</Text>
            <Text style={styles.detailValue}>{formatPosition(primaryPos)}</Text>
          </View>

          {secondaryPos && (
            <>
              <View style={styles.detailDivider} />
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Secondary Position</Text>
                <Text style={styles.detailValue}>{formatPosition(secondaryPos)}</Text>
              </View>
            </>
          )}
        </Card>

        {/* Multi-role Notice */}
        {user?.roles && user.roles.length > 0 && (
          <View style={styles.rolesNotice}>
            <Ionicons name="shield-checkmark-outline" size={18} color={Colors.primary} />
            <Text style={styles.rolesNoticeText}>
              Platform roles linked to this account:{' '}
              <Text style={styles.boldText}>{user.roles.join(', ')}</Text>
            </Text>
          </View>
        )}

        {/* Sign Out Button */}
        <Button
          title="Sign Out"
          variant="outline"
          onPress={handleSignOut}
          icon={<Ionicons name="log-out-outline" size={18} color={Colors.error} />}
          textStyle={{ color: Colors.error }}
          style={styles.signOutButton}
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
  settingsButton: {
    padding: 6,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing['3xl'],
  },
  userCard: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.xl,
    borderWidth: 1.2,
    borderColor: Colors.border,
    marginBottom: Spacing.base,
  },
  userName: {
    fontSize: Typography.sizes.xl,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 10,
  },
  userEmail: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  tierContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
    gap: 8,
  },
  sportRoleText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  tierHelpText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  editProfileButton: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  detailsCard: {
    marginBottom: Spacing.md,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  editActionText: {
    fontSize: Typography.sizes.sm,
    fontWeight: '600',
    color: Colors.primary,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: Typography.sizes.sm,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  detailDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 8,
  },
  rolesNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    gap: 8,
    marginBottom: Spacing.base,
  },
  rolesNoticeText: {
    flex: 1,
    fontSize: Typography.sizes.xs,
    color: Colors.primaryDark,
    lineHeight: 18,
  },
  boldText: {
    fontWeight: '700',
  },
  signOutButton: {
    borderColor: Colors.errorBorder,
    backgroundColor: Colors.errorBg,
    marginTop: Spacing.sm,
  },
});
