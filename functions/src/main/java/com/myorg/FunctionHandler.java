package com.myorg;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.ScheduledEvent;
import com.myorg.common.DbConnection;
import com.myorg.repository.ScanningLocationRepository;
import com.myorg.service.ScanningLocationService;
import software.amazon.awssdk.http.HttpStatusCode;

public class FunctionHandler implements RequestHandler<ScheduledEvent, String> {


    @Override
    public String handleRequest(ScheduledEvent scheduledEvent, Context context) {
        var lambdaLogger =  context.getLogger();
        try {
            lambdaLogger.log(scheduledEvent.getDetail().toString());
            var scanningLocationService = new ScanningLocationService(new ScanningLocationRepository(DbConnection.getConnection()));
            scanningLocationService.updateLocation(scheduledEvent);
            return "Hello World";
        } catch (Exception ex) {
            lambdaLogger.log("Exception Occurred : " + ex.getMessage());
            return null;
        }
    }
}
