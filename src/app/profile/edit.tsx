import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../features/auth/AuthContext';
import { sportsApi, userApi } from '../../api';
import { Avatar, Button, Header, Input, PriorityBadge, DatePickerInput, isoToDisplayDate, displayToIsoDate } from '../../components/ui';
import { BorderRadius, Colors, Spacing, Typography } from '../../theme';
import { CricketPosition } from '../../types/domain';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, refreshProfile } = useAuth();

  const [name, setName] = useState(() => user?.name || '');
  const [dateOfBirth, setDateOfBirth] = useState(() => isoToDisplayDate(user?.playerProfile?.dateOfBirth));
  const [bloodGroup, setBloodGroup] = useState(() => user?.playerProfile?.bloodGroup || '');
  const [phone, setPhone] = useState(() => user?.playerProfile?.phone || '');
  const [city, setCity] = useState(() => user?.playerProfile?.city || '');
  const [emergencyName, setEmergencyName] = useState(() => user?.playerProfile?.emergencyContactName || '');
  const [emergencyPhone, setEmergencyPhone] = useState(() => user?.playerProfile?.emergencyContactPhone || '');

  const [positions, setPositions] = useState<CricketPosition[]>([]);
  const [selectedPositions, setSelectedPositions] = useState<{ positionId: string; priority: number }[]>(() => {
    const cricket = user?.sports?.find((s) => s.sportId === 'cricket');
    return cricket?.positions
      ? cricket.positions.map((p) => ({ positionId: p.positionId, priority: p.priority }))
      : [];
  });
  const [loadingPositions, setLoadingPositions] = useState(true);

  const [bloodGroupModalVisible, setBloodGroupModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [dobError, setDobError] = useState<string | null>(null);

  // Fetch cricket positions
  useEffect(() => {
    let isMounted = true;
    sportsApi
      .getCricketPositions()
      .then((data) => {
        if (isMounted) setPositions(data);
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoadingPositions(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleTogglePosition = (positionId: string) => {
    const existing = selectedPositions.find((p) => p.positionId === positionId);

    if (existing) {
      const remaining = selectedPositions.filter((p) => p.positionId !== positionId);
      const normalized = remaining.map((p, idx) => ({
        ...p,
        priority: idx + 1,
      }));
      setSelectedPositions(normalized);
    } else {
      if (selectedPositions.length === 0) {
        setSelectedPositions([{ positionId, priority: 1 }]);
      } else if (selectedPositions.length === 1) {
        setSelectedPositions([...selectedPositions, { positionId, priority: 2 }]);
      } else {
        Alert.alert(
          'Maximum Positions Reached',
          'You can select up to 2 positions (Primary & Secondary). Deselect one to change.'
        );
      }
    }
  };

  const validate = (): boolean => {
    let valid = true;
    setNameError(null);
    setDobError(null);

    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setNameError('Full name is required (at least 2 characters)');
      valid = false;
    }

    if (dateOfBirth.trim()) {
      const dobPattern = /^\d{2}-\d{2}-\d{4}$/;
      if (!dobPattern.test(dateOfBirth.trim())) {
        setDobError('Date of birth must be DD-MM-YYYY');
        valid = false;
      }
    }

    return valid;
  };

  const handleSave = async () => {
    if (!validate() || !user) return;

    setSaving(true);
    try {
      // 1. Update User name if changed
      if (name.trim() !== user.name) {
        await userApi.updateUser(user.id, { name: name.trim() });
      }

      // Convert DD-MM-YYYY to YYYY-MM-DD for backend schema
      const isoDob = displayToIsoDate(dateOfBirth);

      // 2. Update player profile
      await userApi.updatePlayerProfile(user.id, {
        dateOfBirth: isoDob || undefined,
        bloodGroup: bloodGroup.trim() || undefined,
        phone: phone.trim() || undefined,
        city: city.trim() || undefined,
        emergencyContactName: emergencyName.trim() || undefined,
        emergencyContactPhone: emergencyPhone.trim() || undefined,
      });

      // 3. Update cricket positions if selected
      if (selectedPositions.length > 0) {
        await userApi.setPlayerSport(user.id, {
          sportId: 'cricket',
          positions: selectedPositions,
        });
      }

      // 4. Refresh authoritative profile from backend
      await refreshProfile();

      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      const msg = err?.message || 'Failed to update profile. Please try again.';
      Alert.alert('Update Failed', msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Edit Profile"
        showBack
        onBack={() => router.back()}
        rightAction={
          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            style={styles.saveButton}
          >
            {saving ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </TouchableOpacity>
        }
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar & Photo Change */}
          <View style={styles.avatarSection}>
            <Avatar name={name || 'Player'} size={88} showCameraBadge />
            <TouchableOpacity
              onPress={() => Alert.alert('Profile Photo', 'Photo upload workflow will be available in the next release.')}
              style={styles.changePhotoBtn}
            >
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          </View>

          {/* Personal Details */}
          <View style={styles.formCard}>
            <Text style={styles.cardHeading}>Personal Details</Text>

            <Input
              label="Full Name"
              required
              placeholder="e.g. Virat Sharma"
              value={name}
              onChangeText={(t) => {
                setName(t);
                if (nameError) setNameError(null);
              }}
              error={nameError || undefined}
              leftIcon={<Ionicons name="person-outline" size={18} color={Colors.textSecondary} />}
            />

            <DatePickerInput
              label="Date of Birth"
              value={dateOfBirth}
              onChange={(t) => {
                setDateOfBirth(t);
                if (dobError) setDobError(null);
              }}
              error={dobError || undefined}
              helperText="Select from picker or enter in DD-MM-YYYY"
            />

            {/* Blood Group Picker */}
            <View style={styles.inputWrapper}>
              <Text style={styles.fieldLabel}>Blood Group</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setBloodGroupModalVisible(true)}
                style={styles.dropdownTrigger}
              >
                <View style={styles.dropdownLeft}>
                  <Ionicons name="water-outline" size={18} color={Colors.textSecondary} style={styles.dropdownIcon} />
                  <Text style={[styles.dropdownValue, !bloodGroup && styles.dropdownPlaceholder]}>
                    {bloodGroup || 'Select Blood Group'}
                  </Text>
                </View>
                <Ionicons name="chevron-down" size={18} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Input
              label="Phone Number"
              placeholder="9876543210"
              prefix="+91"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              leftIcon={<Ionicons name="call-outline" size={18} color={Colors.textSecondary} />}
            />

            <Input
              label="City"
              placeholder="e.g. Kolkata"
              value={city}
              onChangeText={setCity}
              leftIcon={<Ionicons name="location-outline" size={18} color={Colors.textSecondary} />}
            />
          </View>

          {/* Emergency Contact */}
          <View style={styles.formCard}>
            <Text style={styles.cardHeading}>Emergency Contact</Text>

            <Input
              label="Emergency Contact Name"
              placeholder="e.g. Rajesh Sharma"
              value={emergencyName}
              onChangeText={setEmergencyName}
              leftIcon={<Ionicons name="person-circle-outline" size={18} color={Colors.textSecondary} />}
            />

            <Input
              label="Emergency Contact Phone"
              placeholder="9876543211"
              prefix="+91"
              value={emergencyPhone}
              onChangeText={setEmergencyPhone}
              keyboardType="phone-pad"
              leftIcon={<Ionicons name="call-outline" size={18} color={Colors.textSecondary} />}
            />
          </View>

          {/* Playing Positions */}
          <View style={styles.formCard}>
            <Text style={styles.cardHeading}>Cricket Playing Positions</Text>
            <Text style={styles.cardSubheading}>
              Select up to 2 positions (Priority 1: Primary, Priority 2: Secondary)
            </Text>

            {loadingPositions ? (
              <ActivityIndicator size="small" color={Colors.primary} style={styles.loader} />
            ) : (
              positions.map((pos) => {
                const selectedItem = selectedPositions.find((p) => p.positionId === pos.id);
                const isSelected = Boolean(selectedItem);

                return (
                  <TouchableOpacity
                    key={pos.id}
                    activeOpacity={0.7}
                    onPress={() => handleTogglePosition(pos.id)}
                    style={[
                      styles.positionRow,
                      isSelected && styles.positionRowSelected,
                    ]}
                  >
                    <View style={styles.positionLeft}>
                      <Text style={[styles.posName, isSelected && styles.posNameSelected]}>
                        {pos.name}
                      </Text>
                      <Text style={styles.posSub}>
                        {pos.subRoles && pos.subRoles.length > 0 ? pos.subRoles.join(', ') : pos.category}
                      </Text>
                    </View>

                    {isSelected ? (
                      <PriorityBadge priority={selectedItem!.priority} />
                    ) : (
                      <View style={styles.emptyCheck} />
                    )}
                  </TouchableOpacity>
                );
              })
            )}
          </View>

          <Button
            title="Save Profile"
            onPress={handleSave}
            loading={saving}
            style={styles.saveSubmitButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Blood Group Modal */}
      <Modal
        visible={bloodGroupModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setBloodGroupModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setBloodGroupModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Blood Group</Text>
            {BLOOD_GROUPS.map((bg) => (
              <TouchableOpacity
                key={bg}
                style={[
                  styles.bloodGroupItem,
                  bloodGroup === bg && styles.bloodGroupItemSelected,
                ]}
                onPress={() => {
                  setBloodGroup(bg);
                  setBloodGroupModalVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.bloodGroupText,
                    bloodGroup === bg && styles.bloodGroupTextSelected,
                  ]}
                >
                  {bg}
                </Text>
                {bloodGroup === bg && (
                  <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  saveButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  saveButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: '700',
    color: Colors.primary,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing['3xl'],
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: Spacing.base,
  },
  changePhotoBtn: {
    marginTop: 8,
  },
  changePhotoText: {
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
    color: Colors.primary,
  },
  formCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderWidth: 1.2,
    borderColor: Colors.border,
    marginBottom: Spacing.base,
  },
  cardHeading: {
    fontSize: Typography.sizes.base,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  cardSubheading: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  inputWrapper: {
    marginBottom: Spacing.md,
  },
  fieldLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderWidth: 1.2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    height: 52,
  },
  dropdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownIcon: {
    marginRight: 10,
  },
  dropdownValue: {
    fontSize: Typography.sizes.base,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  dropdownPlaceholder: {
    color: Colors.textMuted,
    fontWeight: '400',
  },
  loader: {
    marginVertical: Spacing.md,
  },
  positionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.surfaceMuted,
  },
  positionRowSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  positionLeft: {
    flex: 1,
  },
  posName: {
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  posNameSelected: {
    color: Colors.primaryDark,
  },
  posSub: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  emptyCheck: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Colors.borderDark,
    backgroundColor: Colors.surface,
  },
  saveSubmitButton: {
    marginTop: Spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 27, 61, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.lg,
  },
  modalTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  bloodGroupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: Spacing.base,
    borderRadius: BorderRadius.md,
    marginBottom: 4,
  },
  bloodGroupItemSelected: {
    backgroundColor: Colors.primaryLight,
  },
  bloodGroupText: {
    fontSize: Typography.sizes.base,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  bloodGroupTextSelected: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
