package com.saas_cardapio.app.repository;

import com.saas_cardapio.app.entity.ItemPedido;
import com.saas_cardapio.app.entity.Pedido;
import org.springframework.beans.factory.annotation.Value; // Import crucial do Spring
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.PutItemRequest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Repository
public class PedidoRepository {

    private final DynamoDbClient dynamoDbClient;
    private final String tableName; 

    public PedidoRepository(
            DynamoDbClient dynamoDbClient, @Value("${aws.dynamodb.table}") String tableName) {
        this.dynamoDbClient = dynamoDbClient;
        this.tableName = tableName;
    }

    public void salvar(Pedido pedido) {
        Map<String, AttributeValue> item = new HashMap<>();

        item.put("id", AttributeValue.builder().s(pedido.getId() != null ? pedido.getId() : java.util.UUID.randomUUID().toString()).build());
        
        String nome = (pedido.getClienteNome() != null && !pedido.getClienteNome().isBlank()) ? pedido.getClienteNome() : "Cliente Anônimo";
        String tel = (pedido.getTelefone() != null && !pedido.getTelefone().isBlank()) ? pedido.getTelefone() : "Não Informado";
        String status = (pedido.getStatus() != null && !pedido.getStatus().isBlank()) ? pedido.getStatus() : "RECEBIDO";
        String data = (pedido.getDataCriacao() != null && !pedido.getDataCriacao().isBlank()) ? pedido.getDataCriacao() : java.time.Instant.now().toString();

        item.put("clienteNome", AttributeValue.builder().s(nome).build());
        item.put("telefone", AttributeValue.builder().s(tel).build());
        item.put("status", AttributeValue.builder().s(status).build());
        item.put("dataCriacao", AttributeValue.builder().s(data).build());
        
        item.put("valorTotal", AttributeValue.builder().n(String.valueOf(pedido.getValorTotal())).build());

        if (pedido.getItens() != null && !pedido.getItens().isEmpty()) {
            List<AttributeValue> itensMapeados = pedido.getItens().stream()
                    .map(this::mapearItemPedido)
                    .collect(Collectors.toList());
            item.put("itens", AttributeValue.builder().l(itensMapeados).build());
        }

        PutItemRequest putItemRequest = PutItemRequest.builder()
                .tableName(tableName)
                .item(item)
                .build();

        System.out.println("Enviando pedido " + pedido.getId() + " para o DynamoDB...");
        dynamoDbClient.putItem(putItemRequest);
    }

    private AttributeValue mapearItemPedido(ItemPedido itemPedido) {
        Map<String, AttributeValue> itemMap = new HashMap<>();
        itemMap.put("nome", AttributeValue.builder().s(itemPedido.getNome()).build());
        itemMap.put("preco", AttributeValue.builder().n(String.valueOf(itemPedido.getPreco())).build());
        itemMap.put("quantidade", AttributeValue.builder().n(String.valueOf(itemPedido.getQuantidade())).build());
        return AttributeValue.builder().m(itemMap).build();
    }
}