class EmailParser {
    constructor(carriers) {
        this.carriers = carriers;
    }

    parse(emailContent) {
        console.log('Parsing email content:', emailContent);

        try {
            const trackingInfo = this.findTrackingInfo(emailContent);
            if (!trackingInfo) {
                console.log('No tracking info found');
                return null;
            }

            const carrierInstance = this.carriers[trackingInfo.carrier];
            if (!carrierInstance) {
                console.log('Carrier not found:', trackingInfo.carrier);
                return null;
            }

            return {
                trackingNumber: trackingInfo.trackingNumber,
                carrier: carrierInstance,  // Pass the carrier instance, not just the name
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
        const carrierMatch = content.match(/Carrier: (\w+)/);
        if (!carrierMatch) {
            console.log('No carrier found in email');
            return null;
        }

        const carrierName = carrierMatch[1].toUpperCase();
        const carrier = this.carriers[carrierName];
        
        if (!carrier) {
            console.log(`Carrier ${carrierName} not found in registered carriers`);
            return null;
        }

        const match = content.match(carrier.trackingPattern);
        if (!match) {
            console.log(`No valid tracking number found for carrier ${carrierName}`);
            return null;
        }

        return {
            trackingNumber: match[0],
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
}

export default EmailParser; 