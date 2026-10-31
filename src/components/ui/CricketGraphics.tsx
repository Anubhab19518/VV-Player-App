import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BorderRadius, Colors } from '../../theme';

export const VelocityLogo: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  style?: ViewStyle;
}> = ({ size = 'md', showSubtitle = true, style }) => {
  const iconSize = size === 'sm' ? 24 : size === 'lg' ? 44 : 32;
  const titleSize = size === 'sm' ? 14 : size === 'lg' ? 22 : 18;

  return (
    <View style={[styles.logoContainer, style]}>
      <View style={styles.iconBox}>
        {/* Stylized 'V' icon */}
        <View style={styles.vWings}>
          <MaterialCommunityIcons name="lightning-bolt" size={iconSize} color={Colors.primary} />
        </View>
      </View>
      <Text style={[styles.logoTitle, { fontSize: titleSize }]}>VELOCITY</Text>
      <Text style={[styles.logoSubtitle, { fontSize: titleSize * 0.75 }]}>VENTURES</Text>
      {showSubtitle && (
        <Text style={styles.logoTagline}>PLAY • COMPETE • GROW</Text>
      )}
    </View>
  );
};

export const CricketSilhouettes: React.FC<{ style?: ViewStyle }> = ({ style }) => {
  return (
    <View style={[styles.silhouetteContainer, style]}>
      <View style={styles.silhouetteRow}>
        <MaterialCommunityIcons name="cricket" size={32} color="#BFDBFE" />
        <MaterialCommunityIcons name="run-fast" size={36} color="#93C5FD" style={styles.silhouetteItem} />
        <MaterialCommunityIcons name="human" size={42} color="#60A5FA" style={styles.silhouetteItem} />
        <MaterialCommunityIcons name="shield-airplane" size={30} color="#BFDBFE" style={styles.silhouetteItem} />
      </View>
      <View style={styles.skylineBar} />
    </View>
  );
};

export const CricketEquipmentBadge: React.FC<{ style?: ViewStyle }> = ({ style }) => {
  return (
    <View style={[styles.equipmentCard, style]}>
      <View style={styles.turf}>
        <View style={styles.wicketsRow}>
          <View style={styles.stump} />
          <View style={styles.stump} />
          <View style={styles.stump} />
        </View>
        <MaterialCommunityIcons
          name="cricket"
          size={54}
          color="#D97706"
          style={styles.batIcon}
        />
        <View style={styles.ballGraphic}>
          <View style={styles.ballSeam} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBox: {
    marginBottom: 6,
  },
  vWings: {
    backgroundColor: Colors.primaryLight,
    padding: 8,
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
  },
  logoTitle: {
    fontWeight: '900',
    letterSpacing: 2,
    color: Colors.textPrimary,
  },
  logoSubtitle: {
    fontWeight: '800',
    letterSpacing: 1.5,
    color: Colors.primary,
    marginTop: -2,
  },
  logoTagline: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.8,
    color: Colors.textSecondary,
    marginTop: 6,
  },
  silhouetteContainer: {
    alignItems: 'center',
    width: '100%',
    opacity: 0.7,
  },
  silhouetteRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  silhouetteItem: {
    marginHorizontal: 12,
  },
  skylineBar: {
    width: '90%',
    height: 2,
    backgroundColor: '#DBEAFE',
    marginTop: 4,
    borderRadius: 1,
  },
  equipmentCard: {
    width: 130,
    height: 120,
    borderRadius: BorderRadius['2xl'],
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    position: 'relative',
    overflow: 'hidden',
  },
  turf: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wicketsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    position: 'absolute',
    bottom: 24,
  },
  stump: {
    width: 4,
    height: 38,
    backgroundColor: '#92400E',
    marginHorizontal: 3,
    borderRadius: 2,
  },
  batIcon: {
    transform: [{ rotate: '32deg' }],
    position: 'absolute',
    right: 18,
    bottom: 14,
  },
  ballGraphic: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#DC2626',
    position: 'absolute',
    bottom: 20,
    left: 24,
    borderWidth: 1,
    borderColor: '#B91C1C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ballSeam: {
    width: 20,
    height: 1.5,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
  },
});
