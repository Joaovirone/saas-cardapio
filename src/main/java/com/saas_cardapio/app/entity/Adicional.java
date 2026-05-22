package com.saas_cardapio.app.entity;

import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@DynamoDbBean
public class Adicional {
    private String id;
    private String nome;
    private Double preco;
}