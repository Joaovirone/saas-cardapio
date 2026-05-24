package com.saas_cardapio.app.security;

import lombok.RequiredArgsConstructor;

import java.util.List;

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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) 
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/v3/api-docs/**", 
                        "/swagger-ui/**", 
                        "/swagger-ui.html", 
                        "/swagger-resources/**",
                        "/webjars/**",
                        "/api/healthcheck/**").permitAll()
                .requestMatchers("/auth/registrar", "/auth/login").permitAll()
                .requestMatchers(HttpMethod.GET, "/pedidos").permitAll()
                .requestMatchers(HttpMethod.POST, "/pedidos").permitAll()
                .requestMatchers(HttpMethod.GET, "/produtos/**").permitAll()
                .requestMatchers(HttpMethod.PATCH, "/pedidos/**/status").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/produtos/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/produtos/**").hasRole("ADMIN")  
                .requestMatchers(HttpMethod.DELETE, "/produtos/**").hasRole("ADMIN")

            
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // em produção é necessário trocar pelo domínio do site real (frontend e etc, site - web)
        configuration.setAllowedOriginPatterns(List.of("*")); 

        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); 
        return source;
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); 
    }
}
