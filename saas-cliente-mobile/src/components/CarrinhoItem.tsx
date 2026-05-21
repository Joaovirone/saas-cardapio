import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ItemCarrinho } from '../types';
import { formatarMoeda } from '../utils/formatting';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';

interface CarrinhoItemProps {
  item: ItemCarrinho;
  onRemover: (produtoId: string) => void;
  onAtualizarQuantidade: (produtoId: string, quantidade: number) => void;
}

export const CarrinhoItem: React.FC<CarrinhoItemProps> = ({
  item,
  onRemover,
  onAtualizarQuantidade,
}) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: item.produto.imageUrl }}
        style={styles.image}
      />

      <View style={styles.content}>
        <Text style={styles.titulo}>{item.produto.nome}</Text>
        {item.observacoes && (
          <Text style={styles.observacoes}>Obs: {item.observacoes}</Text>
        )}
        <Text style={styles.preco}>{formatarMoeda(item.subtotal)}</Text>
      </View>

      <View style={styles.quantidadeContainer}>
        <TouchableOpacity
          onPress={() => onAtualizarQuantidade(item.id, item.quantidade - 1)}
          style={styles.botaoQuantidade}
        >
          <Ionicons name="remove" size={18} color={COLORS.primary} />
        </TouchableOpacity>

        <Text style={styles.quantidade}>{item.quantidade}</Text>

        <TouchableOpacity
          onPress={() => onAtualizarQuantidade(item.id, item.quantidade + 1)}
          style={styles.botaoQuantidade}
        >
          <Ionicons name="add" size={18} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => onRemover(item.id)}
        style={styles.btnRemover}
      >
        <Ionicons name="trash" size={20} color={COLORS.error} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: SPACING.md,
  },
  content: {
    flex: 1,
  },
  titulo: {
    fontSize: TYPOGRAPHY.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  observacoes: {
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    fontStyle: 'italic',
  },
  preco: {
    fontSize: TYPOGRAPHY.md,
    fontWeight: '700',
    color: COLORS.primary,
  },
  quantidadeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.sm,
    backgroundColor: COLORS.background,
    borderRadius: 6,
    overflow: 'hidden',
  },
  botaoQuantidade: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantidade: {
    width: 32,
    textAlign: 'center',
    fontSize: TYPOGRAPHY.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  btnRemover: {
    padding: SPACING.sm,
  },
});
