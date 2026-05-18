package com.saas_cardapio.app.dto;

import java.util.*;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class PedidoRequestDto  {

    String nomeCliente;
    String telefone;
    List<ItemRequestDto> itens;
}

