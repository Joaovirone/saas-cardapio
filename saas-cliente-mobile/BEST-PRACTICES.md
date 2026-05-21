# 📖 GUIA DE BOAS PRÁTICAS - SAAS CARDÁPIO MOBILE

## 🎯 Princípios de Desenvolvimento

### 1. **Reutilização de Componentes**
```tsx
✅ BOM - Componente reutilizável
export const Header: React.FC<HeaderProps> = (props) => { ... }

❌ RUIM - Lógica inline
return <View><Text>...específico...</Text></View>
```

### 2. **Separação de Responsabilidades**
```tsx
✅ BOM
- Componente: UI apenas
- Hook: Lógica de estado
- Serviço: Chamadas de API

❌ RUIM
- Componente fazendo tudo (render + lógica + API)
```

### 3. **Tipagem TypeScript**
```tsx
✅ BOM
interface HeaderProps {
  titulo: string;
  onPress: () => void;
}

❌ RUIM
const Header = (props: any) => { ... }
```

### 4. **Performance - useCallback**
```tsx
✅ BOM - Evita re-renders desnecessários
const handlePress = useCallback(() => {
  // lógica
}, [dependências]);

❌ RUIM - Recria função a cada render
const handlePress = () => {
  // lógica
};
```

---

## 📝 Checklist para Novo Componente

Ao criar um novo componente, siga este checklist:

```
□ Criar arquivo em src/components/NomeComponente.tsx
□ Definir interface Props com JSDoc
□ Implementar componente com React.FC<Props>
□ Usar COLORS, SPACING, TYPOGRAPHY do tema
□ Adicionar estilos com StyleSheet.create()
□ Adicionar export em src/index.ts
□ Documentar propTypes/props
□ Testar em múltiplas resoluções
□ Adicionar exemplo em EXEMPLOS.md
```

---

## 🎨 Exemplo de Novo Componente

```tsx
// src/components/MeuComponente.tsx

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';

/**
 * Props do componente MeuComponente
 * @property titulo - Texto exibido
 * @property onPress - Callback ao pressionar
 */
interface MeuComponenteProps {
  titulo: string;
  onPress: () => void;
}

/**
 * Componente MeuComponente
 * Descrição breve do que faz
 * 
 * @example
 * <MeuComponente 
 *   titulo="Clique aqui" 
 *   onPress={() => console.log('Clicado')}
 * />
 */
export const MeuComponente: React.FC<MeuComponenteProps> = ({
  titulo,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.titulo}>{titulo}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 8,
  },
  titulo: {
    color: COLORS.surface,
    fontSize: TYPOGRAPHY.md,
    fontWeight: '600',
    textAlign: 'center',
  },
});
```

---

## 🔧 Exemplo de Novo Hook

```tsx
// src/hooks/useMeuHook.ts

import { useState, useCallback, useEffect } from 'react';

/**
 * Hook customizado para gerenciar estado
 * @returns Objeto com state e ações
 */
export const useMeuHook = () => {
  const [dados, setDados] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);

    try {
      // Lógica aqui
      const resultado = await fetch('...');
      setDados(resultado);
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  return { dados, carregando, erro, carregar };
};
```

---

## 🔌 Exemplo de Novo Serviço

```tsx
// src/services/MeuServico.ts

import { api } from './api';

class MeuServicoClass {
  async buscarDados(): Promise<any[]> {
    try {
      const response = await api.get('/meu-endpoint');
      return response;
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      throw error;
    }
  }

  async criarDado(data: unknown): Promise<any> {
    try {
      const response = await api.post('/meu-endpoint', data);
      return response;
    } catch (error) {
      console.error('Erro ao criar dado:', error);
      throw error;
    }
  }
}

export const MeuServico = new MeuServicoClass();
```

---

## 📱 Padrões de Desenvolvimento

### 1. **Loading State**
```tsx
{carregando && <LoadingModal visivel mensagem="Carregando..." />}
```

### 2. **Empty State**
```tsx
{items.length === 0 && (
  <View style={styles.empty}>
    <Ionicons name="inbox" size={64} color={COLORS.textSecondary} />
    <Text>Nenhum item encontrado</Text>
  </View>
)}
```

