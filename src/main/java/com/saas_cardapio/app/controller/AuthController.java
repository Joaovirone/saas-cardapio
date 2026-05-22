package com.saas_cardapio.app.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*; 

import com.saas_cardapio.app.dto.LoginRequestDto;
import com.saas_cardapio.app.dto.RegistroRequestDto;
import com.saas_cardapio.app.dto.TokenResponseDto;
import com.saas_cardapio.app.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "Registrar um novo cliente", description = "Cria uma conta de usuário padrão (USER) e retorna o token JWT de acesso.")
    @PostMapping("/registrar")
    public ResponseEntity<TokenResponseDto> registrarCliente(@RequestBody RegistroRequestDto request) {
        TokenResponseDto response = authService.registrar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Autenticar usuário", description = "Valida as credenciais do cliente ou administrador e retorna o token JWT de acesso.")
    @PostMapping("/login")
    public ResponseEntity<TokenResponseDto> login(@RequestBody LoginRequestDto request) {
        TokenResponseDto response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}