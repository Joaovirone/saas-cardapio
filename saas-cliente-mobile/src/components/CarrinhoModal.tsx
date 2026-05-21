import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView
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
  onConfirmarPedido: (dadosPedido: string) => void; // Vamos mandar tudo como texto provisoriamente
  carregando: boolean;
}

export function CarrinhoModal({
  visivel, itens, total, onFechar, onRemoverItem, onAtualizarQuantidade, onConfirmarPedido, carregando
}: CarrinhoModalProps) {
  
  // ==================== ESTADOS DO MODAL ====================
  const [etapa, setEtapa] = useState<'carrinho' | 'checkout'>('carrinho');
  const [obsGerais, setObsGerais] = useState('');
  
  // ==================== ESTADOS DO CHECKOUT ====================
  const [tipoEntrega, setTipoEntrega] = useState<'entrega' | 'retirada'>('entrega');
  const [formaPagamento, setFormaPagamento] = useState('pix');
  const [troco, setTroco] = useState('');

  // Regra de Negócio: Se for entrega, cobra R$ 5,00. Se for retirada, R$ 0,00.
  const taxaEntrega = tipoEntrega === 'entrega' ? 5.00 : 0;
  const totalFinal = total + taxaEntrega;

  // Reseta o modal sempre que ele for fechado
  useEffect(() => {
    if (!visivel) {
      setEtapa('carrinho');
      setObsGerais('');
      setTroco('');
    }
  }, [visivel]);

  const handleFinalizar = () => {
    // Provisoriamente, vamos agrupar os dados do checkout nas observações
    // para não quebrar a sua API fake no App.tsx
    const dadosCompletos = `
      Entrega: ${tipoEntrega}
      Pagamento: ${formaPagamento}
      Troco para: ${troco || 'Não precisa'}
      Obs do Cliente: ${obsGerais}
    `;
    onConfirmarPedido(dadosCompletos);
  };

  // ==================== RENDER: ITEM DO CARRINHO ====================
  const renderItem = ({ item }: { item: ItemCarrinho }) => (
    <View style={styles.itemRow}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemNome}>{item.produto.nome}</Text>
        {/* Mostra as observações/adicionais abaixo do nome se houver */}
        {item.observacoes ? <Text style={styles.itemObs}>{item.observacoes}</Text> : null}
        <Text style={styles.itemSubtotal}>
          R$ {(item.produto.preco * item.quantidade).toFixed(2).replace('.', ',')}
        </Text>
      </View>

      <View style={styles.quantityContainer}>
        <TouchableOpacity style={styles.qtyButton} onPress={() => onAtualizarQuantidade(item.produto.id, item.quantidade - 1)}>
          <Ionicons name="remove" size={16} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.qtyText}>{item.quantidade}</Text>
        <TouchableOpacity style={styles.qtyButton} onPress={() => onAtualizarQuantidade(item.produto.id, item.quantidade + 1)}>
          <Ionicons name="add" size={16} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal visible={visivel} animationType="slide" transparent={true} onRequestClose={onFechar}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onFechar} />

        <View style={styles.sheetContainer}>
          
          {/* CABEÇALHO DO MODAL */}
          <View style={styles.sheetHeader}>
            <View style={styles.dragIndicator} />
            <View style={styles.headerTitleRow}>
              {etapa === 'checkout' ? (
                <TouchableOpacity onPress={() => setEtapa('carrinho')} style={styles.backButton}>
                  <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
              ) : <View style={{ width: 24 }} />} {/* Espaçador */}
              
              <Text style={styles.sheetTitle}>{etapa === 'carrinho' ? 'Meu Carrinho' : 'Finalizar Pedido'}</Text>
              
              <TouchableOpacity onPress={onFechar} style={styles.closeButton}>
                <Ionicons name="close" size={22} color={COLORS.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* ========================================== */}
          {/* FASE 1: LISTA DO CARRINHO */}
          {/* ========================================== */}
          {etapa === 'carrinho' && (
            itens.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="basket-outline" size={64} color={COLORS.textSecondary} />
                <Text style={styles.emptyText}>Seu carrinho está vazio</Text>
              </View>
            ) : (
              <View style={styles.content}>
                <FlatList
                  data={itens}
                  keyExtractor={(item) => item.produto.id}
                  renderItem={renderItem}
                  showsVerticalScrollIndicator={false}
                  style={styles.itemsList}
                />

                <View style={styles.obsContainer}>
                  <Text style={styles.sectionTitle}>Alguma observação geral?</Text>
                  <TextInput
                    style={styles.obsInput}
                    placeholder="Ex: Tirar cebola, ponto da carne..."
                    placeholderTextColor={COLORS.textSecondary}
                    value={obsGerais}
                    onChangeText={setObsGerais}
                    multiline
                  />
                </View>

                <View style={styles.footer}>
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Subtotal</Text>
                    <Text style={styles.totalValue}>R$ {total.toFixed(2).replace('.', ',')}</Text>
                  </View>

                  <TouchableOpacity style={styles.primaryBtn} onPress={() => setEtapa('checkout')} activeOpacity={0.8}>
                    <Text style={styles.primaryBtnText}>Ir para Pagamento</Text>
                    <Ionicons name="chevron-forward" size={20} color="#FFF" />
                  </TouchableOpacity>
                </View>
              </View>
            )
          )}

          {/* ========================================== */}
          {/* FASE 2: CHECKOUT (PAGAMENTO E ENTREGA) */}
          {/* ========================================== */}
          {etapa === 'checkout' && (
            <View style={styles.content}>
              <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 400 }}>
                
                {/* 1. MODO DE ENTREGA */}
                <Text style={styles.sectionTitle}>Como deseja receber?</Text>
                <View style={styles.rowButtons}>
                  <TouchableOpacity 
                    style={[styles.toggleBtn, tipoEntrega === 'entrega' && styles.toggleBtnActive]}
                    onPress={() => setTipoEntrega('entrega')}
                  >
                    <Ionicons name="bicycle" size={20} color={tipoEntrega === 'entrega' ? '#FFF' : COLORS.textSecondary} />
                    <Text style={[styles.toggleText, tipoEntrega === 'entrega' && styles.toggleTextActive]}>Entrega</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.toggleBtn, tipoEntrega === 'retirada' && styles.toggleBtnActive]}
                    onPress={() => setTipoEntrega('retirada')}
                  >
                    <Ionicons name="storefront" size={20} color={tipoEntrega === 'retirada' ? '#FFF' : COLORS.textSecondary} />
                    <Text style={[styles.toggleText, tipoEntrega === 'retirada' && styles.toggleTextActive]}>Retirar na Loja</Text>
                  </TouchableOpacity>
                </View>

                {/* 2. FORMA DE PAGAMENTO */}
                <Text style={styles.sectionTitle}>Forma de Pagamento</Text>
                <View style={styles.paymentOptions}>
                  <TouchableOpacity style={[styles.payOption, formaPagamento === 'pix' && styles.payOptionActive]} onPress={() => setFormaPagamento('pix')}>
                    <Ionicons name="qr-code" size={20} color={formaPagamento === 'pix' ? COLORS.primary : COLORS.textSecondary} />
                    <Text style={styles.payText}>Pix</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={[styles.payOption, formaPagamento === 'cartao' && styles.payOptionActive]} onPress={() => setFormaPagamento('cartao')}>
                    <Ionicons name="card" size={20} color={formaPagamento === 'cartao' ? COLORS.primary : COLORS.textSecondary} />
                    <Text style={styles.payText}>Cartão (Máquina)</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.payOption, formaPagamento === 'dinheiro' && styles.payOptionActive]} onPress={() => setFormaPagamento('dinheiro')}>
                    <Ionicons name="cash" size={20} color={formaPagamento === 'dinheiro' ? COLORS.primary : COLORS.textSecondary} />
                    <Text style={styles.payText}>Dinheiro</Text>
                  </TouchableOpacity>
                </View>

                {/* Campo de troco dinâmico */}
                {formaPagamento === 'dinheiro' && (
                  <TextInput
                    style={[styles.obsInput, { height: 50, marginTop: 12 }]}
                    placeholder="Troco para quanto? (Ex: 100)"
                    placeholderTextColor={COLORS.textSecondary}
                    keyboardType="numeric"
                    value={troco}
                    onChangeText={setTroco}
                  />
                )}

              </ScrollView>

              {/* RODAPÉ DO CHECKOUT (CÁLCULO FINAL) */}
              <View style={styles.footer}>
                <View style={styles.resumoRow}>
                  <Text style={styles.resumoLabel}>Subtotal</Text>
                  <Text style={styles.resumoValor}>R$ {total.toFixed(2).replace('.', ',')}</Text>
                </View>
                <View style={styles.resumoRow}>
                  <Text style={styles.resumoLabel}>Taxa de {tipoEntrega === 'entrega' ? 'Entrega' : 'Retirada'}</Text>
                  <Text style={styles.resumoValor}>
                    {taxaEntrega > 0 ? `R$ ${taxaEntrega.toFixed(2).replace('.', ',')}` : 'R$ 0,00'}
                  </Text>
                </View>
                
                <View style={[styles.totalRow, { marginTop: 8, borderTopWidth: 1, borderColor: '#333', paddingTop: 12 }]}>
                  <Text style={styles.totalLabel}>Total Final</Text>
                  <Text style={styles.totalValue}>R$ {totalFinal.toFixed(2).replace('.', ',')}</Text>
                </View>

                <TouchableOpacity 
                  style={styles.primaryBtn}
                  onPress={handleFinalizar}
                  disabled={carregando}
                  activeOpacity={0.8}
                >
                  <Text style={styles.primaryBtnText}>
                    {carregando ? 'Processando...' : 'Confirmar Pedido'}
                  </Text>
                  <Ionicons name="checkmark-circle" size={20} color="#FFF" />
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
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.75)' },
  sheetContainer: { backgroundColor: COLORS.background, borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, borderColor: '#333', maxHeight: '90%' },
  sheetHeader: { alignItems: 'center', paddingVertical: SPACING.sm, borderBottomWidth: 1, borderColor: '#222' },
  dragIndicator: { width: 40, height: 4, backgroundColor: '#333', borderRadius: 2, marginBottom: SPACING.sm },
  headerTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingHorizontal: SPACING.md },
  sheetTitle: { color: COLORS.text, fontSize: 18, fontWeight: 'bold' },
  backButton: { padding: 4 },
  closeButton: { backgroundColor: COLORS.surface, padding: 6, borderRadius: 20 },
  
  content: { paddingHorizontal: SPACING.md, paddingBottom: Platform.OS === 'ios' ? 30 : SPACING.md },
  emptyContainer: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { color: COLORS.text, fontSize: 16, fontWeight: 'bold', marginTop: SPACING.md },
  
  itemsList: { maxHeight: 200, marginTop: SPACING.sm },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.surface, padding: SPACING.md, borderRadius: 14, marginBottom: SPACING.sm, borderWidth: 1, borderColor: '#2A2A2A' },
  itemInfo: { flex: 1, paddingRight: SPACING.sm },
  itemNome: { color: COLORS.text, fontWeight: 'bold', fontSize: 14 },
  itemObs: { color: COLORS.primary, fontSize: 11, marginTop: 2 },
  itemSubtotal: { color: COLORS.textSecondary, fontSize: 13, marginTop: 4 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: 10, padding: 2, borderWidth: 1, borderColor: '#333' },
  qtyButton: { padding: 6 },
  qtyText: { color: COLORS.text, fontWeight: 'bold', fontSize: 14, minWidth: 20, textAlign: 'center' },
  
  obsContainer: { marginTop: SPACING.sm },
  sectionTitle: { color: COLORS.text, fontWeight: 'bold', fontSize: 15, marginBottom: 12, marginTop: 20 },
  obsInput: { backgroundColor: COLORS.surface, color: COLORS.text, borderRadius: 12, padding: SPACING.md, fontSize: 14, height: 60, textAlignVertical: 'top', borderWidth: 1, borderColor: '#2A2A2A' },
  
  // Estilos da Fase 2 (Checkout)
  rowButtons: { flexDirection: 'row', gap: SPACING.sm },
  toggleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.surface, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#333' },
  toggleBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  toggleText: { color: COLORS.textSecondary, fontWeight: 'bold' },
  toggleTextActive: { color: '#FFF' },
  
  paymentOptions: { gap: SPACING.sm },
  payOption: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.surface, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#333' },
  payOptionActive: { borderColor: COLORS.primary, backgroundColor: '#2a1a10' },
  payText: { color: COLORS.text, fontSize: 15, fontWeight: '500' },

  footer: { marginTop: SPACING.lg, borderTopWidth: 1, borderColor: '#222', paddingTop: SPACING.md },
  resumoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  resumoLabel: { color: COLORS.textSecondary, fontSize: 14 },
  resumoValor: { color: COLORS.text, fontSize: 14 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  totalLabel: { color: COLORS.textSecondary, fontSize: 16 },
  totalValue: { color: COLORS.text, fontSize: 22, fontWeight: '900' },
  
  primaryBtn: { backgroundColor: COLORS.primary, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, borderRadius: 14, gap: SPACING.xs },
  primaryBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});