// Carrier class with configuration instead of inheritance
class Carrier {
    constructor(config) {
        this.name = config.name;
        this.trackingPattern = config.trackingPattern;
        this.trackingUrlTemplate = config.trackingUrlTemplate;
    }

    generateTrackingLink(trackingNumber) {
        return this.trackingUrlTemplate.replace('{trackingNumber}', trackingNumber);
    }

    validateTrackingNumber(trackingNumber) {
        return this.trackingPattern.test(trackingNumber);
    }
}

// Class to represent individual packages (Composition with Address)
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

// Value object for addresses (Composition with Package)
class Address {
    constructor(addressString) {
        const parts = this.parseAddress(addressString);
        this.name = parts.name || '';
        this.street = parts.street || '';
        this.city = parts.city || '';
        this.state = parts.state || '';
        this.zipCode = parts.zipCode || '';
    }

    parseAddress(addressString) {
        // Simplified parsing - in real implementation would be more sophisticated
        return {
            name: addressString,
            street: '',
            city: '',
            state: '',
            zipCode: ''
        };
    }

    toString() {
        return `${this.name}, ${this.street}, ${this.city}, ${this.state} ${this.zipCode}`;
    }
}

// Value object for tags (Aggregation with Package)
class Tag {
    constructor(name) {
        this.name = name.toLowerCase();
        this.createdAt = new Date();
    }
}

// Tracking history (Composition with Package)
class ShipmentHistory {
    constructor() {
        this.entries = [];
    }

    addEntry(entry) {
        this.entries.push(entry);
    }

    getEntries() {
        return [...this.entries];
    }
}

// Value object for status updates (Used by ShipmentHistory)
class StatusUpdate {
    constructor(status, timestamp) {
        this.status = status;
        this.timestamp = timestamp;
    }
}

// Main system class (Aggregation with Package, Association with EmailParser)
class PackageTrackingSystem {
    constructor() {
        this.packages = []; // Aggregation with Package objects
        this.subscribers = []; // Observer pattern implementation
        this.carriers = this.initializeCarriers(); // Composition with Carrier objects
        this.emailParser = new EmailParser(this.carriers); // Association with EmailParser
    }

    initializeCarriers() {
        return {
            'FEDEX': new Carrier({
                name: 'FedEx',
                trackingPattern: /(\b\d{12}\b|\b\d{15}\b)/,
                trackingUrlTemplate: 'https://www.fedex.com/fedextrack/?trknbr={trackingNumber}'
            }),
            'UPS': new Carrier({
                name: 'UPS',
                trackingPattern: /\b1Z[A-Z0-9]{16}\b/,
                trackingUrlTemplate: 'https://www.ups.com/track?tracknum={trackingNumber}'
            }),
            'DHL': new Carrier({
                name: 'DHL',
                trackingPattern: /\b\d{10}\b/,
                trackingUrlTemplate: 'https://www.dhl.com/track?trackingNumber={trackingNumber}'
            })
        };
    }

    extractFromEmail(emailContent) {
        const packageDetails = this.emailParser.parse(emailContent);
        if (packageDetails) {
            const carrier = this.carriers[packageDetails.carrier];
            if (carrier) {
                packageDetails.carrier = carrier;
                const newPackage = new Package(packageDetails);
                this.packages.push(newPackage);
                this.notifySubscribers('NEW_PACKAGE', newPackage);
                return newPackage;
            }
        }
        return null;
    }

    // Get packages sorted by delivery date
    getPackagesSorted() {
        return [...this.packages].sort((a, b) => 
            a.estimatedDeliveryDate - b.estimatedDeliveryDate
        );
    }

    // Filter packages by status
    filterByStatus(status) {
        return this.packages.filter(pkg => pkg.status === status);
    }

    // Filter packages by tag
    filterByTag(tag) {
        return this.packages.filter(pkg => pkg.tags.includes(tag));
    }

    // Search packages by various criteria
    searchPackages(query) {
        return this.packages.filter(pkg => 
            pkg.trackingNumber.includes(query) ||
            pkg.sender.toLowerCase().includes(query.toLowerCase()) ||
            pkg.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
    }

    // Subscribe to notifications
    subscribe(callback) {
        this.subscribers.push(callback);
    }

    // Notify subscribers of events
    notifySubscribers(event, data) {
        this.subscribers.forEach(callback => callback(event, data));
    }

    // Update package status
    updatePackageStatus(trackingNumber, newStatus) {
        const pkg = this.packages.find(p => p.trackingNumber === trackingNumber);
        if (pkg) {
            pkg.updateStatus(newStatus);
            this.notifySubscribers('STATUS_UPDATE', pkg);
        }
    }
}

// Email parser class (Association with PackageTrackingSystem)
class EmailParser {
    constructor(carriers) {
        this.carriers = carriers; // Association with Carrier objects
    }

    parse(emailContent) {
        try {
            const trackingInfo = this.findTrackingInfo(emailContent);
            if (!trackingInfo) return null;

            return {
                trackingNumber: trackingInfo.trackingNumber,
                carrier: trackingInfo.carrier,
                sender: this.extractSender(emailContent),
                description: this.extractDescription(emailContent),
                estimatedDeliveryDate: this.extractDeliveryDate(emailContent)
            };
        } catch (error) {
            console.error('Error parsing email:', error);
            return null;
        }
    }

    findTrackingInfo(content) {
        for (const [carrierName, carrier] of Object.entries(this.carriers)) {
            const match = content.match(carrier.trackingPattern);
            if (match) {
                return {
                    trackingNumber: match[0],
                    carrier: carrierName
                };
            }
        }
        return null;
    }

    extractSender(content) {
        // Implementation to extract sender information
        // This would use regex or parsing logic based on email format
        return 'Example Sender';
    }

    extractDescription(content) {
        // Implementation to extract package description
        return 'Package description';
    }

    extractDeliveryDate(content) {
        // Implementation to extract delivery date
        // This would parse dates in various formats
        return new Date();
    }
}

module.exports = {
    PackageTrackingSystem,
    Package,
    Carrier,
    EmailParser
}; 