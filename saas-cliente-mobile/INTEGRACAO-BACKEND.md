# Integração com Backend - Chapa Quente

## 📋 Endpoints Esperados

O mobile espera que o backend implemente os seguintes endpoints:

### 1. **GET /api/produtos** - Listar todos os produtos

**Resposta (200 OK):**
```json
[
  {
    "id": "1",
    "nome": "Duplo Smash Bacon",
    "descricao": "Dois blends 90g, duplo cheddar cremoso, picles e muito bacon artesanal.",
    "preco": 28.90,
    "categoria": "Lanches",
    "imageUrl": "https://...",
    "disponivel": true,
    "ativo": true
  },
  {
    "id": "2",
    "nome": "Classic Burger",
    "descricao": "Pão brioche, blend 150g, queijo prato derretido, alface crespa e tomate.",
    "preco": 22.50,
    "categoria": "Lanches",
    "imageUrl": "https://...",
    "disponivel": true,
    "ativo": true
  }
]
```

**Status de Erro (500):**
```json
{
  "erro": "Erro ao carregar produtos",
  "mensagem": "Detalhes do erro"
}
```

---

### 2. **POST /api/pedidos** - Criar novo pedido

**Request Body:**
```json
{
  "items": [
    {
      "produtoId": "1",
      "quantidade": 2,
      "observacoes": "Sem cebola"
    },
    {
      "produtoId": "3",
      "quantidade": 1,
      "observacoes": null
    }
  ],
  "observacoesGerais": "Entregar rápido!"
}
```

**Resposta (201 Created):**
```json
{
  "id": "PED-123456",
  "items": [
    {
      "produtoId": "1",
      "quantidade": 2,
      "preco": 28.90,
      "observacoes": "Sem cebola"
    },
    {
      "produtoId": "3",
      "quantidade": 1,
      "preco": 6.00,
      "observacoes": null
    }
  ],
  "total": 63.80,
  "status": "pendente",
  "dataPedido": "2025-05-21T10:30:00Z"
}
```

**Status de Erro (400):**
```json
{
  "erro": "Validação falhou",
  "mensagem": "Items array está vazio"
}
```

---

### 3. **GET /api/pedidos/:id** - Buscar status do pedido

**Resposta (200 OK):**
```json
{
  "id": "PED-123456",
  "items": [
    {
      "produtoId": "1",
      "quantidade": 2,
      "preco": 28.90,
      "observacoes": "Sem cebola"
    }
  ],
  "total": 63.80,
  "status": "preparando",
  "dataPedido": "2025-05-21T10:30:00Z"
}
```

**Status Possíveis:**
- `pendente` - Pedido recebido, aguardando confirmação
- `confirmado` - Pedido confirmado
- `preparando` - Sendo preparado
- `pronto` - Pronto para entrega
- `entregue` - Entregue

---

## 🔧 Configuração da URL da API

No arquivo `.env` do mobile, configure:

```
EXPO_PUBLIC_API_URL=http://seu-dominio.com/api
```

Para desenvolvimento local:
```
EXPO_PUBLIC_API_URL=http://localhost:8080/api
```

---

## 📝 Implementação no Backend (Exemplo em Java/Spring)

### Estrutura de Classes

```java
// DTOs
@Data
public class ProdutoDto {
  private String id;
  private String nome;
  private String descricao;
  private BigDecimal preco;
  private String categoria;
  private String imageUrl;
  private boolean disponivel;
  private boolean ativo;
}

@Data
public class ItemPedidoDto {
  private String produtoId;
  private Integer quantidade;
  private String observacoes;
}

@Data
public class PedidoRequestDto {
  private List<ItemPedidoDto> items;
  private String observacoesGerais;
}

@Data
public class PedidoResponseDto {
  private String id;
  private List<ItemPedidoResponseDto> items;
  private BigDecimal total;
  private String status;
  private LocalDateTime dataPedido;
}
```

### Controller

```java
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class MobileController {

  @Autowired
  private ProdutoService produtoService;
  
  @Autowired
  private PedidoService pedidoService;

  @GetMapping("/produtos")
  public ResponseEntity<List<ProdutoDto>> listarProdutos() {
    return ResponseEntity.ok(produtoService.listarTodos());
  }

  @PostMapping("/pedidos")
  public ResponseEntity<PedidoResponseDto> criarPedido(
    @RequestBody PedidoRequestDto request
  ) {
    PedidoResponseDto resposta = pedidoService.criar(request);
    return ResponseEntity.status(201).body(resposta);
  }

  @GetMapping("/pedidos/{id}")
  public ResponseEntity<PedidoResponseDto> buscarPedido(@PathVariable String id) {
    return ResponseEntity.ok(pedidoService.buscarPorId(id));
  }
}
```

---

## 🔐 Segurança

### Headers Recomendados

Para proteger a API:

```
Content-Type: application/json
Access-Control-Allow-Origin: * (ou domínio específico)
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type
```

### Validações no Backend

- Validar quantidade (mínimo 1)
- Validar se produto existe e está disponível
- Validar se categoria existe
- Validar observações (máximo 500 caracteres)

---

## 📊 Fluxo de Dados

```
[MOBILE APP]
     ↓
     → GET /api/produtos
     ↓
[BACKEND API]
     ↓
[DATABASE]
     ↓
Retorna lista de produtos (JSON)
     ↓
[MOBILE APP - useProdutos()]
     ↓
Renderiza ProdutoCard para cada item
     ↓
Usuário seleciona itens e vai ao carrinho
     ↓
     → POST /api/pedidos
     ↓
[BACKEND API]
     ↓
Valida dados
     ↓
Cria pedido no banco
     ↓
Retorna PedidoResponseDto com ID
     ↓
[MOBILE APP - SucessoPedidoModal]
     ↓
Mostra número do pedido
```

---

## ⚡ Performance

### Boas Práticas

- **Paginação**: Para muitos produtos, implemente paginação
  ```
  GET /api/produtos?page=1&pageSize=20
  ```

- **Cache**: Cache produtos que não mudam frequentemente

- **Otimização de Imagens**: Retorne URLs de imagens otimizadas/redimensionadas

- **Timeouts**: Configure timeouts apropriados (15-30 segundos)

---

## 🧪 Testes

### Testar com Curl

```bash
# Listar produtos
curl -X GET http://localhost:8080/api/produtos \
  -H "Content-Type: application/json"

# Criar pedido
curl -X POST http://localhost:8080/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"produtoId": "1", "quantidade": 2}],
    "observacoesGerais": "teste"
  }'
```

### Testar com Postman

1. Importe a coleção de endpoints
2. Configure base URL: `http://localhost:8080/api`
3. Teste cada endpoint com dados de exemplo

---

## 🚀 Deploy

### Variáveis de Ambiente Recomendadas

```
API_PORT=8080
DATABASE_URL=jdbc:mysql://host:3306/cardapio
ENVIRONMENT=production
CORS_ORIGIN=https://seu-dominio.com
```

---

## 📞 Troubleshooting

### Erro: "API Error: 404"

- Verificar se o backend está rodando
- Verificar se a URL está correta no `.env`
- Verificar CORS no backend

### Erro: "Cannot GET /api/produtos"

- Certificar que o endpoint está implementado
- Verificar rota no controller
- Testar com Postman

### Erro: "Network Error"

- Verificar conectividade
- Verificar firewall
- Verificar se backend está respondendo

---

## 📚 Referências

- [React Native API Calls](https://reactnative.dev/docs/network)
- [Spring Boot REST APIs](https://spring.io/guides/gs/rest-service/)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
