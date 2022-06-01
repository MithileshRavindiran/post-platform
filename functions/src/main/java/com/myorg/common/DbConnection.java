package com.myorg.common;

import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueResponse;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.security.GeneralSecurityException;
import java.security.KeyStore;
import java.security.cert.Certificate;
import java.security.cert.CertificateFactory;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

public class DbConnection {


    public static final String DB_PROXY_ENDPOINT_URL = "DB_PROXY_ENDPOINT";

    private DbConnection(){}

    private static final String DB_PREFIX= "jdbc:postgresql://";

    private static Connection connection;

    public static Connection getConnection() throws SQLException, GeneralSecurityException, IOException, URISyntaxException {
        if (connection != null && !connection.isClosed()) {
            return connection;
        }
        GetSecretValueResponse getSecretValueResponse = DbSecretLoader.getSecret();
        DbSecretProperties dbSecretProperties = DBSecretMapper.mapGetSecretValueResponseToDbSecretProps(getSecretValueResponse);
        String url =  assembleDBConnectionUrl(dbSecretProperties);
        Properties properties = DBPropsConfiguration.getDBPropertiesConfiguration(dbSecretProperties);
        connection = DriverManager.getConnection(url, properties);
        return connection;
    }


    private static String assembleDBConnectionUrl(DbSecretProperties dbSecretProperties){
        return DB_PREFIX + System.getenv(DB_PROXY_ENDPOINT_URL)  + "/" +
                dbSecretProperties.getDbname();
    }


}