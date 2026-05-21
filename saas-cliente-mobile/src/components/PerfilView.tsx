import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/theme';

export function PerfilView() {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');

  const handleSalvar = () => {
    Alert.alert('Sucesso', 'Dados salvos localmente! (Em breve integrados ao banco da lanchonete)');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-circle" size={80} color={COLORS.primary} />
        <Text style={styles.title}>Meu Perfil</Text>
        <Text style={styles.subtitle}>Configure seus dados para agilizar a entrega</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Nome Completo</Text>
        <TextInput style={styles.input} placeholder="Digite seu Nome" placeholderTextColor={COLORS.textSecondary} value={nome} onChangeText={setNome} />

        <Text style={styles.label}>WhatsApp / Telefone</Text>
        <TextInput style={styles.input} placeholder="(00) 9 0000-0000" placeholderTextColor={COLORS.textSecondary} keyboardType="phone-pad" value={telefone} onChangeText={setTelefone} />

        <Text style={styles.label}>Endereço de Entrega</Text>
        <TextInput style={styles.input} placeholder="Rua, Número, Bairro" placeholderTextColor={COLORS.textSecondary} value={endereco} onChangeText={setEndereco} />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSalvar}>
          <Text style={styles.saveBtnText}>Salvar Dados</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { alignItems: 'center', paddingVertical: 40, borderBottomWidth: 1, borderColor: '#222' },
  title: { color: COLORS.text, fontSize: 24, fontWeight: 'bold', marginTop: 16 },
  subtitle: { color: COLORS.textSecondary, fontSize: 14, marginTop: 4 },
  form: { padding: SPACING.lg },
  label: { color: COLORS.text, fontSize: 14, fontWeight: 'bold', marginBottom: 8, marginTop: 16 },
  input: { backgroundColor: COLORS.surface, color: COLORS.text, borderRadius: 12, padding: 16, fontSize: 16, borderWidth: 1, borderColor: '#333' },
  saveBtn: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 32 },
  saveBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});