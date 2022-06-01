package com.myorg.common;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DbSecretProperties {

    private String username;
    private String password;
    private String host;
    private String engine;
    private String port;
    private String dbInstanceIdentifier;
    private String dbname;

}