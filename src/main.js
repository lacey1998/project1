import PackageTrackingSystem from './PackageTrackingSystem.js';

// Initialize the package tracking system
const trackingSystem = new PackageTrackingSystem();

// Register a new user
const user = trackingSystem.registerUser({
    username: 'john_doe',
    email: 'john@example.com',
    password: 'securepassword'
});

console.log('User registered:', user.username);

// User login
const sessionId = trackingSystem.login('john_doe', 'securepassword');
console.log('User logged in with session ID:', sessionId);

// Simulate receiving an email with package details
const emailContent = `
    From: Amazon.com
    Subject: Your package is on its way

    Tracking Number: 1Z999AA1234567890
    Carrier: UPS
    Expected Delivery: ${new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}

    Your recent order of "Wireless Headphones" has shipped.
`;

// Extract package from email
const newPackage = trackingSystem.extractFromEmail(emailContent, sessionId);
if (newPackage) {
    console.log('New package created:', newPackage.trackingNumber);
    console.log(`Package will be delivered tomorrow: ${newPackage.estimatedDeliveryDate}`);
} else {
    console.log('No package could be extracted from the email.');
}

// View all packages for the user
const packages = trackingSystem.getPackagesSorted(sessionId);
console.log('All packages for user:', packages.map(pkg => pkg.trackingNumber));

// Update package status
if (newPackage) {
    trackingSystem.updatePackageStatus(newPackage.trackingNumber, 'Delivered', sessionId);
    console.log('Package status updated to Delivered');
}

// Logout user
trackingSystem.logout(sessionId);
console.log('User logged out'); 