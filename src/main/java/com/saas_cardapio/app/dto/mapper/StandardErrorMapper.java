package com.saas_cardapio.app.dto.mapper;

import java.time.Instant;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import com.saas_cardapio.app.dto.StandardErrorDto;

@Component
public class StandardErrorMapper {
    
    public StandardErrorDto toDto(HttpStatus status, String message, String path) {
        
        return new StandardErrorDto(
            Instant.now(),
            status.value(),
            status.getReasonPhrase(),
            message,
            path
        );
                
        
       
       
    }
}
