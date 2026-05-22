package com.saas_cardapio.app.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/healthcheck")
public class ApiHealthcheck {
    
    @Operation(summary = "Verificar o status da API", description = "Endpoint para verificar se a API está funcionando corretamente. Retorna uma mensagem de status.")
    @GetMapping("/status")
    public String status() {
        return "API funcionando normalmente no ambiente!!!!!!!!!";
    }
}
