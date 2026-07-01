import React, { useState, useEffect } from 'react';
import { 
  Modal, View, Text, StyleSheet, TouchableOpacity, FlatList, 
  TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { ItemCarrinho } from '../types';

// IMPORTANTE: Trazemos o contexto global para o Modal saber quem está comprando
import { useUser } from '../context/UserContext';

interface CarrinhoModalProps {
  readonly visivel: boolean;
  readonly itens: ItemCarrinho[];
  readonly total: number;
  readonly onFechar: () => void;
  readonly onRemoverItem: (produtoId: string) => void;
  readonly onAtualizarQuantidade: (produtoId: string, quantidade: number) => void;
  // Atualizamos a prop para devolver o endereço final escolhido
  readonly onConfirmarPedido: (dadosPedido: string, enderecoFinal: string) => void; 
  readonly carregando: boolean;
}

export function CarrinhoModal({
  visivel, itens, total, onFechar, onRemoverItem, onAtualizarQuantidade, onConfirmarPedido, carregando
}: CarrinhoModalProps) {
  
  // Consumindo o estado global
  const { autenticado, endereco: enderecoGlobal } = useUser() as any;

  // Estados do Modal
  const [etapa, setEtapa] = useState<'carrinho' | 'checkout'>('carrinho');
  const [obsGerais, setObsGerais] = useState('');
  
  // Estados do Checkout
  const [tipoEntrega, setTipoEntrega] = useState<'entrega' | 'retirada'>('entrega');
  const [formaPagamento, setFormaPagamento] = useState('pix');
  const [troco, setTroco] = useState('');
  
  // O Estado do endereço "Avulso" para quem não tem conta
  const [enderecoVisitante, setEnderecoVisitante] = useState('');

  const taxaEntrega = tipoEntrega === 'entrega' ? 5 : 0;
  const totalFinal = total + taxaEntrega;

  useEffect(() => {
    if (!visivel) {
      setEtapa('carrinho');
      setObsGerais('');
      setTroco('');
      setEnderecoVisitante('');
    }
  }, [visivel]);

  const handleFinalizar = () => {
    let enderecoDoPedido = '';

    // VALIDAÇÃO RIGOROSA DA ENTREGA
    if (tipoEntrega === 'entrega') {
      if (autenticado) {
        if (!enderecoGlobal || enderecoGlobal.trim() === '') {
          Alert.alert('Endereço Ausente', 'Você está logado, mas não tem endereço no perfil. Volte e atualize seus dados.');
          return;
        }
        enderecoDoPedido = enderecoGlobal;
      } else {
        if (!enderecoVisitante || enderecoVisitante.trim() === '') {
          Alert.alert('Faltou o Endereço!', 'Por favor, digite o endereço de entrega para enviarmos seu pedido.');
          return;
        }
        enderecoDoPedido = enderecoVisitante;
      }
    } else {
      enderecoDoPedido = 'Retirada na Loja';
    }

    const dadosCompletos = `
      Entrega: ${tipoEntrega}
      Pagamento: ${formaPagamento}
      Troco para: ${troco || 'Não precisa'}
      Obs do Cliente: ${obsGerais}
    `;
    
    // Dispara a função passando os dados e o endereço validado
    onConfirmarPedido(dadosCompletos, enderecoDoPedido);
  };

  const renderItem = ({ item }: { item: ItemCarrinho }) => (
    <View style={styles.itemRow}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemNome}>{item.produto.nome}</Text>
        {item.observacoes ? <Text style={styles.itemObs}>{item.observacoes}</Text> : null}
        <Text style={styles.itemSubtotal}>R$ {(item.produto.preco * item.quantidade).toFixed(2).replace('.', ',')}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity style={styles.qtyButton} onPress={() => onAtualizarQuantidade(item.produto.id, item.quantidade - 1)}><Ionicons name="remove" size={16} color={COLORS.primary} /></TouchableOpacity>
        <Text style={styles.qtyText}>{item.quantidade}</Text>
        <TouchableOpacity style={styles.qtyButton} onPress={() => onAtualizarQuantidade(item.produto.id, item.quantidade + 1)}><Ionicons name="add" size={16} color={COLORS.primary} /></TouchableOpacity>
      </View>
    </View>
  );

  const renderCarrinho = () => {
    if (itens.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="basket-outline" size={64} color={COLORS.textSecondary} />
          <Text style={styles.emptyText}>Seu carrinho está vazio</Text>
        </View>
      );
    }

    return (
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
    );
  };

  const renderEnderecoInput = () => {
    if (autenticado) {
      return (
        <View style={styles.savedAddressBox}>
          <Ionicons name="location" size={24} color={COLORS.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.addressLabel}>Entregar no endereço do perfil:</Text>
            <Text style={styles.addressValue}>{enderecoGlobal || '⚠️ Perfil sem endereço!'}</Text>
          </View>
        </View>
      );
    }

    return (
      <>
        <Text style={styles.sectionTitle}>Para onde enviamos?</Text>
        <TextInput
          style={styles.input}
          placeholder="Rua, Número, Bairro, Referência..."
          placeholderTextColor={COLORS.textSecondary}
          value={enderecoVisitante}
          onChangeText={setEnderecoVisitante}
        />
      </>
    );
  };

  const renderCheckout = () => (
    <View style={styles.content}>
      <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 400 }}>
        <Text style={styles.sectionTitle}>Como deseja receber?</Text>
        <View style={styles.rowButtons}>
          <TouchableOpacity style={[styles.toggleBtn, tipoEntrega === 'entrega' && styles.toggleBtnActive]} onPress={() => setTipoEntrega('entrega')}>
            <Ionicons name="bicycle" size={20} color={tipoEntrega === 'entrega' ? '#FFF' : COLORS.textSecondary} />
            <Text style={[styles.toggleText, tipoEntrega === 'entrega' && styles.toggleTextActive]}>Entrega</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.toggleBtn, tipoEntrega === 'retirada' && styles.toggleBtnActive]} onPress={() => setTipoEntrega('retirada')}>
            <Ionicons name="storefront" size={20} color={tipoEntrega === 'retirada' ? '#FFF' : COLORS.textSecondary} />
            <Text style={[styles.toggleText, tipoEntrega === 'retirada' && styles.toggleTextActive]}>Retirar na Loja</Text>
          </TouchableOpacity>
        </View>

        {tipoEntrega === 'entrega' && <View style={{ marginTop: 16 }}>{renderEnderecoInput()}</View>}

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

        {formaPagamento === 'dinheiro' && (
          <TextInput
            style={[styles.input, { marginTop: 12 }]}
            placeholder="Troco para quanto? (Ex: 100)"
            placeholderTextColor={COLORS.textSecondary}
            keyboardType="numeric"
            value={troco}
            onChangeText={setTroco}
          />
        )}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.resumoRow}>
          <Text style={styles.resumoLabel}>Subtotal</Text>
          <Text style={styles.resumoValor}>R$ {total.toFixed(2).replace('.', ',')}</Text>
        </View>
        <View style={styles.resumoRow}>
          <Text style={styles.resumoLabel}>Taxa de {tipoEntrega === 'entrega' ? 'Entrega' : 'Retirada'}</Text>
          <Text style={styles.resumoValor}>{taxaEntrega > 0 ? `R$ ${taxaEntrega.toFixed(2).replace('.', ',')}` : 'Grátis'}</Text>
        </View>
        <View style={[styles.totalRow, { marginTop: 8, borderTopWidth: 1, borderColor: '#333', paddingTop: 12 }]}> 
          <Text style={styles.totalLabel}>Total Final</Text>
          <Text style={styles.totalValue}>R$ {totalFinal.toFixed(2).replace('.', ',')}</Text>
        </View>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleFinalizar} disabled={carregando} activeOpacity={0.8}>
          <Text style={styles.primaryBtnText}>{carregando ? 'Processando...' : 'Confirmar Pedido'}</Text>
          <Ionicons name="checkmark-circle" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal visible={visivel} animationType="slide" transparent={true} onRequestClose={onFechar}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onFechar} />

        <View style={styles.sheetContainer}>
          <View style={styles.sheetHeader}>
            <View style={styles.dragIndicator} />
            <View style={styles.headerTitleRow}>
              {etapa === 'checkout' ? (
                <TouchableOpacity onPress={() => setEtapa('carrinho')} style={styles.backButton}><Ionicons name="arrow-back" size={24} color={COLORS.text} /></TouchableOpacity>
              ) : <View style={{ width: 24 }} />}
              <Text style={styles.sheetTitle}>{etapa === 'carrinho' ? 'Meu Carrinho' : 'Finalizar Pedido'}</Text>
              <TouchableOpacity onPress={onFechar} style={styles.closeButton}><Ionicons name="close" size={22} color={COLORS.text} /></TouchableOpacity>
            </View>
          </View>

          {etapa === 'carrinho' ? renderCarrinho() : renderCheckout()}

        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(17, 24, 39, 0.55)' },
  sheetContainer: { backgroundColor: COLORS.surface, borderTopLeftRadius: BORDER_RADIUS.xxl, borderTopRightRadius: BORDER_RADIUS.xxl, borderWidth: 1, borderColor: COLORS.border, maxHeight: '90%', ...SHADOWS.md },
  sheetHeader: { alignItems: 'center', paddingVertical: SPACING.sm, borderBottomWidth: 1, borderColor: COLORS.border },
  dragIndicator: { width: 40, height: 4, backgroundColor: COLORS.border, borderRadius: 999, marginBottom: SPACING.sm },
  headerTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingHorizontal: SPACING.md },
  sheetTitle: { color: COLORS.text, fontSize: 18, fontWeight: '700' },
  backButton: { padding: 4 },
  closeButton: { backgroundColor: COLORS.surfaceAlt, padding: 6, borderRadius: 999, borderWidth: 1, borderColor: COLORS.border },
  content: { paddingHorizontal: SPACING.md, paddingBottom: Platform.OS === 'ios' ? 30 : SPACING.md },
  emptyContainer: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { color: COLORS.text, fontSize: 16, fontWeight: '700', marginTop: SPACING.md },
  itemsList: { maxHeight: 220, marginTop: SPACING.sm },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.surface, padding: SPACING.md, borderRadius: BORDER_RADIUS.lg, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.sm },
  itemInfo: { flex: 1, paddingRight: SPACING.sm },
  itemNome: { color: COLORS.text, fontWeight: '700', fontSize: 14 },
  itemObs: { color: COLORS.primary, fontSize: 11, marginTop: 2, fontWeight: '600' },
  itemSubtotal: { color: COLORS.textSecondary, fontSize: 13, marginTop: 4 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surfaceAlt, borderRadius: BORDER_RADIUS.md, padding: 2, borderWidth: 1, borderColor: COLORS.border },
  qtyButton: { padding: 6 },
  qtyText: { color: COLORS.text, fontWeight: '700', fontSize: 14, minWidth: 20, textAlign: 'center' },
  obsContainer: { marginTop: SPACING.sm },
  sectionTitle: { color: COLORS.text, fontWeight: '700', fontSize: 15, marginBottom: 12, marginTop: 20 },
  obsInput: { backgroundColor: COLORS.surfaceAlt, color: COLORS.text, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, fontSize: 14, height: 60, textAlignVertical: 'top', borderWidth: 1, borderColor: COLORS.border },
  input: { backgroundColor: COLORS.surfaceAlt, color: COLORS.text, borderRadius: BORDER_RADIUS.lg, padding: 16, fontSize: 15, borderWidth: 1, borderColor: COLORS.border },
  savedAddressBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff7ed', padding: 16, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: COLORS.primary, gap: 12 },
  addressLabel: { color: COLORS.primary, fontSize: 12, fontWeight: '700', marginBottom: 4 },
  addressValue: { color: COLORS.text, fontSize: 14 },
  rowButtons: { flexDirection: 'row', gap: SPACING.sm },
  toggleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.surfaceAlt, padding: 16, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: COLORS.border },
  toggleBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  toggleText: { color: COLORS.textSecondary, fontWeight: '700' },
  toggleTextActive: { color: '#FFF' },
  paymentOptions: { gap: SPACING.sm },
  payOption: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.surfaceAlt, padding: 16, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: COLORS.border },
  payOptionActive: { borderColor: COLORS.primary, backgroundColor: '#fff7ed' },
  payText: { color: COLORS.text, fontSize: 15, fontWeight: '600' },
  footer: { marginTop: SPACING.lg, borderTopWidth: 1, borderColor: COLORS.border, paddingTop: SPACING.md },
  resumoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  resumoLabel: { color: COLORS.textSecondary, fontSize: 14 },
  resumoValor: { color: COLORS.text, fontSize: 14, fontWeight: '600' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  totalLabel: { color: COLORS.textSecondary, fontSize: 16 },
  totalValue: { color: COLORS.text, fontSize: 22, fontWeight: '900' },
  primaryBtn: { backgroundColor: COLORS.primary, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, borderRadius: BORDER_RADIUS.lg, gap: SPACING.xs },
  primaryBtnText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
});