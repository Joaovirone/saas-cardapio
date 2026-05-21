import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/theme';
import { ItemCarrinho } from '../types';

interface CarrinhoModalProps {
  visivel: boolean;
  itens: ItemCarrinho[];
  total: number;
  onFechar: () => void;
  onRemoverItem: (produtoId: string) => void;
  onAtualizarQuantidade: (produtoId: string, quantidade: number) => void;
  onConfirmarPedido: (observacoes: string) => void;
  carregando: boolean;
}

export function CarrinhoModal({
  visivel,
  itens,
  total,
  onFechar,
  onRemoverItem,
  onAtualizarQuantidade,
  onConfirmarPedido,
  carregando
}: CarrinhoModalProps) {
  const [obsGerais, setObsGerais] = useState('');

  // Componente interno para renderizar cada linha de item do carrinho
  const renderItem = ({ item }: { item: ItemCarrinho }) => (
    <View style={styles.itemRow}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemNome}>{item.produto.nome}</Text>
        <Text style={styles.itemSubtotal}>
          R$ {(item.produto.preco * item.quantidade).toFixed(2).replace('.', ',')}
        </Text>
      </View>

      {/* Controles de quantidade compactos e táteis */}
      <View style={styles.quantityContainer}>
        <TouchableOpacity 
          style={styles.qtyButton} 
          onPress={() => onAtualizarQuantidade(item.produto.id, item.quantidade - 1)}
        >
          <Ionicons name="remove" size={16} color={COLORS.primary} />
        </TouchableOpacity>
        
        <Text style={styles.qtyText}>{item.quantidade}</Text>
        
        <TouchableOpacity 
          style={styles.qtyButton} 
          onPress={() => onAtualizarQuantidade(item.produto.id, item.quantidade + 1)}
        >
          <Ionicons name="add" size={16} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visivel}
      animationType="slide" // Faz deslizar de baixo para cima nativamente
      transparent={true}
      onRequestClose={onFechar}
    >
      {/* KeyboardAvoidingView evita que o teclado do celular cubra o campo de observações */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.overlay}
      >
        {/* Fundo escuro semitransparente ao redor do modal */}
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onFechar} />

        {/* O painel do Bottom Sheet */}
        <View style={styles.sheetContainer}>
          
          {/* Barra superior com título e botão fechar */}
          <View style={styles.sheetHeader}>
            <View style={styles.dragIndicator} />
            <View style={styles.headerTitleRow}>
              <Text style={styles.sheetTitle}>Meu Carrinho</Text>
              <TouchableOpacity onPress={onFechar} style={styles.closeButton}>
                <Ionicons name="close" size={22} color={COLORS.text} />
              </TouchableOpacity>
            </View>
          </View>

          {itens.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="basket-outline" size={64} color={COLORS.textSecondary} />
              <Text style={styles.emptyText}>Seu carrinho está vazio</Text>
              <Text style={styles.emptySubtext}>Adicione lanches para iniciar</Text>
            </View>
          ) : (
            <View style={styles.content}>
              {/* Lista rolável de itens selecionados */}
              <FlatList
                data={itens}
                keyExtractor={(item) => item.produto.id}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                style={styles.itemsList}
              />

              {/* Seção de observações operacionais para a cozinha */}
              <View style={styles.obsContainer}>
                <Text style={styles.obsLabel}>Alguma observação geral?</Text>
                <TextInput
                  style={styles.obsInput}
                  placeholder="Ex: Tirar cebola, ponto da carne, maionese extra..."
                  placeholderTextColor={COLORS.textSecondary}
                  value={obsGerais}
                  onChangeText={setObsGerais}
                  multiline
                  maxLength={150}
                />
              </View>

              {/* Resumo financeiro e botão de ação atômico */}
              <View style={styles.footer}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total do pedido</Text>
                  <Text style={styles.totalValue}>R$ {total.toFixed(2).replace('.', ',')}</Text>
                </View>

                <TouchableOpacity 
                  style={styles.confirmButton}
                  onPress={() => onConfirmarPedido(obsGerais)}
                  disabled={carregando}
                  activeOpacity={0.8}
                >
                  <Text style={styles.confirmButtonText}>
                    {carregando ? 'Enviando para a cozinha...' : 'Confirmar e Enviar'}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>
          )}

        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end', // Garante que o painel cole no rodapé
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.75)', // Efeito sombreado atrás da gaveta
  },
  sheetContainer: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%', // Limita a altura para o cliente ainda ver o fundo do app
    borderWidth: 1,
    borderColor: '#333',
  },
  sheetHeader: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderColor: '#222',
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    marginBottom: SPACING.sm,
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: SPACING.md,
  },
  sheetTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: COLORS.surface,
    padding: 6,
    borderRadius: 20,
  },
  content: {
    paddingHorizontal: SPACING.md,
  },
  itemsList: {
    maxHeight: 220, // Previne que a lista empurre o rodapé para fora da tela
    marginTop: SPACING.sm,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: 14,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  itemInfo: {
    flex: 1,
    paddingRight: SPACING.sm,
  },
  itemNome: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 15,
  },
  itemSubtotal: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 4,
    borderWidth: 1,
    borderColor: '#333',
  },
  qtyButton: {
    padding: 6,
  },
  qtyText: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 14,
    minWidth: 24,
    textAlign: 'center',
  },
  obsContainer: {
    marginTop: SPACING.md,
  },
  obsLabel: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: SPACING.sm,
  },
  obsInput: {
    backgroundColor: COLORS.surface,
    color: COLORS.text,
    borderRadius: 12,
    padding: SPACING.md,
    fontSize: 14,
    height: 70,
    textAlignVertical: 'top', // Garante que no Android o texto comece no topo esquerdo
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  footer: {
    marginTop: SPACING.lg,
    paddingBottom: Platform.OS === 'ios' ? 30 : SPACING.lg, // Safe area padding para iPhones modernos
    borderTopWidth: 1,
    borderColor: '#222',
    paddingTop: SPACING.md,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  totalLabel: {
    color: COLORS.textSecondary,
    fontSize: 15,
  },
  totalValue: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '900',
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: SPACING.xs,
  },
  confirmButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: SPACING.md,
  },
  emptySubtext: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: SPACING.xs,
  },
});