package com.saas_cardapio.app.config;

import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;

@Configuration
@OpenAPIDefinition(
    info = @io.swagger.v3.oas.annotations.info.Info(
        title = "API de Pedidos do Cardápio",
        version = "1.0",
        description = "API para gerenciamento de pedidos do cardápio",
        contact = @io.swagger.v3.oas.annotations.info.Contact(
            name = "João Vitor - Joãovirone",
            email = "jovmamikl@gmail.com"
        )
    ),
 
    security = @SecurityRequirement(name = "bearerAuth") 
)

@SecurityScheme(
    name = "bearerAuth",
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT"
)
public class SwaggerConfig {
    
}
