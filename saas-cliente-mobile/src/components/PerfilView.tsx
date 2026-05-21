import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  Alert,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/theme';

export function PerfilView() {
  // ==================== ESTADOS DE NAVEGAÇÃO ====================
  const [autenticado, setAutenticado] = useState(false);
  const [isRegistrando, setIsRegistrando] = useState(false);

  // ==================== ESTADOS DO FORMULÁRIO ====================
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cep, setCep] = useState('');

  // ==================== HANDLERS ====================
  const handleEntrar = () => {
    if (!email || !senha) {
      Alert.alert('Ops!', 'Preencha e-mail e senha para entrar.');
      return;
    }
    // Simula o login na API
    setAutenticado(true);
  };

  const handleRegistrar = () => {
    if (!nome || !email || !senha || !telefone || !endereco) {
      Alert.alert('Ops!', 'Preencha todos os campos obrigatórios.');
      return;
    }
    // Simula o cadastro na API e já loga o usuário
    Alert.alert('Sucesso!', 'Conta criada com sucesso.');
    setAutenticado(true);
    setIsRegistrando(false); // Reseta a tela para não voltar pro cadastro ao deslogar
  };

  const handleSalvar = () => {
    Alert.alert('Sucesso', 'Dados atualizados para as próximas entregas!');
  };

  // ==================== RENDERIZAÇÃO CONDICIONAL ====================
  const renderCabecalho = () => {
    if (autenticado) {
      return { icone: 'person-circle', titulo: 'Meu Perfil', subtitulo: 'Configure seus dados para agilizar a entrega' };
    }
    if (isRegistrando) {
      return { icone: 'person-add-outline', titulo: 'Nova Conta', subtitulo: 'Preencha seus dados para criar o perfil' };
    }
    return { icone: 'lock-closed-outline', titulo: 'Acesse sua Conta', subtitulo: 'Faça login para salvar seus endereços e pedidos (Opcional)' };
  };

  const info = renderCabecalho();

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      {/* ScrollView permite que a tela role quando o teclado abrir */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* CABEÇALHO DINÂMICO */}
        <View style={styles.header}>
          <Ionicons name={info.icone as any} size={80} color={COLORS.primary} />
          <Text style={styles.title}>{info.titulo}</Text>
          <Text style={styles.subtitle}>{info.subtitulo}</Text>
        </View>

        <View style={styles.form}>
          
          {/* TELA DO USUÁRIO LOGADO */}
          {autenticado && (
            <>
              <Text style={styles.label}>Nome Completo</Text>
              <TextInput style={styles.input} value={nome || 'João Vitor'} onChangeText={setNome} placeholderTextColor={COLORS.textSecondary} />

              <Text style={styles.label}>WhatsApp / Telefone</Text>
              <TextInput style={styles.input} value={telefone || '(79) 99100-0000'} onChangeText={setTelefone} keyboardType="phone-pad" placeholderTextColor={COLORS.textSecondary}/>

              <Text style={styles.label}>Endereço de Entrega Principal</Text>
              <TextInput style={styles.input} value={endereco || 'Rua das Flores, 123'} onChangeText={setEndereco} placeholderTextColor={COLORS.textSecondary} />

              <TouchableOpacity style={styles.primaryBtn} onPress={handleSalvar} activeOpacity={0.8}>
                <Text style={styles.primaryBtnText}>Salvar Alterações</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.logoutBtn} onPress={() => setAutenticado(false)}>
                <Text style={styles.logoutBtnText}>Sair da conta</Text>
              </TouchableOpacity>
            </>
          )}

          {/* TELA DE LOGIN */}
          {!autenticado && !isRegistrando && (
            <>
              <Text style={styles.label}>E-mail</Text>
              <TextInput style={styles.input} placeholder="seu@email.com" placeholderTextColor={COLORS.textSecondary} keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />

              <Text style={styles.label}>Senha</Text>
              <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor={COLORS.textSecondary} secureTextEntry value={senha} onChangeText={setSenha} />

              <TouchableOpacity style={styles.primaryBtn} onPress={handleEntrar} activeOpacity={0.8}>
                <Text style={styles.primaryBtnText}>Entrar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryBtn} onPress={() => setIsRegistrando(true)}>
                <Text style={styles.secondaryBtnText}>Criar nova conta</Text>
              </TouchableOpacity>
            </>
          )}

          {/* TELA DE CADASTRO (REGISTRO) */}
          {!autenticado && isRegistrando && (
            <>
              <Text style={styles.label}>Nome Completo</Text>
              <TextInput style={styles.input} placeholder="Ex: João Vitor" placeholderTextColor={COLORS.textSecondary} value={nome} onChangeText={setNome} />

              <Text style={styles.label}>E-mail</Text>
              <TextInput style={styles.input} placeholder="seu@email.com" placeholderTextColor={COLORS.textSecondary} keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />

              <Text style={styles.label}>Senha</Text>
              <TextInput style={styles.input} placeholder="Crie uma senha segura" placeholderTextColor={COLORS.textSecondary} secureTextEntry value={senha} onChangeText={setSenha} />

              <Text style={styles.label}>WhatsApp / Telefone</Text>
              <TextInput style={styles.input} placeholder="(79) 90000-0000" placeholderTextColor={COLORS.textSecondary} keyboardType="phone-pad" value={telefone} onChangeText={setTelefone} />

              <Text style={styles.label}>Localização / Endereço</Text>
              <TextInput style={styles.input} placeholder="Rua, Número, Bairro - Aracaju" placeholderTextColor={COLORS.textSecondary} value={endereco} onChangeText={setEndereco} />

              <Text style={styles.label}>CEP (Opcional)</Text>
              <TextInput style={styles.input} placeholder="00000-000" placeholderTextColor={COLORS.textSecondary} keyboardType="number-pad" value={cep} onChangeText={setCep} />

              <TouchableOpacity style={styles.primaryBtn} onPress={handleRegistrar} activeOpacity={0.8}>
                <Text style={styles.primaryBtnText}>Finalizar Cadastro</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryBtn} onPress={() => setIsRegistrando(false)}>
                <Text style={styles.secondaryBtnText}>Já tenho uma conta</Text>
              </TouchableOpacity>
            </>
          )}

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingBottom: 40 }, // Dá espaço para o scroll terminar confortavelmente
  header: { alignItems: 'center', paddingTop: 40, paddingBottom: 30, borderBottomWidth: 1, borderColor: '#222' },
  title: { color: COLORS.text, fontSize: 24, fontWeight: 'bold', marginTop: 16 },
  subtitle: { color: COLORS.textSecondary, fontSize: 13, marginTop: 4, textAlign: 'center', paddingHorizontal: 40 },
  form: { padding: SPACING.lg },
  label: { color: COLORS.text, fontSize: 14, fontWeight: 'bold', marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: COLORS.surface, color: COLORS.text, borderRadius: 12, padding: 16, fontSize: 15, borderWidth: 1, borderColor: '#333' },
  primaryBtn: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 32 },
  primaryBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  secondaryBtn: { padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  secondaryBtnText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 16 },
  logoutBtn: { padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  logoutBtnText: { color: COLORS.error, fontWeight: 'bold', fontSize: 16 },
});