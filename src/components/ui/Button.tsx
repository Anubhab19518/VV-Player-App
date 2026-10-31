import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../../theme';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  ...rest
}) => {
  const getContainerStyle = (): ViewStyle => {
    const base: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: BorderRadius.lg,
    };

    switch (size) {
      case 'sm':
        base.paddingVertical = Spacing.sm;
        base.paddingHorizontal = Spacing.md;
        break;
      case 'lg':
        base.paddingVertical = 16;
        base.paddingHorizontal = Spacing.xl;
        break;
      case 'md':
      default:
        base.paddingVertical = 14;
        base.paddingHorizontal = Spacing.lg;
        break;
    }

    switch (variant) {
      case 'primary':
        base.backgroundColor = disabled ? Colors.borderDark : Colors.primary;
        break;
      case 'secondary':
        base.backgroundColor = Colors.primaryLight;
        break;
      case 'outline':
        base.backgroundColor = Colors.surface;
        base.borderWidth = 1.5;
        base.borderColor = disabled ? Colors.border : Colors.border;
        break;
      case 'ghost':
        base.backgroundColor = 'transparent';
        break;
      case 'danger':
        base.backgroundColor = disabled ? Colors.borderDark : Colors.error;
        break;
    }

    if (disabled) {
      base.opacity = 0.6;
    }

    return base;
  };

  const getTextStyle = (): TextStyle => {
    const base: TextStyle = {
      fontWeight: '600',
    };

    switch (size) {
      case 'sm':
        base.fontSize = Typography.sizes.sm;
        break;
      case 'lg':
        base.fontSize = Typography.sizes.lg;
        break;
      case 'md':
      default:
        base.fontSize = Typography.sizes.base;
        break;
    }

    switch (variant) {
      case 'primary':
      case 'danger':
        base.color = Colors.textLight;
        break;
      case 'secondary':
        base.color = Colors.primary;
        break;
      case 'outline':
        base.color = Colors.textPrimary;
        break;
      case 'ghost':
        base.color = Colors.primary;
        break;
    }

    return base;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      style={[getContainerStyle(), style]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? Colors.textLight : Colors.primary}
        />
      ) : (
        <>
          {icon && iconPosition === 'left' ? <>{icon}</> : null}
          <Text style={[getTextStyle(), icon && iconPosition === 'left' ? styles.iconLeftMargin : null, icon && iconPosition === 'right' ? styles.iconRightMargin : null, textStyle]}>
            {title}
          </Text>
          {icon && iconPosition === 'right' ? <>{icon}</> : null}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconLeftMargin: {
    marginLeft: 8,
  },
  iconRightMargin: {
    marginRight: 8,
  },
});
