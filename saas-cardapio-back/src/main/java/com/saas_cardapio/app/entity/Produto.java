package com.saas_cardapio.app.entity;

import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.ArrayList;

@Data
@NoArgsConstructor
@DynamoDbBean
public class Produto {

    private String id;
    private String nome;
    private String descricao;
    private Double preco;
    private String categoria;
    private String imageUrl;
    private boolean disponivel = true;

    // Fica tudo gravado no mesmo documento na AWS!
    private List<Adicional> adicionais = new ArrayList<>();

    @DynamoDbPartitionKey
    public String getId() {
        return id;
    }
}