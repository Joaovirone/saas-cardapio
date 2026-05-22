package com.saas_cardapio.app.repository;

import com.saas_cardapio.app.entity.Adicional;
import com.saas_cardapio.app.entity.Produto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Repository
public class ProdutoRepository {

    private final DynamoDbClient dynamoDbClient;
    private final String tableName;

    public ProdutoRepository(
            DynamoDbClient dynamoDbClient, 
            @Value("${aws.dynamodb.table.produtos:Produtos}") String tableName) {
        this.dynamoDbClient = dynamoDbClient;
        this.tableName = tableName;
    }

    public void salvar(Produto produto) {
        Map<String, AttributeValue> item = new HashMap<>();

        item.put("id", AttributeValue.builder().s(produto.getId() != null ? produto.getId() : java.util.UUID.randomUUID().toString()).build());
        item.put("nome", AttributeValue.builder().s(produto.getNome()).build());
        item.put("preco", AttributeValue.builder().n(String.valueOf(produto.getPreco())).build());
        item.put("disponivel", AttributeValue.builder().bool(produto.isDisponivel()).build());

        if (produto.getDescricao() != null) item.put("descricao", AttributeValue.builder().s(produto.getDescricao()).build());
        if (produto.getCategoria() != null) item.put("categoria", AttributeValue.builder().s(produto.getCategoria()).build());
        if (produto.getImageUrl() != null) item.put("imageUrl", AttributeValue.builder().s(produto.getImageUrl()).build());

        if (produto.getAdicionais() != null && !produto.getAdicionais().isEmpty()) {
            List<AttributeValue> listaMapeada = produto.getAdicionais().stream()
                    .map(this::mapearAdicional)
                    .collect(Collectors.toList());
            item.put("adicionais", AttributeValue.builder().l(listaMapeada).build());
        } else {
            item.put("adicionais", AttributeValue.builder().l(new ArrayList<>()).build());
        }

        PutItemRequest putItemRequest = PutItemRequest.builder().tableName(tableName).item(item).build();
        dynamoDbClient.putItem(putItemRequest);
    }

    public Produto buscarPorId(String id) {
        Map<String, AttributeValue> chave = new HashMap<>();
        chave.put("id", AttributeValue.builder().s(id).build());

        GetItemRequest getItemRequest = GetItemRequest.builder().tableName(tableName).key(chave).build();
        GetItemResponse response = dynamoDbClient.getItem(getItemRequest);

        if (!response.hasItem()) return null;
        return converterMapaParaProduto(response.item());
    }

    public List<Produto> listarTodos() {
        ScanRequest scanRequest = ScanRequest.builder().tableName(tableName).build();
        ScanResponse scanResponse = dynamoDbClient.scan(scanRequest);
        return scanResponse.items().stream()
                .map(item -> converterMapaParaProduto(item))
                .collect(Collectors.toList());
    }

    public void deletar(String id) {
        Map<String, AttributeValue> chave = new HashMap<>();
        chave.put("id", AttributeValue.builder().s(id).build());

        DeleteItemRequest deleteItemRequest = DeleteItemRequest.builder().tableName(tableName).key(chave).build();
        dynamoDbClient.deleteItem(deleteItemRequest);
    }

    // Método auxiliar para o Service buscar preço por nome (manteve a assinatura anterior)
    public double buscarPrecoPorNome(String nomeProduto) {
        Map<String, AttributeValue> valoresFiltro = new HashMap<>();
        valoresFiltro.put(":nome", AttributeValue.builder().s(nomeProduto).build());

        ScanRequest scanRequest = ScanRequest.builder()
                .tableName(tableName)
                .filterExpression("nome = :nome")
                .expressionAttributeValues(valoresFiltro)
                .build();

        ScanResponse response = dynamoDbClient.scan(scanRequest);
        if (response.items().isEmpty()) return 15.00; // Fallback de segurança se o produto sumir

        return Double.parseDouble(response.items().get(0).get("preco").n());
    }

    private AttributeValue mapearAdicional(Adicional adicional) {
        Map<String, AttributeValue> mapa = new HashMap<>();
        mapa.put("id", AttributeValue.builder().s(adicional.getId()).build());
        mapa.put("nome", AttributeValue.builder().s(adicional.getNome()).build());
        mapa.put("preco", AttributeValue.builder().n(String.valueOf(adicional.getPreco())).build());
        return AttributeValue.builder().m(mapa).build();
    }

    private Produto converterMapaParaProduto(Map<String, AttributeValue> item) {
        if (item == null || item.isEmpty()) return null;

        Produto produto = new Produto();
        produto.setId(item.get("id") != null ? item.get("id").s() : null);
        produto.setNome(item.get("nome") != null ? item.get("nome").s() : "Produto Sem Nome");
        produto.setDescricao(item.get("descricao") != null ? item.get("descricao").s() : null);
        produto.setCategoria(item.get("categoria") != null ? item.get("categoria").s() : null);
        produto.setImageUrl(item.get("imageUrl") != null ? item.get("imageUrl").s() : null);
        produto.setDisponivel(item.get("disponivel") == null || item.get("disponivel").bool());

        if (item.get("preco") != null) produto.setPreco(Double.parseDouble(item.get("preco").n()));

        List<Adicional> listaAdicionais = new ArrayList<>();
        if (item.get("adicionais") != null && item.get("adicionais").hasL()) {
            for (AttributeValue val : item.get("adicionais").l()) {
                if (val.hasM()) {
                    Map<String, AttributeValue> mapaAdicional = val.m();
                    Adicional ad = new Adicional();
                    ad.setId(mapaAdicional.get("id") != null ? mapaAdicional.get("id").s() : null);
                    ad.setNome(mapaAdicional.get("nome") != null ? mapaAdicional.get("nome").s() : "");
                    if (mapaAdicional.get("preco") != null) ad.setPreco(Double.parseDouble(mapaAdicional.get("preco").n()));
                    listaAdicionais.add(ad);
                }
            }
        }
        produto.setAdicionais(listaAdicionais);
        return produto;
    }
}