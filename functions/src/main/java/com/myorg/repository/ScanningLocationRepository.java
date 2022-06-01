package com.myorg.repository;

import com.myorg.response.ResultSetMapper;
import com.myorg.response.ScannedDevice;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Map;

public class ScanningLocationRepository {

    private Connection connection;

    public ScanningLocationRepository(Connection connection) {
        this.connection = connection;
    }

    public boolean  update(Map<String, Object> detail) throws SQLException {
        try {
            connection.setAutoCommit(false);
            PreparedStatement preparedStatement = connection.prepareStatement(CustomDBQueries.GET_SCANNED_CONTAINER_INFORMATION);
            getPreparedStatement(preparedStatement, detail);
            ResultSet resultSet = preparedStatement.executeQuery();
            ScannedDevice device = resultSet.next()
                    ? ResultSetMapper.mapResultSetToScannedDevices(resultSet)
                    : null;

            int deviceUpdate;

            if(device != null) {
                preparedStatement = connection.prepareStatement(CustomDBQueries.UPDATE_SCANNED_CONTAINER_INFORMATION);
                updateScannedDevicePreparedStatement(detail, preparedStatement);
                deviceUpdate = preparedStatement.executeUpdate();
            } else {
                preparedStatement = connection.prepareStatement(CustomDBQueries.INSERT_SCANNED_CONTAINER_INFORMATION);
                insertPreparedStatement(preparedStatement, detail);
                deviceUpdate = preparedStatement.executeUpdate();
            }

            connection.commit();
            return deviceUpdate > 0 ;
        } catch (SQLException e) {
            connection.rollback();
            throw new RuntimeException("Exception Occurred while Updating the Max Deposit Limit", e);
        }finally {
            connection.setAutoCommit(true);
        }
    }

    private void updateScannedDevicePreparedStatement(Map<String, Object> detail, PreparedStatement preparedStatement) throws SQLException {
        preparedStatement.setQueryTimeout(2);//This value is in seconds
        preparedStatement.setString(1, detail.get("Languagae").toString());
        preparedStatement.setInt(2, Integer.valueOf(detail.get("UserId").toString()));
    }


    private void insertPreparedStatement(PreparedStatement preparedStatement, Map<String, Object> detail) throws SQLException {
        preparedStatement.setQueryTimeout(2);//This value is in seconds
        preparedStatement.setInt(1, Integer.valueOf(detail.get("UserId").toString()));
        preparedStatement.setString(2, detail.get("Languagae").toString());
    }

    private void getPreparedStatement(PreparedStatement preparedStatement, Map<String, Object> detail) throws SQLException {
        preparedStatement.setQueryTimeout(2);//This value is in seconds
        preparedStatement.setInt(1, Integer.valueOf(detail.get("UserId").toString()));
    }
}
