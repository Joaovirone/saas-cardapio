package com.saas_cardapio.app.dto.mapper;

import org.springframework.stereotype.Component;

import com.saas_cardapio.app.dto.TokenResponseDto;

@Component
public class TokenMapper {
        
    public TokenResponseDto toDto(String token) {
        if (token == null) return null;
        
        TokenResponseDto dto = new TokenResponseDto(token);
        dto.setToken(token);
        return dto;
    }
}
