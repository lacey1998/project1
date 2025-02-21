import PackageTrackingSystem from './PackageTrackingSystem.js';
import readline from 'readline/promises';
import Package from './models/Package.js';

/**
 * Command Line Interface for the Package Tracking System.
 * This replaces cli.js, allowing interactive testing.
 */
class PackageTrackerCLI {
    constructor() {
        this.trackingSystem = new PackageTrackingSystem();
        this.sessionId = null;
        this.notifications = [];
        this.setupNotifications();
    }

    async ensureUserRegistered() {
        if (!this.sessionId) {
            const username = `user_${Date.now()}`;
            const password = 'securepassword';
            const email = `${username}@example.com`;

            console.log(`🔹 Registering new user: ${username}...`);
            this.trackingSystem.registerUser({ username, password, email });
            this.sessionId = this.trackingSystem.login(username, password);
            console.log(`✅ User successfully registered and logged in. Session ID: ${this.sessionId}`);
        }
    }

    setupNotifications() {
        let notificationCount = 0;
        const notificationHandler = (event, data) => {
            notificationCount++;
            const message = `\nNotification ${notificationCount}: 📢 Event: ${event} - ${data.trackingNumber}`;
            console.log(message);
            this.notifications.push(message);
        };
        this.trackingSystem.subscribe(notificationHandler);
    }

    showMenu() {
        console.log('\n=== 📦 Package Tracking System ===');
        console.log('1. Add package from email');
        console.log('2. Add hazmat package from email');
        console.log('3. Add international package from email');
        console.log('4. View all packages');
        console.log('5. Search packages');
        console.log('6. Filter by status');
        console.log('7. Add tag to package');
        console.log('8. Show notifications');
        console.log('9. Exit');
        console.log('==================================');
    }

    async start() {
        await this.ensureUserRegistered();
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

        while (true) {
            this.showMenu();
            const choice = await rl.question('Enter your choice (1-9): ');

            switch (choice) {
                case '1':
                    await this.simulateEmailInput();
                    break;
                case '2':
                    await this.simulateHazmatEmailInput();
                    break;
                case '3':
                    await this.simulateInternationalEmailInput();
                    break;
                case '4':
                    console.log('\n📦 All Packages:');
                    console.log(this.trackingSystem.getPackagesSorted(this.sessionId).map(pkg => pkg.trackingNumber));
                    break;
                case '5':
                    const searchQuery = await rl.question('Enter search term (company name or tracking number): ');
                    const searchResults = this.trackingSystem.searchPackages(searchQuery, this.sessionId);
                    console.log(searchResults.length > 0 ? searchResults.map(pkg => `${pkg.trackingNumber} - ${pkg.carrier.name}`) : '❌ No packages found matching the search criteria.');
                    break;
                case '6':
                    console.log('\n📦 Available status types:');
                    Object.values(Package.STATUS_TYPES).forEach(status => console.log(`- ${status}`));
                    const status = await rl.question('Enter status: ');
                    const filteredPackages = this.trackingSystem.filterByStatus(status, this.sessionId);
                    console.log(filteredPackages.length > 0 ? filteredPackages.map(pkg => `${pkg.trackingNumber} - ${pkg.carrier.name} - ${pkg.status}`) : '❌ No packages found with this status.');
                    break;
                case '7':
                    const trackingNumber = await rl.question('Enter tracking number: ');
                    const tag = await rl.question('Enter tag: ');
                    const pkg = this.trackingSystem.getPackagesSorted(this.sessionId).find(p => p.trackingNumber === trackingNumber);
                    if (pkg) {
                        pkg.addTag(tag);
                        console.log(`✅ Tag "${tag}" added to package ${trackingNumber}`);
                    } else {
                        console.log(`❌ Package not found: ${trackingNumber}`);
                    }
                    break;
                case '8':
                    console.log('\n📢 Displaying Notifications...');
                    if (this.notifications.length === 0) {
                        console.log('No notifications yet.');
                    } else {
                        this.notifications.forEach(notification => console.log(notification));
                    }
                    break;
                case '9':
                    console.log('👋 Goodbye!');
                    rl.close();
                    return;
                default:
                    console.log('❌ Invalid choice. Please try again.');
            }
        }
    }

