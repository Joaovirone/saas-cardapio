package com.saas_cardapio.app.service;


import com.saas_cardapio.app.dto.LoginRequestDto;
import com.saas_cardapio.app.dto.RegistroRequestDto;
import com.saas_cardapio.app.dto.TokenResponseDto;
import com.saas_cardapio.app.dto.mapper.RegistroMapper;
import com.saas_cardapio.app.dto.mapper.TokenMapper;
import com.saas_cardapio.app.entity.Cliente;
import com.saas_cardapio.app.repository.ClienteRepository;
import com.saas_cardapio.app.security.JwtService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final ClienteRepository clienteRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    
    private final RegistroMapper registroMapper;
    private final TokenMapper tokenMapper;

    public TokenResponseDto registrar(RegistroRequestDto request) {
        if (clienteRepository.buscarPorEmail(request.getEmail()) != null) {
            throw new IllegalArgumentException("Este e-mail já está em uso.");
        }

        Cliente novoCliente = registroMapper.toCliente(request);
  
        novoCliente.setSenha(passwordEncoder.encode(request.getSenha()));
        novoCliente.setRole("USER"); 

        clienteRepository.salvar(novoCliente);

        String token = jwtService.gerarToken(novoCliente.getEmail(), novoCliente.getRole());
        return tokenMapper.toDto(token);
    }

    public TokenResponseDto login(LoginRequestDto request) {

        Cliente cliente = clienteRepository.buscarPorEmail(request.getEmail());

        if (cliente == null || !passwordEncoder.matches(request.getSenha(), cliente.getSenha())) {
            throw new IllegalArgumentException("Credenciais inválidas."); 
        }

        String token = jwtService.gerarToken(cliente.getEmail(), cliente.getRole());
        return tokenMapper.toDto(token);
    }
}