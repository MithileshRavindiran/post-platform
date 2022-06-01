package com.myorg.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ScannedDevice {

    private int deviceId;

    private String location;
}
