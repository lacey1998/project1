/**
 * Represents a status update in the shipment history.
 * @class
 */
class StatusUpdate {
    /**
     * Creates a new StatusUpdate instance.
     * @param {string} status - The new status
     * @param {Date} timestamp - When the status was updated
     */
    constructor(status, timestamp) {
        this.status = status;
        this.timestamp = timestamp;
    }
}

export default StatusUpdate; 