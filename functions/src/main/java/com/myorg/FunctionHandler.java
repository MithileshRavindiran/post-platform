package com.myorg;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.ScheduledEvent;

public class FunctionHandler implements RequestHandler<ScheduledEvent, String> {


    @Override
    public String handleRequest(ScheduledEvent scheduledEvent, Context context) {
        System.out.println(scheduledEvent);
        return "Hello World";
    }
}
