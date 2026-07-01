import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { Produto } from '../types';

interface ProdutoDetalheModalProps {
  produto: Produto | null;
  visivel: boolean;
  onFechar: () => void;
  onAdicionarAoCarrinho: (produto: Produto, quantidade: number, observacoes: string) => void;
}

export function ProdutoDetalheModal({ produto, visivel, onFechar, onAdicionarAoCarrinho }: ProdutoDetalheModalProps) {
  const [quantidade, setQuantidade] = useState(1);
  const [extrasSelecionados, setExtrasSelecionados] = useState<string[]>([]);

  // ==================== O SEGREDO: EXTRAS DINÂMICOS ====================
  // Uma função que lê a categoria do produto e retorna a lista certa de ingredientes
  const obterExtrasDoProduto = () => {
    if (!produto || !produto.categoria) return [];
    
    const categoria = produto.categoria.toLowerCase();

    if (categoria.includes('lanche') || categoria.includes('combo') || categoria.includes('burger')) {
      return [
        { id: 'ext1', nome: 'Bacon Artesanal', preco: 4.50 },
        { id: 'ext2', nome: 'Cheddar Cremoso', preco: 3.50 },
        { id: 'ext3', nome: 'Hambúrguer Extra', preco: 9.90 },
        { id: 'ext4', nome: 'Cebola Caramelizada', preco: 2.50 },
      ];
    }
    
    if (categoria.includes('bebida')) {
      return [
        { id: 'beb1', nome: 'Gelo e Limão', preco: 0.00 },
      ];
    }

    if (categoria.includes('sobremesa')) {
      return [
        { id: 'sob1', nome: 'Calda de Chocolate Extra', preco: 2.00 },
      ];
    }

    // Se for qualquer outra categoria que não tem extra, retorna vazio
    return [];
  };

  const ingredientesDesteProduto = obterExtrasDoProduto();
  // =====================================================================

  // Reseta os estados toda vez que abrir um lanche novo
  useEffect(() => {
    if (visivel) {
      setQuantidade(1);
      setExtrasSelecionados([]);
    }
  }, [visivel, produto]);

  if (!produto) return null;

  const toggleExtra = (id: string) => {
    setExtrasSelecionados(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  // Calcula: (Preço Base + Soma dos Extras) * Quantidade
  const valorExtras = ingredientesDesteProduto
    .filter(ext => extrasSelecionados.includes(ext.id))
    .reduce((sum, ext) => sum + ext.preco, 0);
    
  const precoTotal = (produto.preco + valorExtras) * quantidade;

  const handleConfirmar = () => {
    const nomesExtras = ingredientesDesteProduto
      .filter(ext => extrasSelecionados.includes(ext.id))
      .map(ext => ext.nome)
      .join(', ');
      
    const obsCozinha = nomesExtras.length > 0 ? `Adicionais: ${nomesExtras}` : '';

    const produtoPersonalizado = {
      ...produto,
      preco: produto.preco + valorExtras,
      nome: extrasSelecionados.length > 0 ? `${produto.nome} (Personalizado)` : produto.nome
    };

    onAdicionarAoCarrinho(produtoPersonalizado, quantidade, obsCozinha);
    onFechar();
  };

  return (
    <Modal visible={visivel} animationType="slide" transparent={true} onRequestClose={onFechar}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <TouchableOpacity style={styles.closeBtn} onPress={onFechar}>
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Image source={{ uri: produto.imageUrl }} style={styles.image} />
            
            <View style={styles.content}>
              <Text style={styles.title}>{produto.nome}</Text>
              <Text style={styles.desc}>{produto.descricao}</Text>

              {/* RENDERIZAÇÃO CONDICIONAL: Só mostra a seção se tiver ingredientes na lista */}
              {ingredientesDesteProduto.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>Turbine seu pedido</Text>
                  
                  {ingredientesDesteProduto.map(extra => {
                    const isSelected = extrasSelecionados.includes(extra.id);
                    return (
                      <TouchableOpacity 
                        key={extra.id} 
                        style={[styles.extraRow, isSelected && styles.extraRowSelected]}
                        onPress={() => toggleExtra(extra.id)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.extraInfo}>
                          <Ionicons 
                            name={isSelected ? "checkbox" : "square-outline"} 
                            size={22} 
                            color={isSelected ? COLORS.primary : COLORS.textSecondary} 
                          />
                          <Text style={styles.extraName}>{extra.nome}</Text>
                        </View>
                        <Text style={styles.extraPrice}>
                          {extra.preco > 0 ? `+ R$ ${extra.preco.toFixed(2).replace('.', ',')}` : 'Grátis'}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </>
              )}
            </View>
          </ScrollView>

          {/* Rodapé Fixo */}
          <View style={styles.footer}>
            <View style={styles.qtdContainer}>
              <TouchableOpacity onPress={() => setQuantidade(Math.max(1, quantidade - 1))} style={styles.qtdBtn}>
                <Ionicons name="remove" size={20} color={COLORS.primary} />
              </TouchableOpacity>
              <Text style={styles.qtdText}>{quantidade}</Text>
              <TouchableOpacity onPress={() => setQuantidade(quantidade + 1)} style={styles.qtdBtn}>
                <Ionicons name="add" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.addBtn} onPress={handleConfirmar}>
              <Text style={styles.addBtnText}>Adicionar</Text>
              <Text style={styles.addBtnPrice}>R$ {precoTotal.toFixed(2).replace('.', ',')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(17, 24, 39, 0.55)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: COLORS.surface, height: '90%', borderTopLeftRadius: BORDER_RADIUS.xl, borderTopRightRadius: BORDER_RADIUS.xl, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.md },
  closeBtn: { position: 'absolute', top: 16, right: 16, zIndex: 10, backgroundColor: COLORS.surface, padding: 8, borderRadius: 999, borderWidth: 1, borderColor: COLORS.border },
  image: { width: '100%', height: 250, backgroundColor: COLORS.surfaceAlt },
  content: { padding: SPACING.md, paddingBottom: 100 },
  title: { color: COLORS.text, fontSize: 24, fontWeight: '900', marginBottom: 8 },
  desc: { color: COLORS.textSecondary, fontSize: 14, lineHeight: 20, marginBottom: 24 },
  sectionTitle: { color: COLORS.text, fontSize: 18, fontWeight: '700', marginBottom: 12 },
  extraRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.surfaceAlt, padding: 16, borderRadius: BORDER_RADIUS.lg, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border },
  extraRowSelected: { borderColor: COLORS.primary, backgroundColor: '#fff7ed' },
  extraInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  extraName: { color: COLORS.text, fontSize: 15 },
  extraPrice: { color: COLORS.primary, fontWeight: '700' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: COLORS.surface, padding: SPACING.md, flexDirection: 'row', gap: SPACING.md, borderTopWidth: 1, borderColor: COLORS.border },
  qtdContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surfaceAlt, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: COLORS.border },
  qtdBtn: { padding: 12 },
  qtdText: { color: COLORS.text, fontSize: 16, fontWeight: '700', minWidth: 20, textAlign: 'center' },
  addBtn: { flex: 1, backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 },
  addBtnText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  addBtnPrice: { color: '#FFF', fontWeight: '900', fontSize: 16 },
});