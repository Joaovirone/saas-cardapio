# Ambiente local com Docker

## Subir API, DynamoDB Local e painel da cozinha

```bash
docker compose up --build
```

Servicos:

- API Spring Boot: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html
- DynamoDB Local: http://localhost:8000
- Painel cozinha/admin Next.js: http://localhost:3000

O Compose cria as tabelas `Pedidos`, `Produtos` e `Clientes` automaticamente quando a API sobe com `DYNAMODB_INITIALIZE_LOCAL=true`.

Com `APP_SEEDER_HABILITADO=true`, o ambiente local tambem cria:

- Admin: `joao.admin@admin.com`
- Senha: `admin123`
- Dois produtos iniciais para teste

## Subir tambem o app cliente em modo web

```bash
docker compose --profile mobile up --build
```

O app cliente web fica em http://localhost:19006.

## Parar e limpar volumes

```bash
docker compose down -v
```

O DynamoDB Local esta configurado em memoria para testes locais, entao os dados somem ao reiniciar o servico.
