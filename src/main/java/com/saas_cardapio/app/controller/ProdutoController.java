package com.saas_cardapio.app.controller;

import com.saas_cardapio.app.dto.AdicionalRequestDto;
import com.saas_cardapio.app.dto.ProdutoRequestDto;
import com.saas_cardapio.app.dto.ProdutoResponseDto;
import com.saas_cardapio.app.service.ProdutoService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/produtos")
@AllArgsConstructor
public class ProdutoController {

    private final ProdutoService produtoService;

    @Operation(summary = "Cadastrar um novo lanche no cardápio", description = "Cria um novo produto com seus respectivos adicionais embutidos.")
    @PostMapping
    public ResponseEntity<ProdutoResponseDto> criarProduto(@RequestBody ProdutoRequestDto request) {
        ProdutoResponseDto response = produtoService.criarProduto(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Listar todo o cardápio", description = "Retorna a lista completa de lanches e bebidas disponíveis para os clientes.")
    @GetMapping
    public ResponseEntity<List<ProdutoResponseDto>> listarCardapio() {
        return ResponseEntity.ok(produtoService.listarCardapio());
    }

    @Operation(summary = "Buscar detalhes de um lanche específico", description = "Retorna os dados completos de um lanche através de seu ID único.")
    @GetMapping("/{id}")
    public ResponseEntity<ProdutoResponseDto> buscarProdutoPorId(@PathVariable String id) {
        return ResponseEntity.ok(produtoService.buscarProdutoPorId(id));
    }

    @Operation(summary = "Atualizar dados de um produto", description = "Permite alterar nome, descrição, categoria ou preço do lanche.")
    @PutMapping("/{id}")
    public ResponseEntity<ProdutoResponseDto> atualizarProduto(@PathVariable String id, @RequestBody ProdutoRequestDto request) {
        return ResponseEntity.ok(produtoService.atualizarProduto(id, request));
    }

    @Operation(summary = "Remover um produto do cardápio", description = "Exclui permanentemente o lanche e todos os seus adicionais da base de dados.")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarProduto(@PathVariable String id) {
        produtoService.deletarProduto(id);
        return ResponseEntity.noContent().build();
    }

    // --- Endpoints de Manipulação de Ingredientes ---

    @Operation(summary = "Adicionar um ingrediente extra ao lanche", description = "Insere um novo adicional diretamente na lista embutida do produto especificado.")
    @PostMapping("/{id}/ingredientes")
    public ResponseEntity<ProdutoResponseDto> adicionarIngrediente(@PathVariable String id, @RequestBody AdicionalRequestDto ingrediente) {
        ProdutoResponseDto response = produtoService.adicionarIngrediente(id, ingrediente);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Remover um ingrediente extra do lanche", description = "Remove um ingrediente específico baseado no ID do adicional embutido.")
    @DeleteMapping("/{id}/ingredientes/{ingredienteId}")
    public ResponseEntity<ProdutoResponseDto> removerIngrediente(@PathVariable String id, @PathVariable String ingredienteId) {
        ProdutoResponseDto response = produtoService.removerIngrediente(id, ingredienteId);
        return ResponseEntity.ok(response);
    }
}