package com.saas_cardapio.app.config;

import com.saas_cardapio.app.entity.Adicional;
import com.saas_cardapio.app.entity.Cliente;
import com.saas_cardapio.app.entity.Produto;
import com.saas_cardapio.app.repository.ClienteRepository;
import com.saas_cardapio.app.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.seeder.habilitado", havingValue = "true")
public class DataSeeder implements CommandLineRunner {

    private final ClienteRepository clienteRepository;
    private final ProdutoRepository produtoRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Iniciando o Data Seeding...");
        seedAdminUser();
        seedCardapioInicial();
        System.out.println("Data Seeding concluído!");
    }

    private void seedAdminUser() {
        String emailAdmin = "joao.admin@admin.com";
        
        // Verifica se o admin já existe para não duplicar toda vez que reiniciar o app
        if (clienteRepository.buscarPorEmail(emailAdmin) == null) {
            Cliente admin = new Cliente();
            admin.setNome("João Vitor (Admin)");
            admin.setEmail(emailAdmin);
            admin.setSenha(passwordEncoder.encode("admin123")); 
            admin.setRole("ADMIN"); // A permissão master que configuramos no SecurityConfig
            admin.setTelefone("79999999999"); // DDD de Sergipe pronto pro teste

            clienteRepository.salvar(admin);
            System.out.println("   -> Usuário ADMIN mestre criado com sucesso.");
        } else {
            System.out.println("   -> Usuário ADMIN já existe. Pulando criação.");
        }
    }

    private void seedCardapioInicial() {
        // Só insere os lanches de teste se o cardápio estiver completamente vazio
        if (produtoRepository.listarTodos().isEmpty()) {
            
            // 1. Criando o Duplo Smash Bacon
            Produto smash = new Produto();
            smash.setId(UUID.randomUUID().toString());
            smash.setNome("Duplo Smash Bacon");
            smash.setDescricao("Dois hambúrgueres prensados de 80g, muito bacon e queijo cheddar.");
            smash.setPreco(28.90);
            smash.setCategoria("Lanches");
            smash.setDisponivel(true);
            smash.setImageUrl("https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80");

            Adicional baconExtra = new Adicional();
            baconExtra.setId(UUID.randomUUID().toString());
            baconExtra.setNome("Bacon Extra");
            baconExtra.setPreco(5.00);
            
            smash.setAdicionais(new ArrayList<>(List.of(baconExtra)));
            produtoRepository.salvar(smash);

            // 2. Criando uma Bebida
            Produto refri = new Produto();
            refri.setId(UUID.randomUUID().toString());
            refri.setNome("Coca-Cola Lata");
            refri.setDescricao("Refrigerante em lata 350ml gelado.");
            refri.setPreco(6.00);
            refri.setCategoria("Bebidas");
            refri.setDisponivel(true);
            refri.setImageUrl("https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80");
            refri.setAdicionais(new ArrayList<>());
            
            produtoRepository.salvar(refri);

            // 3. Criando um Gelado
            Produto gelado = new Produto();
            gelado.setId(UUID.randomUUID().toString());
            gelado.setNome("Gelado de Coco");
            gelado.setDescricao("Porção de gelado cremoso de coco com raspas de chocolate.");
            gelado.setPreco(14.50);
            gelado.setCategoria("Gelados");
            gelado.setDisponivel(true);
            gelado.setImageUrl("https://images.unsplash.com/photo-1514516870925-8b80c4436fc9?auto=format&fit=crop&w=800&q=80");
            gelado.setAdicionais(new ArrayList<>());
            produtoRepository.salvar(gelado);

            // 4. Criando uma Sobremesa
            Produto brownie = new Produto();
            brownie.setId(UUID.randomUUID().toString());
            brownie.setNome("Brownie de Chocolate");
            brownie.setDescricao("Brownie quente com calda de chocolate e sorvete de baunilha.");
            brownie.setPreco(18.90);
            brownie.setCategoria("Sobremesas");
            brownie.setDisponivel(true);
            brownie.setImageUrl("https://images.unsplash.com/photo-1603023736191-cef28f9dbb13?auto=format&fit=crop&w=800&q=80");
            brownie.setAdicionais(new ArrayList<>());
            produtoRepository.salvar(brownie);

            System.out.println("   -> Cardápio inicial semeado com sucesso.");
        } else {
            System.out.println("   -> Cardápio já possui itens. Pulando criação.");
        }
    }
}