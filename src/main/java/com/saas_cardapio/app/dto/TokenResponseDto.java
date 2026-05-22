package com.saas_cardapio.app.dto;

import lombok.Data;

@Data
public class TokenResponseDto {

    private String token;
    public TokenResponseDto(String token) 
    
    { this.token = token; }
}
