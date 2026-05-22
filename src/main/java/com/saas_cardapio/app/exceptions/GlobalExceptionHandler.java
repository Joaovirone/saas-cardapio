package com.saas_cardapio.app.exceptions;

import com.saas_cardapio.app.dto.StandardErrorDto;
import com.saas_cardapio.app.dto.mapper.StandardErrorMapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {

    private final StandardErrorMapper errorMapper;

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<StandardErrorDto> handleIllegalArgument(IllegalArgumentException e, HttpServletRequest request) {
        
        HttpStatus status = HttpStatus.BAD_REQUEST;
        if (e.getMessage() != null && e.getMessage().contains("Credenciais")) {
            status = HttpStatus.UNAUTHORIZED;
        }

        StandardErrorDto error = errorMapper.toDto(status, e.getMessage(), request.getRequestURI());
        return ResponseEntity.status(status).body(error);
    }

    @ExceptionHandler(org.springframework.security.access.AccessDeniedException.class)
    public ResponseEntity<StandardErrorDto> handleAccessDenied(Exception e, HttpServletRequest request) {
        HttpStatus status = HttpStatus.FORBIDDEN;
        
        StandardErrorDto error = errorMapper.toDto(
                status, 
                "Você não tem permissão para acessar este recurso.", 
                request.getRequestURI()
        );
        
        return ResponseEntity.status(status).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<StandardErrorDto> handleGenericException(Exception e, HttpServletRequest request) {
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        
        StandardErrorDto error = errorMapper.toDto(
                status, 
                "Ocorreu um erro inesperado no servidor. Tente novamente mais tarde.", 
                request.getRequestURI()
        );

        e.printStackTrace(); // Log para debug interno na AWS
        
        return ResponseEntity.status(status).body(error);
    }
}