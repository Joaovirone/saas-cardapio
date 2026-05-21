import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/theme';
import { useUser } from '../context/UserContext';

// Mock de dados. Isso virá do GET /api/pedidos/cliente/{id} no futuro
const PEDIDOS_MOCK = [
  {
    id: 'PED-9021',
    data: 'Hoje, 20:45',
    status: 'preparando', // pendente, preparando, entrega, concluido
    total: 39.40,
    itens: '1x Duplo Smash Bacon, 1x Coca-Cola Lata'
  },
  {
    id: 'PED-8814',
    data: '12 Maio, 19:30',
    status: 'concluido',
    total: 62.40,
    itens: '2x Classic Burger, 1x Suco Natural'
  }
];

export function MeusPedidosView() {
  const { autenticado } = useUser() as any;

  if (!autenticado) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="receipt-outline" size={80} color={COLORS.surface} />
        <Text style={styles.title}>Meus Pedidos</Text>
        <Text style={styles.subtitle}>Faça login na aba Perfil para acompanhar seus lanches e ver seu histórico.</Text>
      </View>
    );
  }

  const renderConfigStatus = (status: string) => {
    switch (status) {
      case 'pendente': return { cor: COLORS.secondary, icone: 'time-outline', texto: 'Aguardando Confirmação' };
      case 'preparando': return { cor: COLORS.primary, icone: 'restaurant-outline', texto: 'Na Chapa (Preparando)' };
      case 'entrega': return { cor: COLORS.info, icone: 'bicycle-outline', texto: 'Saiu para Entrega' };
      case 'concluido': return { cor: COLORS.success, icone: 'checkmark-circle-outline', texto: 'Pedido Entregue' };
      default: return { cor: COLORS.textSecondary, icone: 'help-circle-outline', texto: 'Status Desconhecido' };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meus Pedidos</Text>
      </View>

      <FlatList
        data={PEDIDOS_MOCK}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const config = renderConfigStatus(item.status);
          
          return (
            <TouchableOpacity style={styles.card} activeOpacity={0.8}>
              <View style={styles.cardHeader}>
                <Text style={styles.pedidoId}>#{item.id}</Text>
                <Text style={styles.pedidoData}>{item.data}</Text>
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.itensText} numberOfLines={2}>{item.itens}</Text>
                <Text style={styles.totalText}>R$ {item.total.toFixed(2).replace('.', ',')}</Text>
              </View>

              <View style={[styles.statusBox, { backgroundColor: config.cor + '20', borderColor: config.cor }]}>
                <Ionicons name={config.icone as any} size={18} color={config.cor} />
                <Text style={[styles.statusText, { color: config.cor }]}>{config.texto}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  title: { color: COLORS.text, fontSize: 24, fontWeight: 'bold', marginTop: 16 },
  subtitle: { color: COLORS.textSecondary, fontSize: 14, textAlign: 'center', marginTop: 8, lineHeight: 22 },
  header: { padding: SPACING.md, paddingTop: SPACING.xl, paddingBottom: SPACING.lg, borderBottomWidth: 1, borderColor: '#222' },
  headerTitle: { color: COLORS.text, fontSize: 28, fontWeight: '900' },
  listContent: { padding: SPACING.md, paddingBottom: 100 },
  card: { backgroundColor: COLORS.surface, borderRadius: 16, padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: '#333' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  pedidoId: { color: COLORS.text, fontWeight: 'bold', fontSize: 16 },
  pedidoData: { color: COLORS.textSecondary, fontSize: 13 },
  cardBody: { marginBottom: 16 },
  itensText: { color: COLORS.textSecondary, fontSize: 14, lineHeight: 20 },
  totalText: { color: COLORS.text, fontWeight: '900', fontSize: 16, marginTop: 8 },
  statusBox: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 10, borderWidth: 1, gap: 8 },
  statusText: { fontWeight: 'bold', fontSize: 14 },
});