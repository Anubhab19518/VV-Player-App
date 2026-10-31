import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../../theme';

export interface InputProps extends TextInputProps {
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  prefix?: string;
  containerStyle?: ViewStyle;
  inputContainerStyle?: ViewStyle;
  inputStyle?: TextStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  required,
  error,
  helperText,
  leftIcon,
  rightIcon,
  prefix,
  containerStyle,
  inputContainerStyle,
  inputStyle,
  ...rest
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.requiredAsterisk}> *</Text>}
        </View>
      )}

      <View
        style={[
          styles.inputContainer,
          error ? styles.inputError : null,
          inputContainerStyle,
        ]}
      >
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}

        {prefix && (
          <View style={styles.prefixContainer}>
            <Text style={styles.prefixText}>{prefix}</Text>
          </View>
        )}

        <TextInput
          placeholderTextColor={Colors.textMuted}
          style={[styles.input, inputStyle]}
          {...rest}
        />

        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
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
  inputContainer: {
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
  input: {
    flex: 1,
    height: '100%',
    fontSize: Typography.sizes.base,
    color: Colors.textPrimary,
  },
  iconLeft: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconRight: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prefixContainer: {
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  prefixText: {
    fontSize: Typography.sizes.base,
    fontWeight: '500',
    color: Colors.textSecondary,
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
});
