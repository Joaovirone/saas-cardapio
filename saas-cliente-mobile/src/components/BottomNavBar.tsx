import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/theme';

interface BottomNavBarProps {
  abaAtiva: string;
  setAbaAtiva: (aba: string) => void;
  quantidadeCarrinho: number;
  onAbrirCarrinho: () => void;
}

export function BottomNavBar({ abaAtiva, setAbaAtiva, quantidadeCarrinho, onAbrirCarrinho }: BottomNavBarProps) {
  return (
    <View style={styles.container}>
      
      {/* ABA 1: CARDÁPIO */}
      <TouchableOpacity style={styles.tab} onPress={() => setAbaAtiva('Cardapio')} activeOpacity={0.7}>
        <Ionicons name={abaAtiva === 'Cardapio' ? 'fast-food' : 'fast-food-outline'} size={24} color={abaAtiva === 'Cardapio' ? COLORS.primary : COLORS.textSecondary} />
        <Text style={[styles.tabText, abaAtiva === 'Cardapio' && styles.tabTextActive]}>Cardápio</Text>
      </TouchableOpacity>

      {/* ABA 2: MEUS PEDIDOS (NOVA) */}
      <TouchableOpacity style={styles.tab} onPress={() => setAbaAtiva('Pedidos')} activeOpacity={0.7}>
        <Ionicons name={abaAtiva === 'Pedidos' ? 'receipt' : 'receipt-outline'} size={24} color={abaAtiva === 'Pedidos' ? COLORS.primary : COLORS.textSecondary} />
        <Text style={[styles.tabText, abaAtiva === 'Pedidos' && styles.tabTextActive]}>Pedidos</Text>
      </TouchableOpacity>

      {/* ABA 3: CARRINHO (Abre o Modal) */}
      <TouchableOpacity style={styles.tab} onPress={onAbrirCarrinho} activeOpacity={0.7}>
        <View style={styles.iconContainer}>
          <Ionicons name="cart-outline" size={24} color={COLORS.textSecondary} />
          {quantidadeCarrinho > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{quantidadeCarrinho}</Text>
            </View>
          )}
        </View>
        <Text style={styles.tabText}>Carrinho</Text>
      </TouchableOpacity>

      {/* ABA 4: PERFIL */}
      <TouchableOpacity style={styles.tab} onPress={() => setAbaAtiva('Perfil')} activeOpacity={0.7}>
        <Ionicons name={abaAtiva === 'Perfil' ? 'person' : 'person-outline'} size={24} color={abaAtiva === 'Perfil' ? COLORS.primary : COLORS.textSecondary} />
        <Text style={[styles.tabText, abaAtiva === 'Perfil' && styles.tabTextActive]}>Perfil</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: COLORS.surface, paddingVertical: SPACING.sm, paddingBottom: Platform.OS === 'ios' ? 24 : SPACING.sm, borderTopWidth: 1, borderColor: '#333' },
  tab: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  iconContainer: { position: 'relative' },
  tabText: { fontSize: 10, color: COLORS.textSecondary, marginTop: 4, fontWeight: '500' },
  tabTextActive: { color: COLORS.primary, fontWeight: 'bold' },
  badge: { position: 'absolute', top: -6, right: -10, backgroundColor: COLORS.primary, borderRadius: 10, minWidth: 18, height: 18, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4, borderWidth: 1.5, borderColor: COLORS.surface },
  badgeText: { color: '#FFF', fontSize: 9, fontWeight: 'bold' },
});