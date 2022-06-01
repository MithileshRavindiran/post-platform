package com.myorg.common;

import java.util.Properties;

public class DBPropsConfiguration {

    public static final String ENABLE_SSL_PROPERTY_VALUE = "true";
    public static final String SSL_FACTORY_VALUE = "org.postgresql.ssl.DefaultJavaSSLFactory";
    private static final String USER = "user";
    private static final String PASSWORD = "password";
    private static final String LOGIN_TIMEOUT = "loginTimeout";
    private static final String SOCKET_TIMEOUT = "socketTimeout";
    public static final String ENABLE_SSL_PROPERTY_KEY = "ssl";
    public static final String SSLMODE = "sslmode";
    public static final String SSL_MODE_VERIFY_FULL = "verify-ca";
    public static final String SSLFACTORY = "sslfactory";

    private DBPropsConfiguration(){}

    public static Properties getDBPropertiesConfiguration(DbSecretProperties dbSecretProperties){
        Properties properties = new Properties();
        properties.setProperty(USER, dbSecretProperties.getUsername());
        properties.setProperty(PASSWORD, dbSecretProperties.getPassword());
        properties.setProperty(LOGIN_TIMEOUT, "5"); //Value is in seconds
        properties.setProperty(SOCKET_TIMEOUT, "5"); //Value is in seconds
        properties.setProperty(ENABLE_SSL_PROPERTY_KEY,ENABLE_SSL_PROPERTY_VALUE);
        properties.setProperty(SSLMODE, SSL_MODE_VERIFY_FULL);
        properties.setProperty(SSLFACTORY, SSL_FACTORY_VALUE);
        return properties;
    }
}
