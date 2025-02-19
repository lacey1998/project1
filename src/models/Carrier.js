// Base Carrier class with basic functionality
class Carrier {
    constructor(config) {
        this.name = config.name;
        this.trackingPattern = config.trackingPattern;
        this.trackingUrlTemplate = config.trackingUrlTemplate;
    }

    // Basic methods all carriers have
    generateTrackingLink(trackingNumber) {
        return this.trackingUrlTemplate.replace('{trackingNumber}', trackingNumber);
    }

    validateTrackingNumber(trackingNumber) {
        return this.trackingPattern.test(trackingNumber);
    }
}

// International carrier with customs handling
class InternationalCarrier extends Carrier {
    constructor(config) {
        super(config);
        // New attributes specific to international shipping
        this.supportedCountries = config.supportedCountries || [];
        this.customsProcessingTime = 24; // hours
    }

    // New methods specific to international shipping
    validateDestination(country) {
        return this.supportedCountries.includes(country);
    }

    getEstimatedCustomsClearance(destinationCountry) {
        const processingTimes = {
            'UK': 48,
            'US': 24,
            'CN': 72
        };
        return processingTimes[destinationCountry] || 48;
    }
}

// Specialized carrier for hazardous materials
class HazmatCarrier extends Carrier {
    constructor(config) {
        super(config);
        // New attributes specific to hazmat shipping
        this.hazmatCertification = config.hazmatCertification;
        this.restrictedMaterials = ['flammable', 'corrosive', 'radioactive'];
        this.emergencyContact = config.emergencyContact;
    }

    // New methods specific to hazmat shipping
    validateHazmatShipment(materialType) {
        return this.restrictedMaterials.includes(materialType);
    }

    getEmergencyContact() {
        return this.emergencyContact;
    }
}

// Specific carrier implementations
class DHLInternational extends InternationalCarrier {
    constructor() {
        super({
            name: 'DHL International',
            trackingPattern: /\b[A-Z0-9]{10}\b/,
            trackingUrlTemplate: 'https://www.dhl.com/track?trackingNumber={trackingNumber}',
            supportedCountries: ['US', 'UK', 'CN', 'JP', 'DE']
        });
    }
}

class ChemicalLogistics extends HazmatCarrier {
    constructor() {
        super({
            name: 'Chemical Logistics',
            trackingPattern: /\bHZ\d{8}\b/,
            trackingUrlTemplate: 'https://chemlog.com/track/{trackingNumber}',
            hazmatCertification: 'ISO-HAZ-2023',
            emergencyContact: '1-800-HAZMAT'
        });
    }
}

export { 
    Carrier, 
    InternationalCarrier, 
    HazmatCarrier, 
    DHLInternational, 
    ChemicalLogistics 
}; 