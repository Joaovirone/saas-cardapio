package com.saas_cardapio.app.repository;

import com.saas_cardapio.app.entity.ItemPedido;
import com.saas_cardapio.app.entity.Pedido;
import org.springframework.beans.factory.annotation.Value; // Import crucial do Spring
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeAction;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.PutItemRequest;
import software.amazon.awssdk.services.dynamodb.model.ScanRequest;
import software.amazon.awssdk.services.dynamodb.model.ScanResponse;
import software.amazon.awssdk.services.dynamodb.model.UpdateItemRequest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Repository
public class PedidoRepository {

    private final DynamoDbClient dynamoDbClient;
    private final String tableName; 

    public PedidoRepository(
            DynamoDbClient dynamoDbClient, @Value("${aws.dynamodb.table.pedidos:Pedidos}") String tableName) {
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

    public List<Pedido> listarPedidosAtivos(){

        ScanRequest scanRequest = ScanRequest.builder()
                .tableName(tableName)
                .build();
        
                ScanResponse scanResponse = dynamoDbClient.scan(scanRequest);

                return mapearParaListaDePedidos(scanResponse.items());
    }


    public void atualizarStatusPedido(String pedidoId, String novoStatus) {

        Map<String, AttributeValue> chave = new HashMap<>();
        chave.put("id", AttributeValue.builder().s(pedidoId).build());

        // Correção 1: O tipo do Map muda para AttributeValueUpdate
        Map<String, software.amazon.awssdk.services.dynamodb.model.AttributeValueUpdate> atualizacoes = new HashMap<>();
        
        // Correção 2: Construção correta do AttributeValueUpdate
        atualizacoes.put("status", software.amazon.awssdk.services.dynamodb.model.AttributeValueUpdate.builder()
                        .value(AttributeValue.builder().s(novoStatus).build())
                        .action(AttributeAction.PUT)
                        .build());

        UpdateItemRequest updateItemRequest = UpdateItemRequest.builder()
                .tableName(tableName)
                .key(chave)
                .attributeUpdates(atualizacoes)
                .build();   

        dynamoDbClient.updateItem(updateItemRequest);
        System.out.println("Status do pedido " + pedidoId + " atualizado para " + novoStatus);
    }

    private Pedido converterMapaParaPedido(Map<String, AttributeValue> item) {
        if (item == null || item.isEmpty()) return null;

        Pedido pedido = new Pedido();
        pedido.setId(item.get("id") != null ? item.get("id").s() : null);
        pedido.setClienteNome(item.get("clienteNome") != null ? item.get("clienteNome").s() : "Anônimo");
        pedido.setTelefone(item.get("telefone") != null ? item.get("telefone").s() : "Não informado");
        pedido.setStatus(item.get("status") != null ? item.get("status").s() : "RECEBIDO");
        pedido.setDataCriacao(item.get("dataCriacao") != null ? item.get("dataCriacao").s() : null);
        
        if (item.get("valorTotal") != null) {
            pedido.setValorTotal(Double.parseDouble(item.get("valorTotal").n()));
        }

        if (item.get("itens") != null && item.get("itens").hasL()) {
            List<ItemPedido> listaItens = new ArrayList<>();
            for (AttributeValue val : item.get("itens").l()) {
                if (val.hasM()) {
                    Map<String, AttributeValue> mapaItem = val.m();
                    ItemPedido ip = new ItemPedido();
                    ip.setNome(mapaItem.get("nome") != null ? mapaItem.get("nome").s() : "");
                    if (mapaItem.get("preco") != null) ip.setPreco(Double.parseDouble(mapaItem.get("preco").n()));
                    if (mapaItem.get("quantidade") != null) ip.setQuantidade(Integer.parseInt(mapaItem.get("quantidade").n()));
                    listaItens.add(ip);
                }
            }
            pedido.setItens(listaItens);
        }

        return pedido;
    }


    // 2. Adicione este método que estava faltando para o Scan funcionar
    private List<Pedido> mapearParaListaDePedidos(List<Map<String, AttributeValue>> items) {
        return items.stream()
                .map(item -> converterMapaParaPedido(item))
                .collect(Collectors.toList());
    }

    



}


