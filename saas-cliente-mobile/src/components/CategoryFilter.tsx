import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';

interface CategoryFilterProps {
  categorias: string[];
  ativa: string;
  onSelect: (categoria: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categorias,
  ativa,
  onSelect,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categorias.map(categoria => (
        <TouchableOpacity
          key={categoria}
          style={[
            styles.badge,
            ativa === categoria && styles.badgeActive,
          ]}
          onPress={() => onSelect(categoria)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.text,
              ativa === categoria && styles.textActive,
            ]}
          >
            {categoria}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  badge: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  badgeActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  text: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  textActive: {
    color: COLORS.surface,
  },
});
