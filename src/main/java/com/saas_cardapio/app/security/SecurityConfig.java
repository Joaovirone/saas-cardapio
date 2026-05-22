package com.saas_cardapio.app.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtService jwtService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Desabilitado pois tokens JWT são imunes a CSRF
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // API 100% Stateless
            .authorizeHttpRequests(auth -> auth
                // Rotas Públicas (Qualquer cliente deslogado acessa)
                .requestMatchers(HttpMethod.GET, "/pedidos").permitAll()
                .requestMatchers(HttpMethod.POST, "/pedidos").permitAll() // Guest Checkout liberado
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll() // Swagger Liberado
                
                // Rotas Protegidas (Apenas o Dono/Admin da Lanchonete pode executar)
                .requestMatchers(HttpMethod.PATCH, "/pedidos/**/status").hasRole("ADMIN")
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                
                // Qualquer outra rota não mapeada exige login genérico
                .anyRequest().authenticated()
            )
            // Injeta o nosso filtro utilitário antes do filtro padrão de usuário e senha do Spring
            .addFilterBefore(new JwtAuthenticationFilter(jwtService), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Algoritmo robusto para encriptar as senhas no DynamoDB
    }
}