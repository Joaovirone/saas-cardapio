package com.saas_cardapio.app.controller;

import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.saas_cardapio.app.dto.PedidoRequestDto;
import com.saas_cardapio.app.dto.PedidoResponseDto;
import com.saas_cardapio.app.service.PedidoService;

import jakarta.ws.rs.core.Response;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.*;


@RestController
@RequestMapping("/pedidos")
@AllArgsConstructor
public class PedidoController {

    private final PedidoService pedidoService;


    @PostMapping
    public ResponseEntity<PedidoResponseDto> criarPedido(@RequestBody PedidoRequestDto pedidoRequest) {
        PedidoResponseDto response = pedidoService.processarPedido(pedidoRequest);
        return ResponseEntity.status(HttpStatusCode.valueOf(201)).body(response);
    }

    @GetMapping()
    public ResponseEntity<List<PedidoResponseDto>> listarPedidos() {
        return ResponseEntity.ok(pedidoService.listarPedidos());
    }
    

    @PatchMapping("/{pedidoId}/status")
    public ResponseEntity<Void> atualizarStatusPedido(@PathVariable String pedidoId, @RequestParam String novoStatus) {
        pedidoService.atualizarStatusPedido(pedidoId, novoStatus);
        return ResponseEntity.noContent().build();
    }


    
}
