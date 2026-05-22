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
import { useUser } from '../context/UserContext'; 
import { useAuth } from '../context/AuthContext'; 

export function PerfilView({ setAbaAtiva }: { setAbaAtiva?: (aba: string) => void }) {
  const [isRegistrando, setIsRegistrando] = useState(false);

  const {
    autenticado, setAutenticado,
    nome, setNome, email, setEmail, telefone, setTelefone,
    endereco, setEndereco, cep, setCep
  } = useUser() as any; 

  const { isAdmin, login, logout } = useAuth();

  const [localSenha, setLocalSenha] = useState('');

  const handleEntrar = async () => {
    if (!email || !localSenha) {
      Alert.alert('Atenção', 'Preencha o e-mail e a senha para entrar.');
      return;
    }
    // Futuramente a API real entra aqui
    setAutenticado(true);
  };

  const handleRegistrar = () => {
    if (!nome || !email || !localSenha || !telefone || !endereco) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }
    Alert.alert('Sucesso!', 'Conta criada com sucesso.');
    setAutenticado(true);
    setIsRegistrando(false);
  };

  const handleSalvar = () => {
    Alert.alert('Sucesso', 'Dados atualizados globalmente!');
  };

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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Ionicons name={info.icone as any} size={80} color={COLORS.primary} />
          <Text style={styles.title}>{info.titulo}</Text>
          <Text style={styles.subtitle}>{info.subtitulo}</Text>
        </View>

        <View style={styles.form}>
          
          {/* BLOCO 1: USUÁRIO AUTENTICADO */}
          {autenticado && (
            <>
              {/*isAdmin &&*/ setAbaAtiva && (
                <TouchableOpacity 
                  style={styles.adminBtn} 
                  onPress={() => setAbaAtiva('Admin')} 
                  activeOpacity={0.8}
                >
                  <Ionicons name="settings" size={20} color="#FFF" style={{ marginRight: 8 }} />
                  <Text style={styles.primaryBtnText}>Painel de Gestão (Admin)</Text>
                </TouchableOpacity>
              )}

              <Text style={styles.label}>Nome Completo</Text>
              <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Seu nome" placeholderTextColor={COLORS.textSecondary} />

              <Text style={styles.label}>WhatsApp / Telefone</Text>
              <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" placeholder="(79) 90000-0000" placeholderTextColor={COLORS.textSecondary}/>

              <Text style={styles.label}>Endereço de Entrega Principal</Text>
              <TextInput style={styles.input} value={endereco} onChangeText={setEndereco} placeholder="Rua, Número, Bairro - Aracaju" placeholderTextColor={COLORS.textSecondary} />

              <TouchableOpacity style={styles.primaryBtn} onPress={handleSalvar} activeOpacity={0.8}>
                <Text style={styles.primaryBtnText}>Salvar Alterações</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.logoutBtn} onPress={() => {
                setAutenticado(false);
                logout(); 
              }}>
                <Text style={styles.logoutBtnText}>Sair da conta</Text>
              </TouchableOpacity>
            </>
          )}

          {/* BLOCO 2: LOGIN */}
          {!autenticado && !isRegistrando && (
            <>
              <Text style={styles.label}>E-mail</Text>
              <TextInput style={styles.input} placeholder="seu@email.com" placeholderTextColor={COLORS.textSecondary} keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />

              <Text style={styles.label}>Senha</Text>
              <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor={COLORS.textSecondary} secureTextEntry value={localSenha} onChangeText={setLocalSenha} />

              <TouchableOpacity style={styles.primaryBtn} onPress={handleEntrar} activeOpacity={0.8}>
                <Text style={styles.primaryBtnText}>Entrar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryBtn} onPress={() => setIsRegistrando(true)}>
                <Text style={styles.secondaryBtnText}>Criar nova conta</Text>
              </TouchableOpacity>
            </>
          )}

          {/* BLOCO 3: REGISTRO */}
          {!autenticado && isRegistrando && (
            <>
              <Text style={styles.label}>Nome Completo</Text>
              <TextInput style={styles.input} placeholder="Ex: João Vitor" placeholderTextColor={COLORS.textSecondary} value={nome} onChangeText={setNome} />

              <Text style={styles.label}>E-mail</Text>
              <TextInput style={styles.input} placeholder="seu@email.com" placeholderTextColor={COLORS.textSecondary} keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />

              <Text style={styles.label}>Senha</Text>
              <TextInput style={styles.input} placeholder="Crie uma senha segura" placeholderTextColor={COLORS.textSecondary} secureTextEntry value={localSenha} onChangeText={setLocalSenha} />

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
  scrollContent: { paddingBottom: 40 },
  header: { alignItems: 'center', paddingTop: 40, paddingBottom: 30, borderBottomWidth: 1, borderColor: '#222' },
  title: { color: COLORS.text, fontSize: 24, fontWeight: 'bold', marginTop: 16 },
  subtitle: { color: COLORS.textSecondary, fontSize: 13, marginTop: 4, textAlign: 'center', paddingHorizontal: 40 },
  form: { padding: SPACING.lg },
  label: { color: COLORS.text, fontSize: 14, fontWeight: 'bold', marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: COLORS.surface, color: COLORS.text, borderRadius: 12, padding: 16, fontSize: 15, borderWidth: 1, borderColor: '#333' },
  primaryBtn: { backgroundColor: COLORS.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 32 },
  primaryBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  adminBtn: { backgroundColor: '#3b82f6', flexDirection: 'row', padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  secondaryBtn: { padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  secondaryBtnText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 16 },
  logoutBtn: { padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  logoutBtnText: { color: COLORS.error, fontWeight: 'bold', fontSize: 16 },
});