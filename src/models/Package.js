import Address from './Address.js';
import Tag from './Tag.js';
import ShipmentHistory from './ShipmentHistory.js';
import StatusUpdate from './StatusUpdate.js';

/**
 * Represents a package in the tracking system.
 * @class
 */
class Package {
    /**
     * Creates a new Package instance.
     * @param {Object} data - Package initialization data
     * @param {string} data.trackingNumber - The package tracking number
     * @param {Carrier} data.carrier - The carrier handling the package
     * @param {string} data.sender - The package sender
     * @param {string} data.description - Package description
     * @param {Date|string} data.estimatedDeliveryDate - Expected delivery date
     */
    constructor(data) {
        this.trackingNumber = data.trackingNumber;
        this.carrier = data.carrier;
        this.sender = data.sender;
        this.description = data.description;
        this.status = 'In Transit';
        this.estimatedDeliveryDate = new Date(data.estimatedDeliveryDate);
        this.tags = [];
        this.trackingLink = data.carrier.generateTrackingLink(data.trackingNumber);
        this.contents = data.description || 'No description available';
        this.history = new ShipmentHistory();
    }

    /**
     * Adds a tag to the package.
     * @param {string} tagName - The tag to add
     */
    addTag(tagName) {
        if (!this.tags.includes(tagName)) {
            this.tags.push(tagName);
        }
    }

    /**
     * Removes a tag from the package.
     * @param {string} tagName - The tag to remove
     */
    removeTag(tagName) {
        this.tags = this.tags.filter(t => t !== tagName);
    }

    /**
     * Updates the package status and records it in history.
     * @param {string} newStatus - The new status
     */
    updateStatus(newStatus) {
        this.status = newStatus;
        this.history.addEntry(new StatusUpdate(newStatus, new Date()));
    }

    updateInternationalStatus(customsStatus) {
        this.customsStatus = customsStatus;
        if (this.carrier instanceof InternationalCarrier) {
            this.internationalTracking.estimatedCustomsTime = 
                this.carrier.getEstimatedCustomsClearance(this.internationalTracking.destinationCountry);
        }
    }

    /**
     * Gets the package contents and details.
     * @returns {Object} Package details including description, sender, status, etc.
     */
    getContents() {
        return {
            description: this.description,
            sender: this.sender,
            status: this.status,
            estimatedDelivery: this.estimatedDeliveryDate,
            tags: this.tags,
            trackingLink: this.trackingLink
        };
    }
}

export default Package; 