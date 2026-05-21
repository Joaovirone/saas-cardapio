import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/theme';
import { Produto } from '../types';

interface ProdutoCardProps {
  produto: Produto;
  onAdicionar: (id: string) => void;
}

export function ProdutoCard({ produto, onAdicionar }: ProdutoCardProps) {
  // O SEGREDO: Calcula a largura dinamicamente DENTRO do componente
  const { width } = useWindowDimensions();
  const CARD_WIDTH = (width - (SPACING.md * 2) - SPACING.md) / 2;

  return (
    <View style={[styles.card, { width: CARD_WIDTH }]}>
      {/* Imagem Placeholder - Caso a API falhe, não quebra o layout */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: produto.imageUrl || 'https://via.placeholder.com/300' }} 
          style={styles.image} 
          resizeMode="cover"
        />
      </View>
      
      <View style={styles.content}>
        <View>
          <Text style={styles.title} numberOfLines={1}>{produto.nome}</Text>
          <Text style={styles.description} numberOfLines={2}>{produto.descricao}</Text>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.price}>R$ {produto.preco.toFixed(2).replace('.', ',')}</Text>
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={() => onAdicionar(produto.id)}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    // A largura foi removida daqui e passada dinamicamente no inline style acima
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
  imageContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#2A2A2A',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: SPACING.sm,
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  price: {
    color: COLORS.primary,
    fontWeight: '900',
    fontSize: 15,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    padding: 6,
    borderRadius: 8,
  },
});