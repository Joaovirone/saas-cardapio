package com.saas_cardapio.app.entity;

import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@DynamoDbBean
public class Cliente {

    private String id; 
    private String nome;
    private String email;
    private String senha;
    private String telefone;
    private String endereco;
    private String cep;

    @DynamoDbPartitionKey
    public String getId() {
        return id;
    }
}
