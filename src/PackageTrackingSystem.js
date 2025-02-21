import { Carrier, DHLInternational, HazmatCarrier, carrierConfigs } from './models/Carrier.js';
import Package from './models/Package.js';
import EmailParser from './services/EmailParser.js';
import UserManager from './services/UserManager.js';

/**
 * Main system for managing package tracking functionality.
 * @class
 */
class PackageTrackingSystem {
    /**
     * Creates a new PackageTrackingSystem instance.
     */
    constructor() {
        this.packages = []; // Aggregation with Package objects
        this.subscribers = []; // Observer pattern implementation
        this.carriers = this.initializeCarriers(); // Composition with Carrier objects
        this.emailParser = new EmailParser(this.carriers); // Association with EmailParser
        this.userManager = new UserManager(); // Composition with UserManager
    }

    /**
     * Initializes supported carriers.
     * @returns {Object.<string, Carrier>} Map of carrier names to carrier instances
     * @private
     */
    initializeCarriers() {
        return {
            [Carrier.TYPES.DHL]: new DHLInternational(),
            [Carrier.TYPES.CHEMLOG]: new HazmatCarrier(),
            [Carrier.TYPES.UPS]: new Carrier(carrierConfigs.UPS),
            [Carrier.TYPES.FEDEX]: new Carrier(carrierConfigs.FEDEX)
        };
    }

    /**
     * Registers a new user in the system.
     * @param {Object} userDetails - User registration details
     * @returns {User} The newly created user
     */
    registerUser(userDetails) {
        return this.userManager.registerUser(userDetails);
    }

    /**
     * Logs in a user and creates a session.
     * @param {string} username - Username
     * @param {string} password - Password
     * @returns {string} Session ID
     */
    login(username, password) {
        return this.userManager.login(username, password);
    }

    /**
     * Logs out a user from the system.
     * @param {string} sessionId - The session ID to invalidate
     */
    logout(sessionId) {
        this.userManager.logout(sessionId);
    }

    /**
     * Subscribes to package tracking events.
     * @param {Function} callback - Event handler function
     */
    subscribe(callback) {
        this.subscribers.push(callback);
    }

    /**
     * Notifies all subscribers of an event.
     * @param {string} event - The event type
     * @param {*} data - The event data
     * @private
     */
    notifySubscribers(event, data) {
        this.subscribers.forEach(callback => callback(event, data));
    }

    /**
     * Checks if a package is due for delivery tomorrow.
     * @param {Package} pkg - The package to check
     * @private
     */
    checkDeliveryDate(pkg) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const deliveryDate = new Date(pkg.estimatedDeliveryDate);
        if (deliveryDate.toDateString() === tomorrow.toDateString()) {
            this.notifySubscribers('DELIVERY_TOMORROW', pkg);
        }
    }

    /**
     * Extracts package information from email content.
     * @param {string} emailContent - Email content to parse
     * @param {string} sessionId - User session ID
     * @returns {Package|null} Created package or null if parsing fails
     */
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

    /**
     * Gets all packages sorted by delivery date.
     * @param {string} sessionId - User session ID
     * @returns {Package[]} Sorted array of packages
     * @throws {Error} If user is not logged in
     */
    getPackagesSorted(sessionId) {
        const user = this.userManager.getUser(sessionId);
        if (!user) {
            throw new Error('User not logged in');
        }
        return user.getPackages().sort((a, b) => 
            a.estimatedDeliveryDate - b.estimatedDeliveryDate
        );
    }

    /**
     * Filters packages by status.
     * @param {string} status - Status to filter by
     * @param {string} sessionId - User session ID
     * @returns {Package[]} Filtered array of packages
     * @throws {Error} If user is not logged in
     */
    filterByStatus(status, sessionId) {
        const user = this.userManager.getUser(sessionId);
        if (!user) {
            throw new Error('User not logged in');
        }
        return user.getPackages().filter(pkg => pkg.status === status);
    }

    /**
     * Searches packages by query string.
     * @param {string} query - Search query
     * @param {string} sessionId - User session ID
     * @returns {Package[]} Array of matching packages
     * @throws {Error} If user is not logged in
     */
    searchPackages(query, sessionId) {
        const user = this.userManager.getUser(sessionId);
        if (!user) {
            throw new Error('User not logged in');
        }
    
        query = query.toLowerCase(); // Keep query lowercase
        const packages = user.getPackages();
    
        const results = user.getPackages().filter(pkg => 
            pkg.trackingNumber.toLowerCase().includes(query) ||  // Convert tracking number to lowercase
            pkg.sender.toString().toLowerCase().includes(query) ||         // Convert sender to lowercase
            pkg.carrier.name.toString().toLowerCase().includes(query) ||   // Convert carrier name to lowercase
            pkg.tags.some(tag => tag.toLowerCase().includes(query))
        );
    
        //console.log("🔍 Debug: Search results", results.map(pkg => pkg.trackingNumber));
    
        return results;
    }
    

    /**
     * Gets packages scheduled for delivery tomorrow.
     * @param {string} sessionId - User session ID
     * @returns {Package[]} Array of packages due tomorrow
     * @throws {Error} If user is not logged in
     */
    checkUpcomingDeliveries(sessionId) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const packages = this.getPackagesSorted(sessionId);
        
        return packages.filter(pkg => {
            const deliveryDate = new Date(pkg.estimatedDeliveryDate);
            return deliveryDate.toDateString() === tomorrow.toDateString();
        });
    }

    /**
     * Updates the status of a package.
     * @param {string} trackingNumber - Package tracking number
     * @param {string} newStatus - New status to set
     * @param {string} sessionId - User session ID
     * @throws {Error} If user is not logged in
     */
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