/**
 * Parses email content to extract package tracking information.
 * @class
 */
class EmailParser {
    /**
     * Creates a new EmailParser instance.
     * @param {Object.<string, Carrier>} carriers - Map of carrier names to carrier instances
     */
    constructor(carriers) {
        this.carriers = carriers;
    }

    /**
     * Parses email content to extract package information.
     * @param {string} emailContent - The email content to parse
     * @returns {Object|null} Package data if successfully parsed, null otherwise
     */
    parse(emailContent) {
        try {
            const trackingInfo = this.findTrackingInfo(emailContent);
            if (!trackingInfo) {
                return null;
            }

            const carrierInstance = this.carriers[trackingInfo.carrier];
            if (!carrierInstance) {
                return null;
            }

            return {
                trackingNumber: trackingInfo.trackingNumber,
                carrier: carrierInstance,
                sender: this.extractSender(emailContent),
                description: this.extractDescription(emailContent),
                estimatedDeliveryDate: this.extractDeliveryDate(emailContent),
                ...this.extractInternationalInfo(emailContent)
            };
        } catch (error) {
            return null;
        }
    }

    /**
     * Extracts tracking information from email content.
     * @param {string} content - Email content
     * @returns {Object|null} Tracking info if found
     * @private
     */
    findTrackingInfo(content) {
        const carrierMatch = content.match(/Carrier: (\w+)/);
        if (!carrierMatch) {
            return null;
        }

        const carrierName = carrierMatch[1].toUpperCase();
        const carrier = this.carriers[carrierName];
        
        if (!carrier) {
            return null;
        }

        const match = content.match(carrier.trackingPattern);
        if (!match) {
            return null;
        }

        return {
            trackingNumber: match[1] || match[0],
            carrier: carrierName
        };
    }

    extractSender(content) {
        const match = content.match(/From: (.+)/);
        return match ? match[1].trim() : 'Unknown Sender';
    }

    extractDescription(content) {
        const match = content.match(/order of "([^"]+)"/);
        return match ? match[1] : 'Package';
    }

    extractDeliveryDate(content) {
        const match = content.match(/Expected Delivery: (\d{4}-\d{2}-\d{2})/);
        return match ? match[1] : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    }

    extractInternationalInfo(content) {
        return {
            destination: content.match(/Destination Country: (\w+)/)?.[1] || 'US',
            originCountry: content.match(/Origin Country: (\w+)/)?.[1] || 'US'
        };
    }
}

export default EmailParser; 