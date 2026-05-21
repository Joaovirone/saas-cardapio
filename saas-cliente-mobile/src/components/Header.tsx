import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';

interface HeaderProps {
  titulo: string;
  quantidadeCarrinho?: number;
  onCarrinhoPress?: () => void;
  onBackPress?: () => void;
  showBack?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  titulo,
  quantidadeCarrinho = 0,
  onCarrinhoPress,
  onBackPress,
  showBack = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        {showBack && (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color={COLORS.text} />
          </TouchableOpacity>
        )}
        <Text style={styles.titulo}>{titulo}</Text>
      </View>

      {onCarrinhoPress && (
        <TouchableOpacity
          onPress={onCarrinhoPress}
          style={styles.carrinhoButton}
          activeOpacity={0.7}
        >
          <Ionicons name="bag" size={24} color={COLORS.primary} />
          {quantidadeCarrinho > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {quantidadeCarrinho > 9 ? '9+' : quantidadeCarrinho}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: SPACING.sm,
  },
  titulo: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  carrinhoButton: {
    position: 'relative',
    padding: SPACING.sm,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: COLORS.surface,
    fontSize: TYPOGRAPHY.xs,
    fontWeight: '700',
  },
});
