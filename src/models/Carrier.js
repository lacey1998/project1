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

export default Carrier; 