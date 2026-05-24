package com.saas_cardapio.app.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeDefinition;
import software.amazon.awssdk.services.dynamodb.model.BillingMode;
import software.amazon.awssdk.services.dynamodb.model.CreateTableRequest;
import software.amazon.awssdk.services.dynamodb.model.DescribeTableRequest;
import software.amazon.awssdk.services.dynamodb.model.KeySchemaElement;
import software.amazon.awssdk.services.dynamodb.model.KeyType;
import software.amazon.awssdk.services.dynamodb.model.ResourceInUseException;
import software.amazon.awssdk.services.dynamodb.model.ScalarAttributeType;

@Component
@RequiredArgsConstructor
@Order(Ordered.HIGHEST_PRECEDENCE)
@ConditionalOnProperty(name = "aws.dynamodb.initialize-local", havingValue = "true")
public class DynamoDbTableInitializer implements CommandLineRunner {

    private final DynamoDbClient dynamoDbClient;

    @Value("${aws.dynamodb.table.pedidos:Pedidos}")
    private String pedidosTable;

    @Value("${aws.dynamodb.table.produtos:Produtos}")
    private String produtosTable;

    @Value("${aws.dynamodb.table.clientes:Clientes}")
    private String clientesTable;

    @Override
    public void run(String... args) {
        List.of(pedidosTable, produtosTable, clientesTable).forEach(this::createTableIfMissing);
    }

    private void createTableIfMissing(String tableName) {
        if (dynamoDbClient.listTables().tableNames().contains(tableName)) {
            return;
        }

        try {
            dynamoDbClient.createTable(CreateTableRequest.builder()
                    .tableName(tableName)
                    .billingMode(BillingMode.PAY_PER_REQUEST)
                    .attributeDefinitions(AttributeDefinition.builder()
                            .attributeName("id")
                            .attributeType(ScalarAttributeType.S)
                            .build())
                    .keySchema(KeySchemaElement.builder()
                            .attributeName("id")
                            .keyType(KeyType.HASH)
                            .build())
                    .build());

            dynamoDbClient.waiter().waitUntilTableExists(DescribeTableRequest.builder()
                    .tableName(tableName)
                    .build());
        } catch (ResourceInUseException ignored) {
            // Another local app instance created it first.
        }
    }
}
