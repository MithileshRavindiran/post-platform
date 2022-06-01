package com.myorg.common;

import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.secretsmanager.SecretsManagerClient;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueRequest;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueResponse;

import java.util.Optional;

public class DbSecretLoader {

    private static final String AWS_REGION = "AWS_REGION";
    private static final String DB_SECRET_ID = "DB_SECRET_ID";

    private DbSecretLoader(){}

    public static GetSecretValueResponse getSecret() {
        SecretsManagerClient client = SecretsManagerClient.builder().region(Region.of(System.getenv(AWS_REGION))).build();
        try {
            GetSecretValueRequest getSecretValueRequest = GetSecretValueRequest.builder()
                    .secretId(System.getenv(DB_SECRET_ID))
                    .build();
            return Optional.ofNullable(client.getSecretValue(getSecretValueRequest)).orElseThrow(() ->
                    new RuntimeException("Secret could not be retrieved"));
        } catch (Exception e) {
            //TODO log error;
            throw e;
        }
    }
}