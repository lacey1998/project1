import PackageTrackingSystem from './PackageTrackingSystem.js';
import { DHLInternational, HazmatCarrier } from './models/Carrier.js';
import { PackageTrackerCLI } from '../cli.js';

// Initialize the package tracking system
const trackingSystem = new PackageTrackingSystem();

// 1. User Authentication
console.log('\n1. User Authentication');
const user = trackingSystem.registerUser({
    username: 'lacey',
    email: 'laceyl@example.com',
    password: 'securepassword'
});
console.log('User registered:', user.username);
const sessionId = trackingSystem.login('lacey', 'securepassword');
console.log('Session ID:', sessionId);

// Setup notification handler
let notificationCount = 0;
const notificationHandler = (event, data) => {
    notificationCount++;
    console.log(`\nNotification ${notificationCount}:`);
    PackageTrackerCLI.getNotificationHandler()(event, data);
};
trackingSystem.subscribe(notificationHandler);

// 2. Basic Package Tracking
console.log('\n2. Basic Package Tracking');
const regularEmail = `
    From: Amazon.com
    Subject: Your package is on its way
    Tracking Number: DHL9876543X
    Carrier: DHL
    Expected Delivery: ${new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
    Your order of "Wireless Headphones" has shipped.
`;
const basicPackage = trackingSystem.extractFromEmail(regularEmail, sessionId);
console.log('Basic Package Details:');
console.log(`- Tracking Number: ${basicPackage?.trackingNumber}`);
console.log(`- Description: ${basicPackage?.description}`);
console.log(`- Status: ${basicPackage?.status}`);

// 3. Package Organization
console.log('\n3. Package Organization');
// Add tags
basicPackage.addTag('Electronics');
basicPackage.addTag('Gift');
console.log('Tags added:', basicPackage.tags);

// 4. Status Updates
console.log('\n4. Status Updates');
trackingSystem.updatePackageStatus(basicPackage.trackingNumber, 'Delivered', sessionId);
console.log('Package status:', basicPackage.status);

// 5. Search and Filter
console.log('\n5. Search and Filter');
const searchResults = trackingSystem.searchPackages('Electronics', sessionId);
console.log('Search results for "Electronics":', 
    searchResults.map(p => p.trackingNumber));

const deliveredPackages = trackingSystem.filterByStatus('Delivered', sessionId);
console.log('Delivered packages:', 
    deliveredPackages.map(p => p.trackingNumber));

// 6. Specialized Carriers
console.log('\n6. Specialized Carriers');

// International Shipping (DHL)
const internationalEmail = `
    From: UK_Seller@etsy.com
    Subject: Your order from UK has shipped
    Tracking Number: DHL7654321X
    Carrier: DHL
    Origin Country: UK
    Destination Country: US
    Expected Delivery: ${new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
    Your order of "British Tea Set" has shipped.
`;

const dhlPackage = trackingSystem.extractFromEmail(internationalEmail, sessionId);
if (dhlPackage?.carrier instanceof DHLInternational) {
    console.log('\nDHL International Package:');
    console.log(`- Tracking Number: ${dhlPackage.trackingNumber}`);
    console.log(`- Status: ${dhlPackage.status}`);
    console.log(`- International Zones: ${dhlPackage.carrier.getInternationalShippingZones()}`);
    console.log(`- Valid for International: ${dhlPackage.carrier.validateInternationalTracking(dhlPackage.trackingNumber)}`);
}

// Hazardous Materials (CHEMLOG)
const hazmatEmail = `
    From: Laboratory_Supplies@chemlab.com
    Subject: Chemical shipment
    Tracking Number: HZ98765432
    Carrier: CHEMLOG
    Material Type: flammable
    Expected Delivery: ${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
    Your order of "Laboratory Chemicals (Flammable)" has shipped.
`;

const hazmatPackage = trackingSystem.extractFromEmail(hazmatEmail, sessionId);
if (hazmatPackage?.carrier instanceof HazmatCarrier) {
    console.log('\nHazmat Package:');
    console.log(`- Tracking Number: ${hazmatPackage.trackingNumber}`);
    console.log(`- Status: ${hazmatPackage.status}`);
    console.log(`- Valid Hazmat Class: ${hazmatPackage.carrier.validateHazmatClass('flammable')}`);
    console.log(`- Handling Instructions: ${hazmatPackage.carrier.getHandlingInstructions('flammable')}`);
}

// Cleanup
trackingSystem.logout(sessionId);
console.log('\nUser logged out'); 