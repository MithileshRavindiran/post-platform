package com.myorg.service;

import com.amazonaws.services.lambda.runtime.events.ScheduledEvent;
import com.myorg.repository.ScanningLocationRepository;

import java.sql.SQLException;

public class ScanningLocationService {

    private final ScanningLocationRepository scanningLocationRepository;

    public ScanningLocationService(ScanningLocationRepository scanningLocationRepository) {
        this.scanningLocationRepository = scanningLocationRepository;
    }

    public boolean updateLocation(ScheduledEvent scheduledEvent) throws SQLException {
        return scanningLocationRepository.update(scheduledEvent.getDetail());
    }
}
