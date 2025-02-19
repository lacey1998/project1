import { DHLInternational, ChemicalLogistics } from './models/Carrier.js';
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
            'DHL': new DHLInternational(),
            'CHEMLOG': new ChemicalLogistics()
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

    subscribe(callback) {
        this.subscribers.push(callback);
    }

    notifySubscribers(event, data) {
        this.subscribers.forEach(callback => callback(event, data));
    }

    checkDeliveryDate(pkg) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const deliveryDate = new Date(pkg.estimatedDeliveryDate);
        if (deliveryDate.toDateString() === tomorrow.toDateString()) {
            this.notifySubscribers('DELIVERY_TOMORROW', pkg);
        }
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
            this.checkDeliveryDate(newPackage);
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

    filterByStatus(status, sessionId) {
        const user = this.userManager.getUser(sessionId);
        if (!user) {
            throw new Error('User not logged in');
        }
        return user.getPackages().filter(pkg => pkg.status === status);
    }

    searchPackages(query, sessionId) {
        const user = this.userManager.getUser(sessionId);
        if (!user) {
            throw new Error('User not logged in');
        }
        query = query.toLowerCase();
        return user.getPackages().filter(pkg => 
            pkg.trackingNumber.toLowerCase().includes(query) ||
            pkg.sender.toString().toLowerCase().includes(query) ||
            pkg.tags.some(tag => tag.toLowerCase().includes(query))
        );
    }

    checkUpcomingDeliveries(sessionId) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const packages = this.getPackagesSorted(sessionId);
        
        return packages.filter(pkg => {
            const deliveryDate = new Date(pkg.estimatedDeliveryDate);
            return deliveryDate.toDateString() === tomorrow.toDateString();
        });
    }

    updatePackageStatus(trackingNumber, newStatus, sessionId) {
        const user = this.userManager.getUser(sessionId);
        if (!user) {
            throw new Error('User not logged in');
        }
        const pkg = user.getPackages().find(p => p.trackingNumber === trackingNumber);
        if (pkg) {
            pkg.updateStatus(newStatus);
            this.notifySubscribers('STATUS_UPDATE', { trackingNumber, status: newStatus });
        }
    }
}

export default PackageTrackingSystem; 