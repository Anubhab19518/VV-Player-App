import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../features/auth/AuthContext';
import { sportsApi, userApi } from '../../api';
import { Button, Header, Stepper, PriorityBadge } from '../../components/ui';
import { BorderRadius, Colors, Spacing, Typography } from '../../theme';
import { CricketPosition } from '../../types/domain';

interface SelectedPosition {
  positionId: string;
  priority: number;
}

export default function CricketPositionsScreen() {
  const router = useRouter();
  const { user, refreshProfile } = useAuth();

  const [positions, setPositions] = useState<CricketPosition[]>([]);
  const [loadingPositions, setLoadingPositions] = useState(true);
  const [selectedPositions, setSelectedPositions] = useState<SelectedPosition[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Fetch cricket positions from backend
  useEffect(() => {
    let isMounted = true;
    const fetchPositions = async () => {
      try {
        const data = await sportsApi.getCricketPositions();
        if (isMounted) {
          setPositions(data);
        }
      } catch {
        Alert.alert('Error', 'Failed to load cricket positions. Please try again.');
      } finally {
        if (isMounted) setLoadingPositions(false);
      }
    };

    fetchPositions();
    return () => {
      isMounted = false;
    };
  }, []);

  // Pre-fill existing preferences if any
  useEffect(() => {
    if (user?.sports) {
      const cricketSport = user.sports.find((s) => s.sportId === 'cricket');
      if (cricketSport?.positions && cricketSport.positions.length > 0) {
        setSelectedPositions(
          cricketSport.positions.map((p) => ({
            positionId: p.positionId,
            priority: p.priority,
          }))
        );
      }
    }
  }, [user]);

  const handleTogglePosition = (positionId: string) => {
    const existing = selectedPositions.find((p) => p.positionId === positionId);

    if (existing) {
      // Deselect
      const remaining = selectedPositions.filter((p) => p.positionId !== positionId);
      // Re-assign priority 1 to remaining if priority 1 was removed
      const normalized = remaining.map((p, idx) => ({
        ...p,
        priority: idx + 1,
      }));
      setSelectedPositions(normalized);
    } else {
      // Select
      if (selectedPositions.length === 0) {
        setSelectedPositions([{ positionId, priority: 1 }]);
      } else if (selectedPositions.length === 1) {
        setSelectedPositions([...selectedPositions, { positionId, priority: 2 }]);
      } else {
        // Max 2 positions
        Alert.alert(
          'Maximum Positions Reached',
          'You can select up to 2 positions (Primary & Secondary). Deselect one to change.'
        );
      }
    }
  };

  const getPositionIcon = (category: string) => {
    switch (category) {
      case 'BATTING':
        return <MaterialCommunityIcons name="cricket" size={24} color="#D97706" />;
      case 'BOWLING':
        return <MaterialCommunityIcons name="baseball" size={24} color="#DC2626" />;
      case 'ALL_ROUND':
      default:
        return <MaterialCommunityIcons name="shield-star" size={24} color={Colors.primary} />;
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    if (selectedPositions.length === 0) {
      Alert.alert('Selection Required', 'Please select at least 1 playing position.');
      return;
    }

    setSubmitting(true);
    try {
      await userApi.setPlayerSport(user.id, {
        sportId: 'cricket',
        positions: selectedPositions,
      });

      // Authoritative session refresh
      await refreshProfile();

      // Navigate to complete screen
      router.push('/onboarding/complete');
    } catch (err: any) {
      const msg = err?.message || 'Failed to save position preferences. Please try again.';
      Alert.alert('Save Failed', msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header showBack onBack={() => router.back()} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stepper */}
        <Stepper
          currentStep={2}
          totalSteps={2}
          stepTitle="Select Your Playing Positions"
          stepSubtitle="Choose up to 2 primary positions"
        />

        {/* Priority Legend */}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <PriorityBadge priority={1} />
            <Text style={styles.legendText}>Primary</Text>
          </View>
          <View style={styles.legendItem}>
            <PriorityBadge priority={2} />
            <Text style={styles.legendText}>Secondary</Text>
          </View>
        </View>

        {/* Bronze Tier Banner */}
        <View style={styles.tierBanner}>
          <View style={styles.tierIconContainer}>
            <Ionicons name="trophy" size={22} color={Colors.bronze} />
          </View>
          <View style={styles.tierTextContainer}>
            <Text style={styles.tierTitle}>You will be assigned the BRONZE tier by default.</Text>
            <Text style={styles.tierDescription}>
              Tiers are evaluated and upgraded by organizers and tournament administrators.
            </Text>
          </View>
        </View>

        {/* Positions List */}
        {loadingPositions ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading positions from server...</Text>
          </View>
        ) : (
          <View style={styles.positionsList}>
            {positions.map((pos) => {
              const selectedItem = selectedPositions.find((p) => p.positionId === pos.id);
              const isSelected = Boolean(selectedItem);

              return (
                <TouchableOpacity
                  key={pos.id}
                  activeOpacity={0.7}
                  onPress={() => handleTogglePosition(pos.id)}
                  style={[
                    styles.positionCard,
                    isSelected && styles.positionCardSelected,
                  ]}
                >
                  <View style={styles.cardLeft}>
                    <View style={styles.categoryIconBox}>
                      {getPositionIcon(pos.category)}
                    </View>
                    <View style={styles.positionInfo}>
                      <Text
                        style={[
                          styles.positionName,
                          isSelected && styles.positionNameSelected,
                        ]}
                      >
                        {pos.name}
                      </Text>
                      <Text style={styles.subRolesText}>
                        {pos.subRoles && pos.subRoles.length > 0
                          ? pos.subRoles.join(', ')
                          : pos.category}
                      </Text>
                    </View>
                  </View>

                  {/* Priority badge or empty checkbox */}
                  <View style={styles.cardRight}>
                    {isSelected ? (
                      <PriorityBadge priority={selectedItem!.priority} />
                    ) : (
                      <View style={styles.emptyCheckbox} />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Complete Registration Button */}
        <Button
          title="Complete Registration"
          onPress={handleSubmit}
          loading={submitting}
          disabled={selectedPositions.length === 0}
          style={styles.submitButton}
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
    paddingBottom: Spacing['3xl'],
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xl,
    marginBottom: Spacing.base,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendText: {
    fontSize: Typography.sizes.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tierBanner: {
    flexDirection: 'row',
    backgroundColor: Colors.bronzeBg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1.2,
    borderColor: Colors.bronzeBorder,
    marginBottom: Spacing.lg,
    alignItems: 'flex-start',
  },
  tierIconContainer: {
    marginRight: 10,
    marginTop: 2,
  },
  tierTextContainer: {
    flex: 1,
  },
  tierTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
    color: Colors.bronze,
    marginBottom: 2,
  },
  tierDescription: {
    fontSize: Typography.sizes.xs,
    color: '#8A5832',
    lineHeight: 16,
  },
  loadingContainer: {
    paddingVertical: Spacing['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: Spacing.sm,
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  positionsList: {
    marginBottom: Spacing.xl,
  },
  positionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderWidth: 1.2,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  positionCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#F8FAFF',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIconBox: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  positionInfo: {
    flex: 1,
  },
  positionName: {
    fontSize: Typography.sizes.base,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  positionNameSelected: {
    color: Colors.primaryDark,
  },
  subRolesText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
  cardRight: {
    marginLeft: 12,
  },
  emptyCheckbox: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.sm,
    borderWidth: 1.5,
    borderColor: Colors.borderDark,
    backgroundColor: Colors.surface,
  },
  submitButton: {
    marginTop: Spacing.xs,
  },
});
