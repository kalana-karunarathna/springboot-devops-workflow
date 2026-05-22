package com.fms.notifications;

public class MarkAllReadResponse {

    private long updatedCount;

    public MarkAllReadResponse(long updatedCount) {
        this.updatedCount = updatedCount;
    }

    public long getUpdatedCount() {
        return updatedCount;
    }
}
