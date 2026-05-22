package com.saas_cardapio.app.service;

import com.saas_cardapio.app.dto.AdicionalRequestDto;
import com.saas_cardapio.app.dto.ProdutoRequestDto;
import com.saas_cardapio.app.dto.ProdutoResponseDto;
import com.saas_cardapio.app.dto.mapper.AdicionalMapper;
import com.saas_cardapio.app.dto.mapper.ProdutoMapper;
import com.saas_cardapio.app.entity.Adicional;
import com.saas_cardapio.app.entity.Produto;
import com.saas_cardapio.app.repository.ProdutoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProdutoServiceTest {

    @Mock
    private ProdutoRepository produtoRepository;

    @Mock
    private ProdutoMapper produtoMapper;

    @Mock
    private AdicionalMapper adicionalMapper;

    @InjectMocks
    private ProdutoService produtoService;

    private ProdutoRequestDto produtoRequest;
    private Produto produtoEntidade;
    private ProdutoResponseDto produtoResponse;

    @BeforeEach
    void setUp() {
        // Inicialização de dados padrão para usar nos blocos "Arrange"
        produtoRequest = new ProdutoRequestDto();
        produtoRequest.setNome("Duplo Smash Bacon");
        produtoRequest.setPreco(28.90);
        produtoRequest.setDescricao("Dois hambúrgueres de 80g, muito bacon e queijo.");

        produtoEntidade = new Produto();
        produtoEntidade.setId("prod-123");
        produtoEntidade.setNome("Duplo Smash Bacon");
        produtoEntidade.setPreco(28.90);
        produtoEntidade.setAdicionais(new ArrayList<>());

        produtoResponse = new ProdutoResponseDto();
        produtoResponse.setId("prod-123");
        produtoResponse.setNome("Duplo Smash Bacon");
        produtoResponse.setPreco(28.90);
    }

    // =========================================================
    // TESTES DO CRUD CORE
    // =========================================================

    @Test
    void deveCriarProdutoComSucesso() {
        // Arrange
        when(produtoMapper.toProduto(produtoRequest)).thenReturn(produtoEntidade);
        when(produtoMapper.toProdutoResponseDto(produtoEntidade)).thenReturn(produtoResponse);

        // Act
        ProdutoResponseDto resultado = produtoService.criarProduto(produtoRequest);

        // Assert
        assertNotNull(resultado);
        assertEquals("Duplo Smash Bacon", resultado.getNome());
        assertEquals(28.90, resultado.getPreco());
        verify(produtoRepository, times(1)).salvar(produtoEntidade);
    }

    @Test
    void deveLancarExcecaoQuandoNomeDoProdutoForVazio() {
        // Arrange
        produtoRequest.setNome(""); // Cenário inválido

        // Act & Assert
        IllegalArgumentException excecao = assertThrows(IllegalArgumentException.class, () -> {
            produtoService.criarProduto(produtoRequest);
        });

        assertEquals("O nome do produto não pode ser vazio.", excecao.getMessage());
        verify(produtoRepository, never()).salvar(any());
    }

    @Test
    void deveBuscarProdutoPorIdComSucesso() {
        // Arrange
        when(produtoRepository.buscarPorId("prod-123")).thenReturn(produtoEntidade);
        when(produtoMapper.toProdutoResponseDto(produtoEntidade)).thenReturn(produtoResponse);

        // Act
        ProdutoResponseDto resultado = produtoService.buscarProdutoPorId("prod-123");

        // Assert
        assertNotNull(resultado);
        assertEquals("prod-123", resultado.getId());
    }

    @Test
    void deveLancarExcecaoQuandoProdutoNaoForEncontrado() {
        // Arrange
        when(produtoRepository.buscarPorId("id-inexistente")).thenReturn(null);

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            produtoService.buscarProdutoPorId("id-inexistente");
        });
    }

    // =========================================================
    // TESTES DE INGREDIENTES GRANULARES
    // =========================================================

    @Test
    void deveAdicionarIngredienteComSucesso() {
        // Arrange
        AdicionalRequestDto adicionalReq = new AdicionalRequestDto();
        adicionalReq.setNome("Cheddar Extra");
        adicionalReq.setPreco(4.50);

        Adicional adicionalEntidade = new Adicional();
        adicionalEntidade.setId("adic-999");
        adicionalEntidade.setNome("Cheddar Extra");
        adicionalEntidade.setPreco(4.50);

        when(produtoRepository.buscarPorId("prod-123")).thenReturn(produtoEntidade);
        when(adicionalMapper.toAdicional(adicionalReq)).thenReturn(adicionalEntidade);
        when(produtoMapper.toProdutoResponseDto(produtoEntidade)).thenReturn(produtoResponse);

        // Act
        ProdutoResponseDto resultado = produtoService.adicionarIngrediente("prod-123", adicionalReq);

        // Assert
        assertNotNull(resultado);
        assertEquals(1, produtoEntidade.getAdicionais().size());
        assertEquals("Cheddar Extra", produtoEntidade.getAdicionais().get(0).getNome());
        verify(produtoRepository, times(1)).salvar(produtoEntidade);
    }

    @Test
    void deveRemoverIngredienteComSucesso() {
        // Arrange
        Adicional ingredienteExistente = new Adicional();
        ingredienteExistente.setId("adic-888");
        ingredienteExistente.setNome("Cebola Caramelizada");
        
        // Coloca o ingrediente dentro da lista da entidade antes de rodar a remoção
        produtoEntidade.getAdicionais().add(ingredienteExistente);

        when(produtoRepository.buscarPorId("prod-123")).thenReturn(produtoEntidade);
        when(produtoMapper.toProdutoResponseDto(produtoEntidade)).thenReturn(produtoResponse);

        // Act
        ProdutoResponseDto resultado = produtoService.removerIngrediente("prod-123", "adic-888");

        // Assert
        assertNotNull(resultado);
        assertTrue(produtoEntidade.getAdicionais().isEmpty(), "A lista de adicionais deveria estar vazia.");
        verify(produtoRepository, times(1)).salvar(produtoEntidade);
    }

    @Test
    void deveLancarExcecaoAoRemoverIngredienteInexistente() {
        // Arrange
        when(produtoRepository.buscarPorId("prod-123")).thenReturn(produtoEntidade); // Lista vazia

        // Act & Assert
        IllegalArgumentException excecao = assertThrows(IllegalArgumentException.class, () -> {
            produtoService.removerIngrediente("prod-123", "id-qualquer");
        });

        assertEquals("Ingrediente não encontrado.", excecao.getMessage());
        verify(produtoRepository, never()).salvar(any());
    }
}