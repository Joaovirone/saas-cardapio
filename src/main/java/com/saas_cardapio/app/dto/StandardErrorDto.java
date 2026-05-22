package com.saas_cardapio.app.dto;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StandardErrorDto {
    private Instant timestamp; 
    private Integer status;    
    private String error;      
    private String message;    
    private String path;       
}
