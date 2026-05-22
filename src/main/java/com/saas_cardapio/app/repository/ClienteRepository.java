package com.saas_cardapio.app.repository;

import com.saas_cardapio.app.entity.Cliente;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.PutItemRequest;
import software.amazon.awssdk.services.dynamodb.model.ScanRequest;
import software.amazon.awssdk.services.dynamodb.model.ScanResponse;

import java.util.HashMap;
import java.util.Map;

@Repository
public class ClienteRepository {

    private final DynamoDbClient dynamoDbClient;
    private final String tableName;

    public ClienteRepository(
            DynamoDbClient dynamoDbClient, 
            @Value("${aws.dynamodb.table.clientes:Clientes}") String tableName) {
        this.dynamoDbClient = dynamoDbClient;
        this.tableName = tableName;
    }

    public void salvar(Cliente cliente) {
        Map<String, AttributeValue> item = new HashMap<>();

        item.put("id", AttributeValue.builder().s(cliente.getId() != null ? cliente.getId() : java.util.UUID.randomUUID().toString()).build());
        item.put("nome", AttributeValue.builder().s(cliente.getNome()).build());
        item.put("email", AttributeValue.builder().s(cliente.getEmail()).build());
        item.put("senha", AttributeValue.builder().s(cliente.getSenha()).build());
        
        // Salvamos a role diretamente (Se usar o Enum, basta chamar cliente.getRole().name())
        item.put("role", AttributeValue.builder().s(cliente.getRole()).build()); 
        
        if (cliente.getTelefone() != null) {
            item.put("telefone", AttributeValue.builder().s(cliente.getTelefone()).build());
        }

        PutItemRequest putItemRequest = PutItemRequest.builder()
                .tableName(tableName)
                .item(item)
                .build();

        dynamoDbClient.putItem(putItemRequest);
        System.out.println("Cliente " + cliente.getEmail() + " salvo no DynamoDB.");
    }

    public Cliente buscarPorEmail(String email) {
        // No DynamoDB, buscar por um atributo que não é a chave (como o e-mail) exige um Scan com filtro.
        // Em um cenário de produção em larga escala, o ideal seria criar um GSI (Global Secondary Index) para o e-mail.
        Map<String, AttributeValue> valoresFiltro = new HashMap<>();
        valoresFiltro.put(":emailProcurado", AttributeValue.builder().s(email).build());

        ScanRequest scanRequest = ScanRequest.builder()
                .tableName(tableName)
                .filterExpression("email = :emailProcurado")
                .expressionAttributeValues(valoresFiltro)
                .build();

        ScanResponse scanResponse = dynamoDbClient.scan(scanRequest);

        if (scanResponse.items().isEmpty()) {
            return null; // Não encontrou ninguém com este e-mail
        }

        return converterMapaParaCliente(scanResponse.items().get(0));
    }

    private Cliente converterMapaParaCliente(Map<String, AttributeValue> item) {
        if (item == null || item.isEmpty()) return null;

        Cliente cliente = new Cliente();
        cliente.setId(item.get("id") != null ? item.get("id").s() : null);
        cliente.setNome(item.get("nome") != null ? item.get("nome").s() : null);
        cliente.setEmail(item.get("email") != null ? item.get("email").s() : null);
        cliente.setSenha(item.get("senha") != null ? item.get("senha").s() : null);
        cliente.setRole(item.get("role") != null ? item.get("role").s() : "USER");
        cliente.setTelefone(item.get("telefone") != null ? item.get("telefone").s() : null);

        return cliente;
    }
}