### 3. **Error State**
```tsx
{erro && (
  <View style={styles.error}>
    <Text style={styles.errorText}>{erro}</Text>
    <TouchableOpacity onPress={retry}>
      <Text>Tentar Novamente</Text>
    </TouchableOpacity>
  </View>
)}
```

### 4. **Modal Pattern**
```tsx
<Modal
  visible={visible}
  animationType="slide"
  transparent={false}
  onRequestClose={onClose}
>
  {/* conteúdo */}
</Modal>
```

---

## 🧪 Testes

### Testar Componente Manualmente
```
1. Mudar para múltiplas resoluções (iPhone, Android)
2. Testar com valores extremos
3. Testar sem props obrigatórias
4. Testar estados (loading, error, empty)
5. Testar interações (press, scroll)
```

### Testar Hook
```tsx
// No console
const { dados } = useMeuHook();
console.log(dados);
```

### Testar Serviço
```tsx
// No console
await MeuServico.buscarDados()
  .then(d => console.log(d))
  .catch(e => console.error(e));
```

---

## ⚡ Performance

### 1. **Use useCallback para callbacks**
```tsx
const handlePress = useCallback(() => {
  // lógica
}, [dependências]);
```

### 2. **Use useMemo para cálculos pesados**
```tsx
const dados = useMemo(() => {
  return items.filter(...).sort(...);
}, [items]);
```

### 3. **Evite renderizar listas completas**
```tsx
✅ BOM - FlatList com virtualização
<FlatList data={items} renderItem={renderItem} />

❌ RUIM - ScrollView com maps
<ScrollView>{items.map(...)}</ScrollView>
```

### 4. **Use flexGrow para layouts**
```tsx
✅ BOM
<View style={{ flex: 1 }} />

❌ RUIM
<View style={{ height: 1000 }} />
```

---

## 🔐 Segurança

### 1. **Validar dados de entrada**
```tsx
if (!email || !email.includes('@')) {
  throw new Error('Email inválido');
}
```

### 2. **Não armazenar senhas locais**
```tsx
❌ RUIM
AsyncStorage.setItem('password', password);

✅ BOM
// Usar token JWT seguro
```

### 3. **Sanitizar URLs**
```tsx
const safeUrl = new URL(userUrl);
// Validar antes de usar
```

### 4. **HTTPS em produção**
```tsx
// Sempre usar HTTPS na API
EXPO_PUBLIC_API_URL=https://api.seu-dominio.com/api
```

---

## 🐛 Debugging

### Ferramentas
1. **Console.log** para valores simples
2. **Debugger** do VS Code
3. **React DevTools** para componentes
4. **Network tab** para requisições
5. **React Native Debugger** para state

### Técnicas
```tsx
// Adicionar logs estratégicos
console.group('Componente');
console.log('Props:', props);
console.log('State:', estado);
console.groupEnd();

// Usar ErrorBoundary
<ErrorBoundary fallback={<Error />}>
  <MeuComponente />
</ErrorBoundary>
```

---

## 📚 Recursos

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Docs](https://docs.expo.dev/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [React Hooks](https://react.dev/reference/react)

---

## ✨ Checklist Antes de Fazer Push

```
□ Código formatado e sem eslint errors
□ Sem console.log em produção
□ TypeScript sem erros
□ Todos os tipos definidos
□ Componentes documentados
□ Props validadas
□ Tratamento de erros implementado
□ Testado em múltiplas resoluções
□ Performance otimizada
□ Sem memory leaks
□ Assets otimizados
□ README atualizado
```

---

## 🚀 Deployment Checklist

```
□ Variáveis de ambiente configuradas
□ API URL correta (produção)
□ Sem dados sensíveis no código
□ Versão bumped (package.json)
□ Build testado localmente
□ Screenshots atualizadas
□ Changelog atualizado
□ Pronto para store (TestFlight, Play Store)
```

---

## 💡 Dicas Finais

1. **Comece simples**, complique depois
2. **Componentes pequenos** são melhores
3. **Props bem tipadas** poupam debug
4. **Reuse code** sempre que possível
5. **Teste frequentemente** durante desenvolvimento
6. **Documente** enquanto escreve
7. **Peça review** antes de fazer merge
8. **Mantenha** o código limpo

---

**Happy Coding! 🎉**
