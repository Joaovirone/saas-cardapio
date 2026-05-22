import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, StyleSheet, Alert, ScrollView } from 'react-native';
import { api } from '../services/api'; // Sua instância do Axios

export default function CadastrarProdutoScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [categoria, setCategoria] = useState('');
  const [disponivel, setDisponivel] = useState(true);

  const handleCadastrar = async () => {
    // Validação básica no front-end
    if (!nome || !preco) {
      Alert.alert('Erro', 'Nome e preço são obrigatórios!');
      return;
    }

    // Montando o DTO idêntico ao ProdutoRequestDto do Java
    const payload = {
      nome,
      descricao,
      preco: parseFloat(preco.replace(',', '.')), // Garante que o Java receba um Double válido
      categoria,
      disponivel,
      adicionais: [] // Começa vazio, podemos adicionar depois
    };

    try {
      // O Axios dispara a requisição. 
      // IMPORTANTE: O token JWT do Admin já deve estar no cabeçalho (via Interceptor ou Context)
      await api.post('/produtos', payload);
      
      Alert.alert('Sucesso!', 'Lanche adicionado ao cardápio com sucesso.');
      navigation.goBack(); // Volta para a lista de produtos do admin
      
    } catch (error: any) {
      // Captura o nosso StandardErrorDto bonitinho do GlobalExceptionHandler
      const mensagemErro = error.response?.data?.message || 'Erro ao cadastrar o produto.';
      Alert.alert('Ops!', mensagemErro);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Novo Lanche</Text>

      <Text style={styles.label}>Nome do Produto *</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Ex: X-Bacon" />

      <Text style={styles.label}>Descrição</Text>
      <TextInput 
        style={[styles.input, styles.textArea]} 
        value={descricao} 
        onChangeText={setDescricao} 
        placeholder="Ingredientes do lanche..." 
        multiline 
      />

      <Text style={styles.label}>Preço (R$) *</Text>
      <TextInput 
        style={styles.input} 
        value={preco} 
        onChangeText={setPreco} 
        placeholder="Ex: 25,90" 
        keyboardType="numeric" 
      />

      <Text style={styles.label}>Categoria</Text>
      <TextInput style={styles.input} value={categoria} onChangeText={setCategoria} placeholder="Ex: Hambúrgueres" />

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Disponível para venda?</Text>
        <Switch value={disponivel} onValueChange={setDisponivel} />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleCadastrar}>
        <Text style={styles.buttonText}>Salvar no Cardápio</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  label: { fontSize: 16, marginBottom: 5, color: '#555' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 15 },
  textArea: { height: 100, textAlignVertical: 'top' },
  switchContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, marginTop: 10 },
  button: { backgroundColor: '#e74c3c', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});