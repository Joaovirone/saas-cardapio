package com.saas_cardapio.app.repository;

import com.saas_cardapio.app.entity.ItemPedido;
import com.saas_cardapio.app.entity.Pedido;

import lombok.AllArgsConstructor;

import org.springframework.stereotype.Repository;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.PutItemRequest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Repository
@AllArgsConstructor
public class PedidoRepository {

    private final DynamoDbClient dynamoDbClient;
    private final String tableName = "Pedidos";


    public void salvar(Pedido pedido) {
        Map<String, AttributeValue> item = new HashMap<>();

        // 1. Mapeando os atributos simples (Strings e Números)
        item.put("id", AttributeValue.builder().s(pedido.getId()).build());
        item.put("clienteNome", AttributeValue.builder().s(pedido.getClienteNome()).build());
        item.put("telefone", AttributeValue.builder().s(pedido.getTelefone()).build());
        item.put("status", AttributeValue.builder().s(pedido.getStatus()).build());
        item.put("dataCriacao", AttributeValue.builder().s(pedido.getDataCriacao()).build());
        
        // No DynamoDB, números são salvos como Strings com o tipo 'n' (Number)
        item.put("valorTotal", AttributeValue.builder().n(String.valueOf(pedido.getValorTotal())).build());

        // 2. Mapeando a lista de itens complexos
        if (pedido.getItens() != null && !pedido.getItens().isEmpty()) {
            List<AttributeValue> itensMapeados = pedido.getItens().stream()
                    .map(this::mapearItemPedido)
                    .collect(Collectors.toList());
            
            // Salva como uma Lista ('l') de atributos
            item.put("itens", AttributeValue.builder().l(itensMapeados).build());
        }

        // 3. Montando a requisição e enviando para a nuvem
        PutItemRequest putItemRequest = PutItemRequest.builder()
                .tableName(tableName)
                .item(item)
                .build();

        System.out.println("Enviando pedido " + pedido.getId() + " para o DynamoDB...");
        dynamoDbClient.putItem(putItemRequest);
    }

    // Método auxiliar para converter o ItemPedido em um sub-mapa do DynamoDB
    private AttributeValue mapearItemPedido(ItemPedido itemPedido) {
        Map<String, AttributeValue> itemMap = new HashMap<>();
        itemMap.put("nome", AttributeValue.builder().s(itemPedido.getNome()).build());
        itemMap.put("preco", AttributeValue.builder().n(String.valueOf(itemPedido.getPreco())).build());
        itemMap.put("quantidade", AttributeValue.builder().n(String.valueOf(itemPedido.getQuantidade())).build());
        
        // Retorna como um Mapa ('m')
        return AttributeValue.builder().m(itemMap).build();
    }
}