package com.myorg.response;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import static com.myorg.common.DBColumnName.ID;
import static com.myorg.common.DBColumnName.LOCATION;

public class ResultSetMapper {

    public static ScannedDevice mapResultSetToScannedDevices(ResultSet scannedDeviceResultSet) throws SQLException {

        return ScannedDevice.builder()
                .deviceId(scannedDeviceResultSet.getInt(ID))
                .location(scannedDeviceResultSet.getString(LOCATION))
                .build();
    }


    public static List<String> mapResultSetToList(ResultSet customerIbanResultSet, String fieldName) throws SQLException {
        List<String> list = new ArrayList<>();
        while (customerIbanResultSet.next()) {
            list.add(customerIbanResultSet.getString(fieldName));
        }
        return list;
    }
}