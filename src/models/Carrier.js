/**
 * Base class for all carrier types in the package tracking system.
 * @class
 */
class Carrier {
    /**
     * Defines available carrier types.
     * @static
     * @readonly
     */
    static get TYPES(){
        return {
            DHL: 'DHL',
            UPS: 'UPS',
            FEDEX: 'FEDEX',
            CHEMLOG: 'CHEMLOG'
        };
    };

    /**
     * Creates a new Carrier instance.
     * @param {Object} config - The carrier configuration
     * @param {string} config.name - The name of the carrier
     * @param {RegExp} config.trackingPattern - Regular expression for validating tracking numbers
     * @param {string} config.trackingUrlTemplate - Template for generating tracking URLs
     * @param {string} config.type - Type of carrier from Carrier.TYPES
     */
    constructor(config) {
        this.name = config.name;
        this.trackingPattern = config.trackingPattern;
        this.trackingUrlTemplate = config.trackingUrlTemplate;
        this.type = config.type;
    }

    /**
     * Generates a tracking URL for a tracking number. 
     * @param {string} trackingNumber - The package tracking number
     * @returns {string} The tracking URL
     */
    generateTrackingLink(trackingNumber) {
        return this.trackingUrlTemplate.replace('{trackingNumber}', trackingNumber);
    }

    /**
     * Validates a tracking number against the carrier's pattern.
     * @param {string} trackingNumber - The tracking number to validate
     * @returns {boolean} True if the tracking number is valid
     */
    validateTrackingNumber(trackingNumber) {
        return this.trackingPattern.test(trackingNumber);
    }
}

/**
 * DHL International carrier implementation.
 * @extends Carrier
 */
class DHLInternational extends Carrier {
    /**
     * Creates a new DHLInternational carrier instance.
     */
    constructor() {
        super({
            name: 'DHL International',
            type: Carrier.TYPES.DHL,
            trackingPattern: /Tracking Number: (DHL[A-Z0-9]{7}X)\b/,
            trackingUrlTemplate: 'https://www.dhl.com/track?trackingNumber={trackingNumber}'
        });
        this.internationalZones = ['US', 'UK', 'CN', 'JP', 'DE'];
    }

    /**
     * Validates if a tracking number is valid for international shipping.
     * @param {string} trackingNumber - The tracking number to validate
     * @returns {boolean} True if valid for international shipping
     */
    validateInternationalTracking(trackingNumber) {
        return trackingNumber.startsWith('DHL');
    }

    /**
     * Gets the list of supported international shipping zones.
     * @returns {string[]} Array of supported country codes
     */
    getInternationalShippingZones() {
        return this.internationalZones;
    }
}

/**
 * Hazardous materials carrier implementation.
 * @extends Carrier
 */
class HazmatCarrier extends Carrier {
    /**
     * Creates a new HazmatCarrier instance.
     */
    constructor() {
        super({
            name: 'Chemical Logistics',
            type: Carrier.TYPES.CHEMLOG,
            trackingPattern: /\bHZ\d{8}\b/,
            trackingUrlTemplate: 'https://chemlog.com/track/{trackingNumber}'
        });
        this.hazmatClasses = ['flammable', 'corrosive', 'radioactive'];
        this.safetyProtocols = new Map([
            ['flammable', 'Keep away from heat sources'],
            ['corrosive', 'Handle with protective gear'],
            ['radioactive', 'Special containment required']
        ]);
    }

    /**
     * Validates if a material class is supported.
     * @param {string} materialClass - The hazmat class to validate
     * @returns {boolean} True if the material class is supported
     */
    validateHazmatClass(materialClass) {
        return this.hazmatClasses.includes(materialClass);
    }

    /**
     * Gets handling instructions for a specific material type.
     * @param {string} materialType - The type of hazardous material
     * @returns {string} Safety handling instructions
     */
    getHandlingInstructions(materialType) {
        return this.safetyProtocols.get(materialType) || 'Standard handling procedures apply';
    }
}

/**
 * Configuration objects for regular carriers.
 * @type {Object.<string, Object>}
 */
const carrierConfigs = {
    /** @type {Object} UPS carrier configuration */
    UPS: {
        name: 'UPS',
        type: Carrier.TYPES.UPS,
        trackingPattern: /\b1Z\d{8}\b/,
        trackingUrlTemplate: 'https://www.ups.com/track?tracknum={trackingNumber}'
    },
    /** @type {Object} FedEx carrier configuration */
    FEDEX: {
        name: 'FedEx',
        type: Carrier.TYPES.FEDEX,
        trackingPattern: /\b(\d{12}|\d{15})\b/,
        trackingUrlTemplate: 'https://www.fedex.com/fedextrack/?trknbr={trackingNumber}'
    }
};

export { 
    Carrier, 
    DHLInternational, 
    HazmatCarrier,
    carrierConfigs 
}; 
