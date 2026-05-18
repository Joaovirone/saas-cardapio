package com.saas_cardapio.app.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.saas_cardapio.app.dto.PedidoRequest;
import com.saas_cardapio.app.dto.PedidoResponse;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@RestController
@RequestMapping("/pedidos")
@NoArgsConstructor
public class PedidoController {

    private final PedidoService pedidoService;


    @PostMapping
    public ResponseEntity<PedidoResponse> criarPedido(@RequestBody PedidoRequest pedidoRequest) {
        PedidoResponse response = pedidoService.criarPedido(pedidoRequest);
        return ResponseEntity.ok(response);
    }


    
}
