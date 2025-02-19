import Address from './Address.js';
import Tag from './Tag.js';
import ShipmentHistory from './ShipmentHistory.js';
import StatusUpdate from './StatusUpdate.js';

class Package {
    constructor({ trackingNumber, carrier, sender, description, estimatedDeliveryDate }) {
        this.trackingNumber = trackingNumber;
        this.carrier = carrier;
        this.sender = sender;
        this.description = description;
        this.estimatedDeliveryDate = new Date(estimatedDeliveryDate);
        this.status = 'In Transit';
        this.tags = [];
        this.trackingLink = carrier.generateTrackingLink(trackingNumber);
        this.contents = description || 'No description available';
        this.history = new ShipmentHistory(); // Composition with ShipmentHistory
    }

    addTag(tagName) {
        if (!this.tags.includes(tagName)) {
            this.tags.push(tagName);
        }
    }

    removeTag(tagName) {
        this.tags = this.tags.filter(t => t !== tagName);
    }

    updateStatus(newStatus) {
        this.status = newStatus;
        this.history.addEntry(new StatusUpdate(newStatus, new Date()));
    }

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