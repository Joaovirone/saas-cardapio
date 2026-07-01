import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

interface HeaderProps {
  titulo: string;
  quantidadeCarrinho: number;
  onCarrinhoPress: () => void;
}

export function Header({ titulo, quantidadeCarrinho, onCarrinhoPress }: HeaderProps) {
  const [primeiroNome, segundoNome] = titulo.split(' ');

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.subtitle}>Bem-vindo ao</Text>
        <Text style={styles.title}>
          {primeiroNome} <Text style={styles.titleOrange}>{segundoNome}</Text>
        </Text>
      </View>

      <TouchableOpacity style={styles.cartButton} onPress={onCarrinhoPress} activeOpacity={0.7}>
        <Ionicons name="cart-outline" size={22} color={COLORS.primary} />
        {quantidadeCarrinho > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{quantidadeCarrinho}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    letterSpacing: 1.5,
    marginBottom: 2,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  title: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '900',
  },
  titleOrange: {
    color: COLORS.primary,
  },
  cartButton: {
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: BORDER_RADIUS.lg,
    position: 'relative',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: COLORS.primary,
    borderRadius: 999,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
});