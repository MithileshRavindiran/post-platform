package com.myorg.repository;

public class CustomDBQueries {

    private CustomDBQueries(){}


    public static final String GET_SCANNED_CONTAINER_INFORMATION = "select * from scan_devices where id =  ? ";

    public static final String UPDATE_SCANNED_CONTAINER_INFORMATION = "update scan_devices set " +
            "location = ? where id =  ? ";


    public static final String INSERT_SCANNED_CONTAINER_INFORMATION = "insert into scan_devices (id, location)" +
            "values (?, ?)";

}