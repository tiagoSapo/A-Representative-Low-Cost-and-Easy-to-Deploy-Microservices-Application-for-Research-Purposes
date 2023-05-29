package com.example.demo.grpc.utils;

import com.google.protobuf.Timestamp;
import java.time.Instant;

public class Utils {

    public static Timestamp toProtoTimestamp(Instant instant) {
        return Timestamp.newBuilder()
                .setSeconds(instant.getEpochSecond())
                .setNanos(instant.getNano())
                .build();
    }

}
