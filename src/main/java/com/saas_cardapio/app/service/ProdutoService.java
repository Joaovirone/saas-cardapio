package com.saas_cardapio.app.service;

import com.saas_cardapio.app.dto.AdicionalRequestDto;
import com.saas_cardapio.app.dto.ProdutoRequestDto;
import com.saas_cardapio.app.dto.ProdutoResponseDto;
import com.saas_cardapio.app.dto.mapper.AdicionalMapper;
import com.saas_cardapio.app.dto.mapper.ProdutoMapper;
import com.saas_cardapio.app.entity.Adicional;
import com.saas_cardapio.app.entity.Produto;
import com.saas_cardapio.app.repository.ProdutoRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ProdutoService {

    private final ProdutoRepository produtoRepository;
    private final ProdutoMapper produtoMapper;
    private final AdicionalMapper adicionalMapper; // Injetado aqui para uso direto

    public ProdutoResponseDto criarProduto(ProdutoRequestDto requestDto) {
        if (requestDto.getNome() == null || requestDto.getNome().isBlank()) {
            throw new IllegalArgumentException("O nome do produto não pode ser vazio.");
        }
        
        Produto novoProduto = produtoMapper.toProduto(requestDto);
        novoProduto.setId(UUID.randomUUID().toString());

        produtoRepository.salvar(novoProduto);
        return produtoMapper.toProdutoResponseDto(novoProduto);
    }

    public List<ProdutoResponseDto> listarCardapio() {
        return produtoRepository.listarTodos().stream()
                .map(produtoMapper::toProdutoResponseDto)
                .collect(Collectors.toList());
    }

    public ProdutoResponseDto buscarProdutoPorId(String id) {
        Produto produto = produtoRepository.buscarPorId(id);
        if (produto == null) throw new IllegalArgumentException("Produto não encontrado.");
        
        return produtoMapper.toProdutoResponseDto(produto);
    }

    public ProdutoResponseDto atualizarProduto(String id, ProdutoRequestDto requestDto) {
        Produto produto = produtoRepository.buscarPorId(id);
        if (produto == null) throw new IllegalArgumentException("Produto não encontrado.");

        produto.setNome(requestDto.getNome());
        produto.setDescricao(requestDto.getDescricao());
        produto.setPreco(requestDto.getPreco());
        produto.setCategoria(requestDto.getCategoria());
        produto.setImageUrl(requestDto.getImageUrl());
        if (requestDto.getDisponivel() != null) produto.setDisponivel(requestDto.getDisponivel());

        produtoRepository.salvar(produto);
        return produtoMapper.toProdutoResponseDto(produto);
    }

    public void deletarProduto(String id) {
        if (produtoRepository.buscarPorId(id) == null) {
            throw new IllegalArgumentException("Produto não encontrado.");
        }
        produtoRepository.deletar(id);
    }

    // --- Usando o AdicionalMapper diretamente nas rotas granulares ---

    public ProdutoResponseDto adicionarIngrediente(String produtoId, AdicionalRequestDto ingredienteDto) {
        Produto produto = produtoRepository.buscarPorId(produtoId);
        if (produto == null) throw new IllegalArgumentException("Produto não encontrado.");

        // Usa o AdicionalMapper solto aqui!
        Adicional novoAdicional = adicionalMapper.toAdicional(ingredienteDto); 
        produto.getAdicionais().add(novoAdicional);

        produtoRepository.salvar(produto);
        return produtoMapper.toProdutoResponseDto(produto);
    }

    public ProdutoResponseDto removerIngrediente(String produtoId, String ingredienteId) {
        Produto produto = produtoRepository.buscarPorId(produtoId);
        if (produto == null) throw new IllegalArgumentException("Produto não encontrado.");

        boolean removido = produto.getAdicionais().removeIf(ad -> ad.getId().equals(ingredienteId));
        if (!removido) throw new IllegalArgumentException("Ingrediente não encontrado.");

        produtoRepository.salvar(produto);
        return produtoMapper.toProdutoResponseDto(produto);
    }
}