    async simulateEmailInput() {
        const emailContent = `
            From: Amazon.com
            Subject: Your package is on its way
            Tracking Number: 1Z99948756
            Carrier: UPS
            Expected Delivery: ${new Date().toISOString().split('T')[0]}
            Your recent order of "Wireless Headphones" has shipped.
        `;
        console.log('📩 Processing email...');
    
        const packageData = this.trackingSystem.emailParser.parse(emailContent); // Debug step
        //console.log("🔍 Debug: Parsed package data:", packageData); // Add this
    
        if (!packageData) {
            console.log('⚠️ No package found in email. Check email parsing.');
            return;
        }
    
        const pkg = this.trackingSystem.extractFromEmail(emailContent, this.sessionId);
        if (pkg) {
            console.log(`✅ Package added: ${pkg.trackingNumber}, arriving on ${pkg.estimatedDeliveryDate}`);
        } else {
            console.log('⚠️ No package found after extraction.');
        }
    }
    

    async simulateHazmatEmailInput() {
        const emailContent = `
            From: Laboratory_Supplies@chemlab.com
            Subject: Chemical shipment
            Tracking Number: HZ98765432
            Carrier: CHEMLOG
            Material Type: flammable
            Expected Delivery: ${new Date().toISOString().split('T')[0]}
            Your order of "Laboratory Chemicals (Flammable)" has shipped.
        `;
        console.log('📩 Processing hazmat email...');
        const pkg = this.trackingSystem.extractFromEmail(emailContent, this.sessionId);
        if (pkg) {
            console.log(`✅ Hazmat Package added: ${pkg.trackingNumber}`);
            console.log(`- Handling Instructions: ${pkg.carrier.getHandlingInstructions('flammable')}`);
        } else {
            console.log('⚠️ No package found in email.');
        }
    }
    async simulateInternationalEmailInput() {
        const emailContent = `
            From: UK_Seller@etsy.com
            Subject: Your order from UK has shipped
            Tracking Number: DHL7654321X
            Carrier: DHL
            Origin Country: UK
            Destination Country: US
            Expected Delivery: ${new Date().toISOString().split('T')[0]}
            Your order of "British Tea Set" has shipped.
        `;
        console.log('📩 Processing international email...');
        const pkg = this.trackingSystem.extractFromEmail(emailContent, this.sessionId);
        if (pkg) {
            console.log(`✅ International Package added: ${pkg.trackingNumber}, arriving on ${pkg.estimatedDeliveryDate}`);
        } else {
            console.log('⚠️ No package found in email.');
        }
    }
}
// Start CLI
const cli = new PackageTrackerCLI();
cli.start();


// import PackageTrackingSystem from './PackageTrackingSystem.js';
// import { Carrier, DHLInternational, HazmatCarrier, carrierConfigs } from './models/Carrier.js';
// import { PackageTrackerCLI } from '../cli.js';

// // Initialize the package tracking system
// const trackingSystem = new PackageTrackingSystem();

// // 1. User Authentication
// console.log('\n1. User Authentication');
// const user = trackingSystem.registerUser({
//     username: 'lacey',
//     email: 'laceyl@example.com',
//     password: 'securepassword'
// });
// console.log('User registered:', user.username);
// const sessionId = trackingSystem.login('lacey', 'securepassword');
// console.log('Session ID:', sessionId);

// // Setup notification handler
// let notificationCount = 0;
// const notificationHandler = (event, data) => {
//     notificationCount++;
//     console.log(`\nNotification ${notificationCount}:`);
//     PackageTrackerCLI.getNotificationHandler()(event, data);
// };
// trackingSystem.subscribe(notificationHandler);

// // 2. Basic Package Tracking
// console.log('\n2. Basic Package Tracking');
// const regularEmail = `
//     From: Amazon.com
//     Subject: Your package is on its way
//     Tracking Number: DHL9876543X
//     Carrier: DHL
//     Expected Delivery: ${new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
//     Your order of "Wireless Headphones" has shipped.
// `;
// const basicPackage = trackingSystem.extractFromEmail(regularEmail, sessionId);
// console.log('Basic Package Details:');
// console.log(`- Tracking Number: ${basicPackage?.trackingNumber}`);
// console.log(`- Description: ${basicPackage?.description}`);
// console.log(`- Status: ${basicPackage?.status}`);

// // 3. Package Organization
// console.log('\n3. Package Organization');
// // Add tags
// basicPackage.addTag('Electronics');
// basicPackage.addTag('Gift');
// console.log('Tags added:', basicPackage.tags);

