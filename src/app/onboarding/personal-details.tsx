import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../features/auth/AuthContext';
import { userApi } from '../../api';
import { Avatar, Button, Header, Input, Stepper, DatePickerInput, isoToDisplayDate, displayToIsoDate } from '../../components/ui';
import { BorderRadius, Colors, Spacing, Typography } from '../../theme';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export default function PersonalDetailsScreen() {
  const router = useRouter();
  const { user, refreshProfile } = useAuth();

  const [name, setName] = useState(() => user?.name || '');
  const [dateOfBirth, setDateOfBirth] = useState(() => isoToDisplayDate(user?.playerProfile?.dateOfBirth));
  const [bloodGroup, setBloodGroup] = useState(() => user?.playerProfile?.bloodGroup || '');
  const [phone, setPhone] = useState(() => user?.playerProfile?.phone || '');
  const [city, setCity] = useState(() => user?.playerProfile?.city || '');
  const [emergencyName, setEmergencyName] = useState(() => user?.playerProfile?.emergencyContactName || '');
  const [emergencyPhone, setEmergencyPhone] = useState(() => user?.playerProfile?.emergencyContactPhone || '');

  const [bloodGroupModalVisible, setBloodGroupModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [dobError, setDobError] = useState<string | null>(null);

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

  const handleContinue = async () => {
    if (!validate() || !user) return;

    setLoading(true);
    try {
      // 1. Update user account name
      if (name.trim() !== user.name) {
        await userApi.updateUser(user.id, { name: name.trim() });
      }

      // Convert DD-MM-YYYY to YYYY-MM-DD for backend schema
      const isoDob = displayToIsoDate(dateOfBirth);

      // 2. Save player profile details
      await userApi.updatePlayerProfile(user.id, {
        dateOfBirth: isoDob || undefined,
        bloodGroup: bloodGroup.trim() || undefined,
        phone: phone.trim() || undefined,
        city: city.trim() || undefined,
        emergencyContactName: emergencyName.trim() || undefined,
        emergencyContactPhone: emergencyPhone.trim() || undefined,
      });

      // 3. Refresh user session
      await refreshProfile();

      // 4. Navigate to Step 2
      router.push('/onboarding/cricket-positions');
    } catch (err: any) {
      const msg = err?.message || 'Failed to save personal details. Please try again.';
      Alert.alert('Save Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        showBack
        onBack={() => {
          Alert.alert(
            'Exit Onboarding?',
            'You can return later to complete your profile.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Exit', style: 'destructive', onPress: () => router.replace('/(auth)/login') },
            ]
          );
        }}
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
          {/* Stepper */}
          <Stepper
            currentStep={1}
            totalSteps={2}
            stepTitle="Let's create your Player Profile"
            stepSubtitle="Tell us about yourself"
          />

          {/* Profile Photo Avatar */}
          <View style={styles.avatarSection}>
            <Avatar
              name={name || 'Player'}
              size={90}
              showCameraBadge
              onCameraPress={() => Alert.alert('Profile Photo', 'Photo upload workflow will be available in the next release.')}
            />
          </View>

          {/* Personal Details Section */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Personal Details</Text>

            <Input
              label="Full Name"
              required
              placeholder="e.g. Virat Sharma"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (nameError) setNameError(null);
              }}
              error={nameError || undefined}
              leftIcon={<Ionicons name="person-outline" size={18} color={Colors.textSecondary} />}
            />

            <DatePickerInput
              label="Date of Birth"
              value={dateOfBirth}
              onChange={(text) => {
                setDateOfBirth(text);
                if (dobError) setDobError(null);
              }}
              error={dobError || undefined}
              helperText="Select from picker or enter in DD-MM-YYYY"
            />

            {/* Blood Group Dropdown */}
            <View style={styles.inputContainerWrapper}>
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

          {/* Emergency Contact Section */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Emergency Contact (Optional)</Text>

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

          {/* Continue Button */}
          <Button
            title="Continue"
            onPress={handleContinue}
            loading={loading}
            style={styles.continueButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Blood Group Picker Modal */}
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing['3xl'],
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  sectionCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderWidth: 1.2,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  inputContainerWrapper: {
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
  continueButton: {
    marginTop: Spacing.xs,
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
    maxHeight: '80%',
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
