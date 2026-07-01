import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

interface CategoryFilterProps {
  categorias: string[];
  ativa: string;
  onSelect: (categoria: string) => void;
}

export function CategoryFilter({ categorias, ativa, onSelect }: CategoryFilterProps) {
  const listaLimpa = Array.from(new Set(categorias.includes('Todos') ? categorias : ['Todos', ...categorias]));

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent} style={styles.container}>
      {listaLimpa.map((cat) => (
        <TouchableOpacity
          key={cat}
          style={[styles.button, ativa === cat && styles.buttonActive]}
          onPress={() => onSelect(cat)}
          activeOpacity={0.7}
        >
          <Text style={[styles.text, ativa === cat && styles.textActive]}>{cat}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.md },
  scrollContent: { paddingHorizontal: SPACING.md, gap: SPACING.sm },
  button: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  buttonActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  text: { color: COLORS.textSecondary, fontWeight: '700', fontSize: 14 },
  textActive: { color: '#FFF' },
});