// // 4. Status Updates
// console.log('\n4. Status Updates');
// trackingSystem.updatePackageStatus(basicPackage.trackingNumber, 'Delivered', sessionId);
// console.log('Package status:', basicPackage.status);

// // 5. Search and Filter
// console.log('\n5. Search and Filter');
// const searchResults = trackingSystem.searchPackages('Electronics', sessionId);
// console.log('Search results for "Electronics":', 
//     searchResults.map(p => p.trackingNumber));

// const deliveredPackages = trackingSystem.filterByStatus('Delivered', sessionId);
// console.log('Delivered packages:', 
//     deliveredPackages.map(p => p.trackingNumber));

// // 6. Specialized Carriers
// console.log('\n6. Specialized Carriers');

// // International Shipping (DHL)
// const internationalEmail = `
//     From: UK_Seller@etsy.com
//     Subject: Your order from UK has shipped
//     Tracking Number: DHL7654321X
//     Carrier: DHL
//     Origin Country: UK
//     Destination Country: US
//     Expected Delivery: ${new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
//     Your order of "British Tea Set" has shipped.
// `;

// const dhlPackage = trackingSystem.extractFromEmail(internationalEmail, sessionId);
// if (dhlPackage?.carrier instanceof DHLInternational) {
//     console.log('\nDHL International Package:');
//     console.log(`- Tracking Number: ${dhlPackage.trackingNumber}`);
//     console.log(`- Status: ${dhlPackage.status}`);
//     console.log(`- Delivery From: ${internationalEmail.match(/Origin Country: (\w+)/)?.[1] || 'Unknown'}`);
//     console.log(`- Valid for International: ${dhlPackage.carrier.validateInternationalTracking(dhlPackage.trackingNumber)}`);
// }

// const hazmatEmail = `
//     From: Laboratory_Supplies@chemlab.com
//     Subject: Chemical shipment
//     Tracking Number: HZ98765432
//     Carrier: CHEMLOG
//     Material Type: flammable
//     Expected Delivery: ${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
//     Your order of "Laboratory Chemicals (Flammable)" has shipped.
// `;

// const hazmatPackage = trackingSystem.extractFromEmail(hazmatEmail, sessionId);
// if (hazmatPackage?.carrier instanceof HazmatCarrier) {
//     console.log('\nHazmat Package:');
//     console.log(`- Tracking Number: ${hazmatPackage.trackingNumber}`);
//     console.log(`- Status: ${hazmatPackage.status}`);
//     console.log(`- Valid Hazmat Class: ${hazmatPackage.carrier.validateHazmatClass('flammable')}`);
//     console.log(`- Handling Instructions: ${hazmatPackage.carrier.getHandlingInstructions('flammable')}`);
// }

// // Test UPS package
// const upsEmail = `
//     From: Amazon.com
//     Subject: Your UPS package is on its way
//     Tracking Number: 1Z999AA1234567890
//     Carrier: UPS
//     Service: Next Day Air
//     Expected Delivery: ${new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
//     Your order of "Gaming Console" has shipped.
// `;

// const upsPackage = trackingSystem.extractFromEmail(upsEmail, sessionId);
// if (upsPackage?.carrier.type === Carrier.TYPES.UPS) {
//     console.log('\nUPS Package:');
//     console.log(`- Tracking Number: ${upsPackage.trackingNumber}`);
//     console.log(`- Status: ${upsPackage.status}`);
//     console.log(`- Carrier: ${upsPackage.carrier.name}`);
// }

// // Test FedEx package
// const fedexEmail = `
//     From: BestBuy.com
//     Subject: Your FedEx package is on its way
//     Tracking Number: 123456789012
//     Carrier: FEDEX
//     Service: Priority
//     Expected Delivery: ${new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().split('T')[0]}
//     Your order of "Laptop" has shipped.
// `;

// const fedexPackage = trackingSystem.extractFromEmail(fedexEmail, sessionId);
// if (fedexPackage?.carrier.type === Carrier.TYPES.FEDEX) {
//     console.log('\nFedEx Package:');
//     console.log(`- Tracking Number: ${fedexPackage.trackingNumber}`);
//     console.log(`- Status: ${fedexPackage.status}`);
//     console.log(`- Carrier: ${fedexPackage.carrier.name}`);
// }

// trackingSystem.logout(sessionId);
// console.log('\nUser logged out'); 