package com.saas_cardapio.app.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.saas_cardapio.app.dto.LoginRequestDto;
import com.saas_cardapio.app.dto.RegistroRequestDto;
import com.saas_cardapio.app.dto.TokenResponseDto;
import com.saas_cardapio.app.entity.Cliente;
import com.saas_cardapio.app.repository.ClienteRepository;
import com.saas_cardapio.app.security.JwtService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    

    private final ClienteRepository clienteRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;


    @PostMapping("/registrar")
    public ResponseEntity<TokenResponseDto> registrarCliente(@RequestBody RegistroRequestDto request) {
      
        if (clienteRepository.buscarPorEmail(request.getEmail()) != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build(); // E-mail já em uso
        }

        Cliente novoCliente = new Cliente();
        novoCliente.setNome(request.getNome());
        novoCliente.setEmail(request.getEmail());
        novoCliente.setTelefone(request.getTelefone());
        

        novoCliente.setSenha(passwordEncoder.encode(request.getSenha()));
        
        novoCliente.setRole("USER"); 

        clienteRepository.salvar(novoCliente);

        // Gera o token de acesso imediato
        String token = jwtService.gerarToken(novoCliente.getEmail(), novoCliente.getRole());
        
        return ResponseEntity.ok(new TokenResponseDto(token));
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponseDto> login(@RequestBody LoginRequestDto request) {
        
        // 1. Busca o usuário pelo e-mail no DynamoDB
        Cliente cliente = clienteRepository.buscarPorEmail(request.getEmail());
        
        // 2. Valida se o usuário existe e se a senha bate com o Hash do banco
        if (cliente == null || !passwordEncoder.matches(request.getSenha(), cliente.getSenha())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 401 Credenciais inválidas
        }

        // 3. Se tudo estiver certo, gera o JWT contendo a Role (USER ou ADMIN)
        String token = jwtService.gerarToken(cliente.getEmail(), cliente.getRole());
        
        return ResponseEntity.ok(new TokenResponseDto(token));
    }
}

