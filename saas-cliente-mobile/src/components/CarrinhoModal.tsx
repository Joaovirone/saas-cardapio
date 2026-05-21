import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ItemCarrinho } from '../types';
import { formatarMoeda } from '../utils/formatting';
import { CarrinhoItem } from './CarrinhoItem';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';

interface CarrinhoModalProps {
  visivel: boolean;
  itens: ItemCarrinho[];
  total: number;
  onFechar: () => void;
  onRemoverItem: (produtoId: string) => void;
  onAtualizarQuantidade: (produtoId: string, quantidade: number) => void;
  onConfirmarPedido: (observacoes: string) => void;
  carregando?: boolean;
}

export const CarrinhoModal: React.FC<CarrinhoModalProps> = ({
  visivel,
  itens,
  total,
  onFechar,
  onRemoverItem,
  onAtualizarQuantidade,
  onConfirmarPedido,
  carregando = false,
}) => {
  const [observacoes, setObservacoes] = React.useState('');

  return (
    <Modal
      visible={visivel}
      animationType="slide"
      transparent={false}
      onRequestClose={onFechar}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.titulo}>Seu Carrinho</Text>
          <TouchableOpacity onPress={onFechar}>
            <Ionicons name="close" size={28} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* Lista de Itens */}
        {itens.length === 0 ? (
          <View style={styles.vazio}>
            <Ionicons name="bag-outline" size={64} color={COLORS.textSecondary} />
            <Text style={styles.vazioTexto}>Carrinho vazio</Text>
            <Text style={styles.vazioSubtexto}>
              Adicione alguns itens para começar!
            </Text>
          </View>
        ) : (
          <ScrollView style={styles.lista} showsVerticalScrollIndicator={false}>
            {itens.map(item => (
              <CarrinhoItem
                key={item.id}
                item={item}
                onRemover={onRemoverItem}
                onAtualizarQuantidade={onAtualizarQuantidade}
              />
            ))}

            {/* Observações */}
            <View style={styles.observacoesSection}>
              <Text style={styles.observacoesLabel}>Observações do Pedido</Text>
              <TextInput
                style={styles.observacoesInput}
                placeholder="Ex: Sem cebola, extra bacon..."
                placeholderTextColor={COLORS.textSecondary}
                multiline
                numberOfLines={3}
                value={observacoes}
                onChangeText={setObservacoes}
              />
            </View>
          </ScrollView>
        )}

        {/* Footer com Total e Botão */}
        {itens.length > 0 && (
          <View style={styles.footer}>
            <View style={styles.totalSection}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValor}>{formatarMoeda(total)}</Text>
            </View>

            <TouchableOpacity
              style={[styles.btnConfirmar, carregando && styles.btnConfirmarDisabled]}
              onPress={() => onConfirmarPedido(observacoes)}
              disabled={carregando}
              activeOpacity={0.7}
            >
              {carregando ? (
                <Text style={styles.btnConfirmarTexto}>Confirmando...</Text>
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.surface} />
                  <Text style={styles.btnConfirmarTexto}>Confirmar Pedido</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  titulo: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  lista: {
    flex: 1,
  },
  vazio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  vazioTexto: {
    fontSize: TYPOGRAPHY.md,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  vazioSubtexto: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
  observacoesSection: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  observacoesLabel: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  observacoesInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.text,
    textAlignVertical: 'top',
  },
  footer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.md,
  },
  totalLabel: {
    fontSize: TYPOGRAPHY.md,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  totalValor: {
    fontSize: TYPOGRAPHY.xl,
    fontWeight: '700',
    color: COLORS.primary,
  },
  btnConfirmar: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  btnConfirmarDisabled: {
    opacity: 0.6,
  },
  btnConfirmarTexto: {
    color: COLORS.surface,
    fontSize: TYPOGRAPHY.md,
    fontWeight: '700',
  },
});
