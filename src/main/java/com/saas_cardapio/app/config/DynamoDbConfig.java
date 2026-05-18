package com.saas_cardapio.app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.http.urlconnection.UrlConnectionHttpClient;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;

@Configuration
public class DynamoDbConfig {
    

    @Bean
    public DynamoDbClient dynamoDbClient() {
        return DynamoDbClient.builder()
                    .region(Region.SA_EAST_1)
                    .credentialsProvider(DefaultCredentialsProvider.create())
                    .httpClient(UrlConnectionHttpClient.create())
                    .build();
    }
}
