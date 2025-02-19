/**
 * Maintains history of package status updates.
 * @class
 */
class ShipmentHistory {
    /**
     * Creates a new ShipmentHistory instance.
     */
    constructor() {
        this.entries = [];
    }

    /**
     * Adds a new entry to the shipment history.
     * @param {StatusUpdate} entry - The status update entry
     */
    addEntry(entry) {
        this.entries.push(entry);
    }

    /**
     * Gets all history entries.
     * @returns {StatusUpdate[]} Array of status updates
     */
    getEntries() {
        return [...this.entries];
    }
}

export default ShipmentHistory; 