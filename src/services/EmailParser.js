class EmailParser {
    constructor(carriers) {
        this.carriers = carriers; // Association with Carrier objects
    }

    parse(emailContent) {
        console.log('Parsing email content:', emailContent); // Debugging log

        try {
            const trackingInfo = this.findTrackingInfo(emailContent);
            if (!trackingInfo) {
                console.log('No tracking info found'); // Debugging log
                return null;
            }

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
        return 'Example Sender';
    }

    extractDescription(content) {
        return 'Package description';
    }

    extractDeliveryDate(content) {
        const match = content.match(/Expected Delivery: (\d{4}-\d{2}-\d{2})/);
        return match ? new Date(match[1]) : null;
    }
}

export default EmailParser; 