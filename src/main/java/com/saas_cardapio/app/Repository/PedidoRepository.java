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
// REMOVIDO: @AllArgsConstructor
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

        item.put("id", AttributeValue.builder().s(pedido.getId()).build());
        item.put("clienteNome", AttributeValue.builder().s(pedido.getClienteNome()).build());
        item.put("telefone", AttributeValue.builder().s(pedido.getTelefone()).build());
        item.put("status", AttributeValue.builder().s(pedido.getStatus()).build());
        item.put("dataCriacao", AttributeValue.builder().s(pedido.getDataCriacao()).build());
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