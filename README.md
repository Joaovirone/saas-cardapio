# SaaS Cardapio

Plataforma full stack para digitalizar o fluxo de pedidos de um estabelecimento, conectando cliente, administracao e cozinha em uma unica aplicacao.

O projeto possui um aplicativo cliente, um painel administrativo e uma API REST. O fluxo principal vai da consulta do cardapio e montagem do carrinho ate o preparo e a retirada do pedido.

## Visao geral

```text
Aplicativo cliente (Expo / React Native)
		  |
		  v
	  API Spring Boot / Java 21
		  |
		  v
	     DynamoDB
		  ^
		  |
Painel admin e cozinha (Next.js)
```

No ambiente local, o Docker Compose inicia a API, o DynamoDB Local, o painel administrativo e, opcionalmente, a versao web do aplicativo cliente.

## Funcionalidades

### Aplicativo cliente

- Consulta do cardapio
- Busca por nome e descricao
- Filtro por categoria
- Visualizacao de detalhes e adicionais
- Carrinho de compras
- Alteracao de quantidades e observacoes
- Criacao de pedidos
- Visualizacao de pedidos e perfil do cliente

### Painel administrativo

- Autenticacao de administradores
- Cadastro, edicao e exclusao de produtos
- Controle de preco e disponibilidade
- Organizacao por categorias
- Indicadores do cardapio
- Visualizacao dos pedidos

### Operacao da cozinha

Os pedidos podem ser movimentados pelo fluxo:

```text
RECEBIDO -> EM_PREPARO -> PRONTO
```

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Backend | Java 21, Spring Boot 3, Spring Security, JWT |
| API | Spring Web, Swagger/OpenAPI |
| Persistencia | Amazon DynamoDB e DynamoDB Local |
| Painel web | Next.js, React, TypeScript, Tailwind CSS |
| Aplicativo | React Native, Expo, React Native Web |
| Infraestrutura | Docker, Docker Compose, AWS Lambda, API Gateway |
| Entrega | Maven, Serverless Framework, GitHub Actions |
| Qualidade | JUnit, Mockito e testes automatizados no pipeline |

## Requisitos

- Docker e Docker Compose
- Java 21 para executar o Maven fora do container
- Node.js 20 ou superior para executar os frontends fora do container

## Executando localmente

O ambiente local exige uma chave JWT e credenciais de demonstracao definidas no ambiente. Esses valores nao devem ser reutilizados em producao.

```bash
export JWT_SECRET="gere-uma-chave-local-com-pelo-menos-32-caracteres"
export APP_ADMIN_EMAIL="admin@localhost.test"
export APP_ADMIN_PASSWORD="defina-uma-senha-local-forte"
docker compose up --build
```

Servicos disponiveis:

| Servico | Endereco |
| --- | --- |
| Painel administrativo | http://localhost:3000 |
| API | http://localhost:8080 |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| DynamoDB Local | http://localhost:8000 |

Para iniciar tambem o aplicativo cliente em modo web:

```bash
docker compose --profile mobile up --build
```

O aplicativo cliente web fica disponivel em http://localhost:19006.

Para encerrar os containers e remover os volumes locais:

```bash
docker compose down -v
```

O DynamoDB Local usa memoria durante o desenvolvimento. Por isso, os dados sao perdidos quando o volume e removido ou quando o ambiente e reiniciado conforme a configuracao local.

## API

Principais endpoints:

| Metodo | Endpoint | Descricao |
| --- | --- | --- |
| POST | `/auth/registrar` | Registra um cliente |
| POST | `/auth/login` | Autentica cliente ou administrador |
| GET | `/produtos` | Lista o cardapio |
| POST | `/produtos` | Cria um produto, somente admin |
| PUT | `/produtos/{id}` | Atualiza um produto, somente admin |
| DELETE | `/produtos/{id}` | Remove um produto, somente admin |
| POST | `/pedidos` | Cria um pedido |
| GET | `/pedidos` | Lista pedidos |
| PATCH | `/pedidos/{id}/status` | Atualiza o status, somente admin |

A documentacao interativa da API esta disponivel no Swagger quando o backend estiver em execucao.

## Testes

Para executar os testes do backend:

```bash
./mvnw test
```

Os testes cobrem regras de pedidos, calculo do valor total, validacoes, cadastro de produtos e gerenciamento de adicionais.

Para validar o painel web:

```bash
cd saas-cardapio-cozinha-front
npm install
npm run lint
npm run build
```

Para executar o aplicativo cliente fora do Docker:

```bash
cd saas-cliente-mobile
npm install
npm run web
```

## Deploy

O backend possui configuracao para AWS Lambda e API Gateway por meio do Serverless Framework. O workflow em `.github/workflows/deploy.yml` executa os testes antes da etapa de deploy.

As credenciais da AWS devem ser cadastradas exclusivamente como secrets do GitHub Actions. Nunca coloque access keys, tokens, senhas ou chaves JWT diretamente no codigo, no workflow ou em arquivos versionados.

## Seguranca para uso publico

Este projeto foi preparado para demonstracao e estudo. Antes de disponibilizar uma instancia publicamente:

- Gere uma nova chave JWT e use HTTPS.
- Defina uma senha administrativa exclusiva para a instancia.
- Revise as regras de CORS e exponha somente os servicos necessarios.
- Restrinja as permissoes IAM ao menor escopo possivel.
- Configure as credenciais da AWS como secrets, nunca como texto no repositorio.
- Remova ou reescreva do historico Git qualquer segredo que tenha sido versionado anteriormente.
- Nao use credenciais de demonstracao em ambientes reais.

## Status do projeto

O fluxo principal de cadastro de produtos, consulta do cardapio, criacao de pedidos e movimentacao dos pedidos na cozinha esta implementado e coberto por testes de servico no backend.

O projeto continua aberto a evolucoes como notificacoes, atualizacao automatica de pedidos, melhorias de observabilidade e endurecimento da configuracao para producao.

## Licenca

Nenhuma licenca foi definida neste repositorio ate o momento. Defina uma licenca antes de declarar regras de uso, distribuicao ou contribuicao para terceiros.
