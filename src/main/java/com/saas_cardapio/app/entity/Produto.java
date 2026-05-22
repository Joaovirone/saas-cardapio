package com.saas_cardapio.app.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.ArrayList;

@Data
@NoArgsConstructor
public class Produto {

    private String id;
    private String nome;
    private String descricao;
    private Double preco;
    private String categoria;
    private String imageUrl;
    private boolean disponivel = true;

   
    private List<Adicional> adicionais = new ArrayList<>();

    public String getId() {
        return id;
    }
}