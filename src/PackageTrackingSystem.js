import Carrier from './models/Carrier.js';
import Package from './models/Package.js';
import EmailParser from './services/EmailParser.js';
import UserManager from './services/UserManager.js';

class PackageTrackingSystem {
    constructor() {
        this.packages = []; // Aggregation with Package objects
        this.subscribers = []; // Observer pattern implementation
        this.carriers = this.initializeCarriers(); // Composition with Carrier objects
        this.emailParser = new EmailParser(this.carriers); // Association with EmailParser
        this.userManager = new UserManager(); // Composition with UserManager
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

    registerUser(userDetails) {
        return this.userManager.registerUser(userDetails);
    }

    login(username, password) {
        return this.userManager.login(username, password);
    }

    logout(sessionId) {
        this.userManager.logout(sessionId);
    }

    extractFromEmail(emailContent, sessionId) {
        const user = this.userManager.getUser(sessionId);
        if (!user) {
            throw new Error('User not logged in');
        }

        const packageData = this.emailParser.parse(emailContent);
        if (packageData) {
            const newPackage = new Package(packageData);
            user.addPackage(newPackage);
            this.notifySubscribers('NEW_PACKAGE', newPackage);
            return newPackage;
        }
        return null;
    }

    getPackagesSorted(sessionId) {
        const user = this.userManager.getUser(sessionId);
        if (!user) {
            throw new Error('User not logged in');
        }
        return user.getPackages().sort((a, b) => 
            a.estimatedDeliveryDate - b.estimatedDeliveryDate
        );
    }

    // ... rest of the methods remain the same ...
}

export default PackageTrackingSystem; 