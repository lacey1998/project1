import UserPreferences from './UserPreferences.js';

/**
 * Represents a user in the package tracking system.
 * @class
 */
class User {
    /**
     * Creates a new User instance.
     * @param {Object} details - User details
     * @param {string} details.username - Username
     * @param {string} details.email - Email address
     * @param {string} details.password - Password
     */
    constructor({ username, email, password }) {
        this.username = username;
        this.email = email;
        this.passwordHash = this.hashPassword(password); // In real app, use proper hashing
        this.packages = []; // Aggregation with Package
        this.preferences = new UserPreferences(); // Composition with UserPreferences
    }

    /**
     * Validates user's password.
     * @param {string} password - Password to validate
     * @returns {boolean} True if password is valid
     */
    validatePassword(password) {
        return this.passwordHash === this.hashPassword(password);
    }

    /**
     * Adds a package to user's package list.
     * @param {Package} pkg - Package to add
     */
    addPackage(pkg) {
        this.packages.push(pkg);
    }

    /**
     * Gets all packages for the user.
     * @returns {Package[]} Array of user's packages
     */
    getPackages() {
        return [...this.packages];
    }

    hashPassword(password) {
        return `hashed_${password}`;
    }

    removePackage(trackingNumber) {
        this.packages = this.packages.filter(pkg => pkg.trackingNumber !== trackingNumber);
    }
}

export default User; 