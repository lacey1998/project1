import UserPreferences from './UserPreferences.js';

class User {
    constructor({ username, email, password }) {
        this.username = username;
        this.email = email;
        this.passwordHash = this.hashPassword(password); // In real app, use proper hashing
        this.packages = []; // Aggregation with Package
        this.preferences = new UserPreferences(); // Composition with UserPreferences
    }

    hashPassword(password) {
        // This is a placeholder - in a real app, use proper password hashing
        return `hashed_${password}`;
    }

    validatePassword(password) {
        return this.passwordHash === this.hashPassword(password);
    }

    addPackage(packages) {
        this.packages.push(packages);
    }

    removePackage(trackingNumber) {
        this.packages = this.packages.filter(pkg => pkg.trackingNumber !== trackingNumber);
    }

    getPackages() {
        return [...this.packages];
    }
}

export default User; 