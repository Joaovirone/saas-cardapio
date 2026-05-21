package com.saas_cardapio.app.repository;

import org.springframework.stereotype.Repository;

@Repository
public class ProdutoRepository {

    public double buscarPrecoPorNome(String nomeProduto) {
        throw new UnsupportedOperationException("Integração com DynamoDB para Produtos ainda não implementada.");
    }
}