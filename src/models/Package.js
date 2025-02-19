import Address from './Address.js';
import Tag from './Tag.js';
import ShipmentHistory from './ShipmentHistory.js';
import StatusUpdate from './StatusUpdate.js';

/**
 * Represents a package in the tracking system.
 * @class
 */
class Package {
    // Define status types as static constants
    static STATUS_TYPES = {
        IN_TRANSIT: 'In Transit',
        DELIVERED: 'Delivered',
        OUT_FOR_DELIVERY: 'Out for Delivery',
        ARRIVING_SOON: 'Arriving Soon',
        DELAYED: 'Delayed',
        EXCEPTION: 'Exception'
    };

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
        // Default status is IN_TRANSIT
        this.status = Package.STATUS_TYPES.IN_TRANSIT;
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
     * @param {string} newStatus - Must be one of Package.STATUS_TYPES
     * @throws {Error} If invalid status type
     */
    updateStatus(newStatus) {
        if (!Object.values(Package.STATUS_TYPES).includes(newStatus)) {
            throw new Error(`Invalid status. Must be one of: ${Object.values(Package.STATUS_TYPES).join(', ')}`);
        }
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