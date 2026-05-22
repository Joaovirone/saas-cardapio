package com.saas_cardapio.app.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;
        final String userRole;

        // Se não houver cabeçalho Authorization começando com "Bearer ", deixa a requisição passar para o próximo filtro
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7); // Remove a palavra "Bearer " para isolar o token
        try {
            userEmail = jwtService.extrairEmail(jwt);
            userRole = jwtService.extrairRole(jwt);

            // Se encontrou o e-mail e o usuário ainda não está autenticado no contexto atual
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                
                // Criamos a autoridade baseada na Role vinda do Token (ex: ROLE_ADMIN)
                SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + userRole.toUpperCase());
                
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userEmail, null, List.of(authority)
                );

                // injeta o usuário autenticado dentro do contexto do Spring Security
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        } catch (Exception e) {
            // Em caso de token corrompido ou expirado, o contexto não é preenchido e a API retornará 403
            System.err.println("Erro ao validar token JWT: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}