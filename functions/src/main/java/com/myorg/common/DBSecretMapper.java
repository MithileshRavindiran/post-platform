package com.myorg.common;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueResponse;

import java.util.Optional;

public class DBSecretMapper {

    private final static Gson gson = new GsonBuilder().create();

    private DBSecretMapper(){}

    public static DbSecretProperties mapGetSecretValueResponseToDbSecretProps(GetSecretValueResponse secretValueResponse){
        try {

            return Optional.ofNullable(secretValueResponse)
                    .map(secret -> gson.fromJson(secret.secretString(), DbSecretProperties.class))
                    .orElseThrow(() ->
                            new RuntimeException("Invalid SecretValueResponse Provided"));
        }
        catch(Exception e) {
            //TODO log the exception
            throw e;
        }
    }
}