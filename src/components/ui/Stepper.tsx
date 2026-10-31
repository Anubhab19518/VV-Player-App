import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography } from '../../theme';

export interface StepperProps {
  currentStep: number;
  totalSteps?: number;
  stepTitle?: string;
  stepSubtitle?: string;
  style?: ViewStyle;
}

export const Stepper: React.FC<StepperProps> = ({
  currentStep,
  totalSteps = 2,
  stepTitle,
  stepSubtitle,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {stepTitle && <Text style={styles.title}>{stepTitle}</Text>}
      {stepSubtitle && <Text style={styles.subtitle}>{stepSubtitle}</Text>}

      <View style={styles.stepsRow}>
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNum = i + 1;
          const isCompleted = stepNum < currentStep;
          const isActive = stepNum === currentStep;

          return (
            <React.Fragment key={stepNum}>
              <View
                style={[
                  styles.circle,
                  isCompleted && styles.circleCompleted,
                  isActive && styles.circleActive,
                  !isCompleted && !isActive && styles.circleInactive,
                ]}
              >
                {isCompleted ? (
                  <Ionicons name="checkmark" size={14} color={Colors.textLight} />
                ) : (
                  <Text
                    style={[
                      styles.circleText,
                      isActive && styles.circleTextActive,
                      !isActive && styles.circleTextInactive,
                    ]}
                  >
                    {stepNum}
                  </Text>
                )}
              </View>

              {stepNum < totalSteps && (
                <View
                  style={[
                    styles.connectorLine,
                    isCompleted ? styles.connectorCompleted : styles.connectorInactive,
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.base,
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleActive: {
    backgroundColor: Colors.primary,
  },
  circleCompleted: {
    backgroundColor: Colors.primaryDark,
  },
  circleInactive: {
    backgroundColor: Colors.surfaceMuted,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  circleText: {
    fontSize: 13,
    fontWeight: '700',
  },
  circleTextActive: {
    color: Colors.textLight,
  },
  circleTextInactive: {
    color: Colors.textMuted,
  },
  connectorLine: {
    width: 48,
    height: 2,
    marginHorizontal: 8,
  },
  connectorCompleted: {
    backgroundColor: Colors.primary,
  },
  connectorInactive: {
    backgroundColor: Colors.border,
  },
});
