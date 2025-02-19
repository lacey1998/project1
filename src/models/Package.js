import Address from './Address.js';
import Tag from './Tag.js';
import ShipmentHistory from './ShipmentHistory.js';
import StatusUpdate from './StatusUpdate.js';

class Package {
    constructor({ trackingNumber, carrier, sender, description, estimatedDeliveryDate }) {
        this.trackingNumber = trackingNumber;
        this.carrier = carrier; // Association with Carrier
        this.sender = new Address(sender); // Composition with Address
        this.description = description;
        this.estimatedDeliveryDate = new Date(estimatedDeliveryDate);
        this.status = 'In Transit';
        this.tags = []; // Aggregation with Tag objects
        this.trackingLink = carrier.generateTrackingLink(trackingNumber);
        this.history = new ShipmentHistory(); // Composition with ShipmentHistory
    }

    addTag(tagName) {
        const tag = new Tag(tagName);
        if (!this.tags.some(t => t.name === tag.name)) {
            this.tags.push(tag);
        }
    }

    removeTag(tagName) {
        this.tags = this.tags.filter(t => t.name !== tagName);
    }

    updateStatus(newStatus) {
        this.status = newStatus;
        this.history.addEntry(new StatusUpdate(newStatus, new Date()));
    }
}

export default Package; 