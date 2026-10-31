import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme';

export interface AvatarProps {
  name?: string;
  imageUrl?: string | null;
  size?: number;
  showCameraBadge?: boolean;
  onCameraPress?: () => void;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  name = 'Player',
  imageUrl,
  size = 64,
  showCameraBadge = false,
  onCameraPress,
  style,
}) => {
  const getInitials = (text: string): string => {
    const parts = text.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return 'P';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const badgeSize = Math.max(22, Math.round(size * 0.32));
  const fontSize = Math.max(14, Math.round(size * 0.38));

  return (
    <View style={[styles.wrapper, { width: size, height: size }, style]}>
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
        />
      ) : (
        <View
          style={[
            styles.placeholder,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: '#DBEAFE',
            },
          ]}
        >
          <Text style={[styles.initials, { fontSize, color: Colors.primary }]}>
            {getInitials(name)}
          </Text>
        </View>
      )}

      {showCameraBadge && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onCameraPress}
          style={[
            styles.cameraBadge,
            {
              width: badgeSize,
              height: badgeSize,
              borderRadius: badgeSize / 2,
              bottom: 0,
              right: 0,
            },
          ]}
        >
          <Ionicons name="camera" size={Math.round(badgeSize * 0.55)} color={Colors.textLight} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    alignSelf: 'center',
  },
  image: {
    resizeMode: 'cover',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontWeight: '700',
  },
  cameraBadge: {
    position: 'absolute',
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.surface,
  },
});
