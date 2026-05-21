import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Produto } from '../types';
import { formatarMoeda } from '../utils/formatting';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';

interface ProdutoCardProps {
  produto: Produto;
  onAdicionarAoCarrinho: (produto: Produto) => void;
}

export const ProdutoCard: React.FC<ProdutoCardProps> = ({
  produto,
  onAdicionarAoCarrinho,
}) => {
  const isIndisponivel = !produto.disponivel || !produto.ativo;

  return (
    <View style={[styles.container, isIndisponivel && styles.containerIndisponivel]}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: produto.imageUrl }}
          style={styles.image}
          defaultSource={{ uri: 'https://via.placeholder.com/300x200?text=Sem+Imagem' }}
        />
        {isIndisponivel && (
          <View style={styles.indisponivelOverlay}>
            <Text style={styles.indisponivelText}>Indisponível</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.titulo} numberOfLines={2}>
          {produto.nome}
        </Text>
        <Text style={styles.descricao} numberOfLines={2}>
          {produto.descricao}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.preco}>{formatarMoeda(produto.preco)}</Text>
          <TouchableOpacity
            style={[styles.btnAdicionar, isIndisponivel && styles.btnAdicionarDisabled]}
            onPress={() => onAdicionarAoCarrinho(produto)}
            disabled={isIndisponivel}
            activeOpacity={0.7}
          >
            <Ionicons
              name="add-circle"
              size={24}
              color={isIndisponivel ? COLORS.disabled : COLORS.primary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginHorizontal: SPACING.sm,
    marginVertical: SPACING.sm,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  containerIndisponivel: {
    opacity: 0.6,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 160,
    backgroundColor: COLORS.background,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  indisponivelOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indisponivelText: {
    color: '#FFF',
    fontSize: TYPOGRAPHY.sm,
    fontWeight: '700',
  },
  content: {
    padding: SPACING.md,
    flex: 1,
    justifyContent: 'space-between',
  },
  titulo: {
    fontSize: TYPOGRAPHY.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  descricao: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  preco: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: '700',
    color: COLORS.primary,
  },
  btnAdicionar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 29, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnAdicionarDisabled: {
    opacity: 0.5,
  },
});
