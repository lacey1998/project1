import PackageTrackingSystem from './PackageTrackingSystem.js';
import { DHLInternational, ChemicalLogistics } from './models/Carrier.js';
import { PackageTrackerCLI } from '../cli.js';

// Initialize the package tracking system
const trackingSystem = new PackageTrackingSystem();

// 1. User Registration and Login
console.log('=== Testing Package Tracking System ===\n');

const user = trackingSystem.registerUser({
    username: 'john_doe',
    email: 'john@example.com',
    password: 'securepassword'
});
console.log('1. User registered:', user.username);

const sessionId = trackingSystem.login('john_doe', 'securepassword');
console.log('User logged in with session ID:', sessionId);

// Setup notifications for testing using CLI's handler
console.log('\n=== Testing Notification System ===');

// Setup notification handler from CLI
let notificationCount = 0;
const notificationHandler = (event, data) => {
    notificationCount++;
    console.log(`\nNotification ${notificationCount}:`);
    PackageTrackerCLI.getNotificationHandler()(event, data);
};
trackingSystem.subscribe(notificationHandler);

// Test package arriving in a week (should not trigger tomorrow notification)
const futureDeliveryEmail = `
    From: Amazon.com
    Subject: Your package is on its way

    Tracking Number: FUTURE123
    Carrier: DHL
    Expected Delivery: ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}

    Your order of "Future Item" has shipped.
`;

console.log('\nTesting notification for future delivery:');
const futurePackage = trackingSystem.extractFromEmail(futureDeliveryEmail, sessionId);

// Check if package was created successfully
if (futurePackage) {
    console.log('Future package created:', futurePackage.trackingNumber);
} else {
    console.log('Failed to create future package. Check carrier and tracking number format.');
}

// Test package arriving tomorrow (should trigger tomorrow notification)
const tomorrowDeliveryEmail = `
    From: Amazon.com
    Subject: Your package is on its way

    Tracking Number: TOMORROW123
    Carrier: DHL
    Expected Delivery: ${new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}

    Your order of "Express Item" has shipped.
`;

console.log('\nTesting notification for tomorrow delivery:');
const tomorrowPackage = trackingSystem.extractFromEmail(tomorrowDeliveryEmail, sessionId);

// Test status update notification only if package was created
if (tomorrowPackage) {
    console.log('\nTesting status update notification:');
    trackingSystem.updatePackageStatus(tomorrowPackage.trackingNumber, 'Out for Delivery', sessionId);
} else {
    console.log('Failed to create tomorrow package. Check carrier and tracking number format.');
}

// Verify notifications were triggered
console.log(`\nTotal notifications received: ${notificationCount}`);

// 2. Email Parsing and Package Creation
const emailContent = `
    From: Amazon.com
    Subject: Your package is on its way

    Tracking Number: 1234567890
    Carrier: DHL
    Expected Delivery: ${new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}

    Your recent order of "Wireless Headphones" has shipped.
`;

// 3. Extract package from email
const newPackage = trackingSystem.extractFromEmail(emailContent, sessionId);
console.log('\n2. New package created:', newPackage?.trackingNumber);

// 4. Add more packages with different statuses
const emailContent2 = `
    From: Best Buy
    Subject: Order Shipped

    Tracking Number: HZ12345678
    Carrier: CHEMLOG
    Expected Delivery: ${new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().split('T')[0]}

    Your order of "Gaming Console" has shipped.
`;

const newPackage2 = trackingSystem.extractFromEmail(emailContent2, sessionId);

// 5. Test package tagging
if (newPackage) {
    newPackage.addTag('Electronics');
    newPackage.addTag('Gift');
    console.log('\n3. Added tags to package:', newPackage.tags);
}

// 6. View package contents
if (newPackage) {
    console.log('\n4. Package contents:', newPackage.getContents());
}

// 7. Test package sorting
const sortedPackages = trackingSystem.getPackagesSorted(sessionId);
console.log('\n5. Sorted packages:', 
    sortedPackages.map(p => `${p.trackingNumber} (${p.estimatedDeliveryDate})`));

// 8. Test status filtering
trackingSystem.updatePackageStatus(newPackage?.trackingNumber, 'Delivered', sessionId);
const deliveredPackages = trackingSystem.filterByStatus('Delivered', sessionId);
console.log('\n6. Delivered packages:', 
    deliveredPackages.map(p => p.trackingNumber));

// 9. Test package search
const searchResults = trackingSystem.searchPackages('Electronics', sessionId);
console.log('\n7. Search results for "Electronics":', 
    searchResults.map(p => p.trackingNumber));

// 10. Check upcoming deliveries
const upcomingDeliveries = trackingSystem.checkUpcomingDeliveries(sessionId);
console.log('\n8. Packages arriving tomorrow:', 
    upcomingDeliveries.map(p => p.trackingNumber));

// Test carrier-specific features
const dhl = new DHLInternational();
const chemLog = new ChemicalLogistics();

console.log('\n9. Testing carrier features:');
console.log('DHL International:');
console.log(`- Shipping to UK allowed: ${dhl.validateDestination('UK')}`);
console.log(`- Customs clearance time for CN: ${dhl.getEstimatedCustomsClearance('CN')} hours`);

console.log('\nChemical Logistics:');
console.log(`- Can ship flammable materials: ${chemLog.validateHazmatShipment('flammable')}`);
console.log(`- Emergency contact: ${chemLog.getEmergencyContact()}`);

// Cleanup
trackingSystem.logout(sessionId);
console.log('\nUser logged out'); 