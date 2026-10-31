import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BorderRadius, Colors } from '../../theme';
import { SkillLevel } from '../../types/domain';

export interface BadgeProps {
  label: string;
  variant?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'success' | 'warning' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  showTierIcon?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'info',
  size = 'md',
  icon,
  showTierIcon = false,
  style,
  textStyle,
}) => {
  const getBadgeColors = () => {
    switch (variant) {
      case 'bronze':
        return {
          bg: Colors.bronzeBg,
          border: Colors.bronzeBorder,
          text: Colors.bronze,
        };
      case 'silver':
        return {
          bg: Colors.silverBg,
          border: Colors.silverBorder,
          text: Colors.silver,
        };
      case 'gold':
        return {
          bg: Colors.goldBg,
          border: Colors.goldBorder,
          text: Colors.gold,
        };
      case 'platinum':
        return {
          bg: Colors.platinumBg,
          border: Colors.platinumBorder,
          text: Colors.platinum,
        };
      case 'success':
        return {
          bg: Colors.successBg,
          border: Colors.successBorder,
          text: Colors.success,
        };
      case 'warning':
        return {
          bg: Colors.warningBg,
          border: Colors.border,
          text: Colors.warning,
        };
      case 'neutral':
        return {
          bg: Colors.surfaceMuted,
          border: Colors.border,
          text: Colors.textSecondary,
        };
      case 'info':
      default:
        return {
          bg: Colors.primaryLight,
          border: '#BFDBFE',
          text: Colors.primary,
        };
    }
  };

  const colors = getBadgeColors();

  const getPadding = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return { paddingHorizontal: 6, paddingVertical: 2 };
      case 'lg':
        return { paddingHorizontal: 12, paddingVertical: 6 };
      case 'md':
      default:
        return { paddingHorizontal: 9, paddingVertical: 4 };
    }
  };

  const getFontSize = (): TextStyle => {
    switch (size) {
      case 'sm':
        return { fontSize: 10 };
      case 'lg':
        return { fontSize: 14 };
      case 'md':
      default:
        return { fontSize: 12 };
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
        },
        getPadding(),
        style,
      ]}
    >
      {showTierIcon && (
        <Ionicons
          name="shield"
          size={size === 'sm' ? 10 : 13}
          color={colors.text}
          style={styles.tierIcon}
        />
      )}
      {icon && <View style={styles.iconMargin}>{icon}</View>}
      <Text
        style={[
          styles.text,
          { color: colors.text },
          getFontSize(),
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

export const TierBadge: React.FC<{ level?: SkillLevel | string; size?: 'sm' | 'md' | 'lg'; style?: ViewStyle }> = ({
  level = 'BRONZE',
  size = 'md',
  style,
}) => {
  const norm = level.toUpperCase() as SkillLevel;
  let variant: BadgeProps['variant'] = 'bronze';
  if (norm === 'SILVER') variant = 'silver';
  if (norm === 'GOLD') variant = 'gold';
  if (norm === 'PLATINUM') variant = 'platinum';

  return (
    <Badge
      label={norm}
      variant={variant}
      size={size}
      showTierIcon
      style={style}
    />
  );
};

export const PriorityBadge: React.FC<{ priority: number; style?: ViewStyle }> = ({ priority, style }) => {
  return (
    <View style={[styles.priorityCircle, style]}>
      <Text style={styles.priorityText}>{priority}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  tierIcon: {
    marginRight: 4,
  },
  iconMargin: {
    marginRight: 4,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  priorityCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityText: {
    color: Colors.textLight,
    fontSize: 12,
    fontWeight: '700',
  },
});
