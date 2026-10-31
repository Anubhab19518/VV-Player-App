import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  ViewStyle,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BorderRadius, Colors, Spacing, Typography } from '../../theme';

export interface DatePickerInputProps {
  label?: string;
  required?: boolean;
  value?: string; // Expected in DD-MM-YYYY format
  onChange: (date: string) => void; // Emits DD-MM-YYYY
  error?: string;
  helperText?: string;
  containerStyle?: ViewStyle;
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// Convert ISO (YYYY-MM-DD) to Display (DD-MM-YYYY)
export function isoToDisplayDate(isoStr?: string | null): string {
  if (!isoStr || typeof isoStr !== 'string') return '';
  const trimmed = isoStr.trim();
  const parts = trimmed.split('-');
  if (parts.length === 3 && parts[0].length === 4) {
    const [year, month, day] = parts;
    return `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`;
  }
  return trimmed;
}

// Convert Display (DD-MM-YYYY) to ISO (YYYY-MM-DD)
export function displayToIsoDate(displayStr?: string | null): string {
  if (!displayStr || typeof displayStr !== 'string') return '';
  const trimmed = displayStr.trim();
  const parts = trimmed.split('-');
  if (parts.length === 3 && parts[0].length === 2 && parts[2].length === 4) {
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return trimmed;
}

export const DatePickerInput: React.FC<DatePickerInputProps> = ({
  label,
  required,
  value = '',
  onChange,
  error,
  helperText,
  containerStyle,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [yearPickerVisible, setYearPickerVisible] = useState(false);

  // Parse current value or fallback
  const parsed = useMemo(() => {
    let day = 1;
    let month = 0; // 0-indexed
    let year = 1998;

    if (value && value.includes('-')) {
      const parts = value.split('-');
      if (parts.length === 3) {
        if (parts[0].length === 2 && parts[2].length === 4) {
          // DD-MM-YYYY
          day = parseInt(parts[0], 10) || 1;
          month = Math.max(0, Math.min(11, (parseInt(parts[1], 10) || 1) - 1));
          year = parseInt(parts[2], 10) || 1998;
        } else if (parts[0].length === 4) {
          // YYYY-MM-DD fallback
          year = parseInt(parts[0], 10) || 1998;
          month = Math.max(0, Math.min(11, (parseInt(parts[1], 10) || 1) - 1));
          day = parseInt(parts[2], 10) || 1;
        }
      }
    }

    return { day, month, year };
  }, [value]);

  const [selectedDay, setSelectedDay] = useState(parsed.day);
  const [currentMonth, setCurrentMonth] = useState(parsed.month);
  const [currentYear, setCurrentYear] = useState(parsed.year);

  const openModal = () => {
    setSelectedDay(parsed.day);
    setCurrentMonth(parsed.month);
    setCurrentYear(parsed.year);
    setYearPickerVisible(false);
    setModalVisible(true);
  };

  const getDaysInMonth = (m: number, y: number) => {
    return new Date(y, m + 1, 0).getDate();
  };

  const getFirstDayOfWeek = (m: number, y: number) => {
    return new Date(y, m, 1).getDay();
  };

  const daysInCurrentMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayOfWeek = getFirstDayOfWeek(currentMonth, currentYear);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleSelectDay = (d: number) => {
    setSelectedDay(d);
  };

  const handleConfirm = () => {
    const formattedDay = String(selectedDay).padStart(2, '0');
    const formattedMonth = String(currentMonth + 1).padStart(2, '0');
    const formattedDate = `${formattedDay}-${formattedMonth}-${currentYear}`;
    onChange(formattedDate);
    setModalVisible(false);
  };

  // Generate Year Range (from 1940 to current year)
  const years = useMemo(() => {
    const currentY = new Date().getFullYear();
    const list: number[] = [];
    for (let y = currentY; y >= 1940; y--) {
      list.push(y);
    }
    return list;
  }, []);

  // Format manual keyboard entry (auto dash DD-MM-YYYY)
  const handleTextChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    let formatted = cleaned;
    if (cleaned.length > 2 && cleaned.length <= 4) {
      formatted = `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
    } else if (cleaned.length > 4) {
      formatted = `${cleaned.slice(0, 2)}-${cleaned.slice(2, 4)}-${cleaned.slice(4, 8)}`;
    }
    onChange(formatted);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.requiredAsterisk}> *</Text>}
        </View>
      )}

      {/* Input Field with Calendar Trigger */}
      <View style={[styles.inputBox, error ? styles.inputError : null]}>
        <TextInput
          placeholder="DD-MM-YYYY"
          placeholderTextColor={Colors.textMuted}
          value={value}
          onChangeText={handleTextChange}
          keyboardType="number-pad"
          maxLength={10}
          style={styles.textInput}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={openModal}
          style={styles.calendarIconButton}
        >
          <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}

      {/* Date Picker Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.pickerCard}>
            {/* Modal Header */}
            <View style={styles.pickerHeader}>
              <Text style={styles.headerTitle}>Select Date of Birth</Text>
              <Text style={styles.selectedDateDisplay}>
                {String(selectedDay).padStart(2, '0')}-{String(currentMonth + 1).padStart(2, '0')}-{currentYear}
              </Text>
            </View>

            {/* Month & Year Navigation Row */}
            <View style={styles.navRow}>
              <TouchableOpacity onPress={prevMonth} style={styles.navArrowBtn}>
                <Ionicons name="chevron-back" size={20} color={Colors.textPrimary} />
              </TouchableOpacity>

              <View style={styles.navLabels}>
                <Text style={styles.monthLabel}>{MONTH_NAMES[currentMonth]}</Text>
                <TouchableOpacity
                  onPress={() => setYearPickerVisible(!yearPickerVisible)}
                  style={styles.yearButton}
                >
                  <Text style={styles.yearLabel}>{currentYear}</Text>
                  <Ionicons
                    name={yearPickerVisible ? 'chevron-up' : 'chevron-down'}
                    size={14}
                    color={Colors.primary}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={nextMonth} style={styles.navArrowBtn}>
                <Ionicons name="chevron-forward" size={20} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {yearPickerVisible ? (
              /* Quick Year Selection Scroll View */
              <View style={styles.yearListContainer}>
                <Text style={styles.yearSelectHeading}>Select Year</Text>
                <ScrollView style={styles.yearScrollView} showsVerticalScrollIndicator={false}>
                  <View style={styles.yearGrid}>
                    {years.map((y) => (
                      <TouchableOpacity
                        key={y}
                        onPress={() => {
                          setCurrentYear(y);
                          setYearPickerVisible(false);
                        }}
                        style={[
                          styles.yearGridItem,
                          y === currentYear && styles.yearGridItemSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.yearGridText,
                            y === currentYear && styles.yearGridTextSelected,
                          ]}
                        >
                          {y}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            ) : (
              /* Calendar Grid */
              <View style={styles.calendarSection}>
                {/* Day of Week Headers */}
                <View style={styles.weekDaysRow}>
                  {DAYS_OF_WEEK.map((d) => (
                    <Text key={d} style={styles.weekDayText}>
                      {d}
                    </Text>
                  ))}
                </View>

                {/* Days Grid */}
                <View style={styles.daysGrid}>
                  {/* Empty slots for first day offset */}
                  {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
                    <View key={`empty-${idx}`} style={styles.daySlot} />
                  ))}

                  {/* Day numbers */}
                  {Array.from({ length: daysInCurrentMonth }).map((_, idx) => {
                    const dayNum = idx + 1;
                    const isSelected = dayNum === selectedDay;

                    return (
                      <TouchableOpacity
                        key={dayNum}
                        activeOpacity={0.7}
                        onPress={() => handleSelectDay(dayNum)}
                        style={[
                          styles.daySlot,
                          isSelected && styles.daySlotSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.dayText,
                            isSelected && styles.dayTextSelected,
                          ]}
                        >
                          {dayNum}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Modal Actions */}
            <View style={styles.actionsRow}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.cancelBtn}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirm}
                style={styles.confirmBtn}
              >
                <Text style={styles.confirmBtnText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: Typography.sizes.sm,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  requiredAsterisk: {
    color: Colors.error,
    fontWeight: '700',
    fontSize: Typography.sizes.sm,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1.2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    height: 52,
  },
  inputError: {
    borderColor: Colors.error,
    backgroundColor: Colors.errorBg,
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontSize: Typography.sizes.base,
    color: Colors.textPrimary,
  },
  calendarIconButton: {
    padding: 6,
  },
  errorText: {
    marginTop: 4,
    fontSize: Typography.sizes.xs,
    color: Colors.error,
    fontWeight: '500',
  },
  helperText: {
    marginTop: 4,
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 27, 61, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  pickerCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.base,
    shadowColor: '#0F1B3D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  pickerHeader: {
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    paddingBottom: Spacing.sm,
  },
  headerTitle: {
    fontSize: Typography.sizes.xs,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  selectedDateDisplay: {
    fontSize: Typography.sizes.xl,
    fontWeight: '800',
    color: Colors.primary,
    marginTop: 2,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  navArrowBtn: {
    padding: 8,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceMuted,
  },
  navLabels: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  monthLabel: {
    fontSize: Typography.sizes.base,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  yearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.md,
    gap: 4,
  },
  yearLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
    color: Colors.primary,
  },
  calendarSection: {
    marginVertical: Spacing.xs,
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 6,
  },
  weekDayText: {
    width: 38,
    textAlign: 'center',
    fontSize: Typography.sizes.xs,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  daySlot: {
    width: '14.28%',
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
    marginVertical: 1,
  },
  daySlotSelected: {
    backgroundColor: Colors.primary,
  },
  dayText: {
    fontSize: Typography.sizes.sm,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  dayTextSelected: {
    color: Colors.textLight,
    fontWeight: '800',
  },
  yearListContainer: {
    height: 220,
    paddingVertical: Spacing.xs,
  },
  yearSelectHeading: {
    fontSize: Typography.sizes.xs,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 6,
    textAlign: 'center',
  },
  yearScrollView: {
    flex: 1,
  },
  yearGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  yearGridItem: {
    width: '30%',
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    marginBottom: 6,
    backgroundColor: Colors.surfaceMuted,
  },
  yearGridItemSelected: {
    backgroundColor: Colors.primary,
  },
  yearGridText: {
    fontSize: Typography.sizes.sm,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  yearGridTextSelected: {
    color: Colors.textLight,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: Spacing.sm,
  },
  cancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.md,
  },
  cancelBtnText: {
    fontSize: Typography.sizes.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  confirmBtn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
  },
  confirmBtnText: {
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
    color: Colors.textLight,
  },
});
