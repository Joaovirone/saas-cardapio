import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

interface BottomNavBarProps {
  abaAtiva: string;
  setAbaAtiva: (aba: string) => void;
  quantidadeCarrinho: number;
  onAbrirCarrinho: () => void;
}

// CORREÇÃO: Alterado de Props para BottomNavBarProps
export function BottomNavBar({ abaAtiva, setAbaAtiva, quantidadeCarrinho, onAbrirCarrinho }: BottomNavBarProps) {
  
  const { isAdmin } = useAuth();

  const abas = [
    { id: 'Cardapio', nome: 'Início', icone: 'home' },
    { id: 'Pedidos', nome: 'Pedidos', icone: 'receipt' },
    { id: 'Perfil', nome: 'Perfil', icone: 'person' },
  ];

  if (isAdmin) {
    abas.splice(2, 0, { id: 'Admin', nome: 'Gestão', icone: 'settings' });
  }

  return (
    <View style={styles.container}>
      {abas.map((aba) => (
        <TouchableOpacity 
          key={aba.id} 
          style={styles.tab} 
          onPress={() => setAbaAtiva(aba.id)}
        >
          <Ionicons 
            name={aba.icone as any} 
            size={24} 
            color={abaAtiva === aba.id ? COLORS.primary : COLORS.textSecondary} 
          />
          <Text style={[styles.tabText, { color: abaAtiva === aba.id ? COLORS.primary : COLORS.textSecondary }]}>
            {aba.nome}
          </Text>
        </TouchableOpacity>
      ))}

      {/* CORREÇÃO: Botão do Carrinho Restaurado */}
      <TouchableOpacity style={styles.tab} onPress={onAbrirCarrinho}>
        <View style={styles.iconContainer}>
          <Ionicons name="cart" size={24} color={COLORS.textSecondary} />
          {quantidadeCarrinho > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{quantidadeCarrinho}</Text>
            </View>
          )}
        </View>
        <Text style={styles.tabText}>Carrinho</Text>
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