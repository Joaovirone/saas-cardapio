package com.saas_cardapio.app.controller;

import org.springframework.context.annotation.Description;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*; // O asterisco importa o @PathVariable, @GetMapping, etc.

import com.saas_cardapio.app.dto.PedidoRequestDto;
import com.saas_cardapio.app.dto.PedidoResponseDto;
import com.saas_cardapio.app.service.PedidoService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/pedidos")
@AllArgsConstructor
public class PedidoController {

    private final PedidoService pedidoService;

    @Operation(summary = "Criar um novo pedido", description = "Processa um novo pedido e retorna os detalhes do pedido criado.")
    @PostMapping
    public ResponseEntity<PedidoResponseDto> criarPedido(@RequestBody PedidoRequestDto pedidoRequest) {
        PedidoResponseDto response = pedidoService.processarPedido(pedidoRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response); 
    }

    @Operation(summary = "Listar todos os pedidos", description = "Retorna uma lista de todos os pedidos processados.")
    @GetMapping
    public ResponseEntity<List<PedidoResponseDto>> listarPedidos() {
        return ResponseEntity.ok(pedidoService.listarPedidos());
    }

    @Operation(summary = "Atualizar o status de um pedido", description = "Permite atualizar o status de um pedido existente.") 
    @PatchMapping("/{pedidoId}/status")
    public ResponseEntity<Void> atualizarStatusPedido(
            @PathVariable String pedidoId, // Agora o Spring sabe de onde pegar essa variável!
            @RequestParam String novoStatus) {
        
        pedidoService.atualizarStatusPedido(pedidoId, novoStatus);
        return ResponseEntity.noContent().build();
    }
}