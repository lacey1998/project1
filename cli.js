import { PackageTrackingSystem } from './package-tracker.js';
import readline from 'readline/promises';  // Using the promises version of readline

class PackageTrackerCLI {
    constructor() {
        this.trackingSystem = new PackageTrackingSystem();
        this.setupNotifications();
    }

    static getNotificationHandler() {
        return (event, data) => {
            switch (event) {
                case 'NEW_PACKAGE':
                    console.log(`New package added: ${data.trackingNumber}`);
                    break;
                case 'STATUS_UPDATE':
                    console.log(`Package ${data.trackingNumber} status updated to: ${data.status}`);
                    break;
                case 'DELIVERY_TOMORROW':
                    console.log(`🚚 DELIVERY ALERT: Package ${data.trackingNumber} will be delivered tomorrow!`);
                    break;
            }
        };
    }

    setupNotifications() {
        this.trackingSystem.subscribe(PackageTrackerCLI.getNotificationHandler());
    }

    // Example email content for testing
    simulateEmailInput() {
        const emailContent = `
            From: Amazon.com
            Subject: Your package is on its way
            
            Tracking Number: 1Z999AA1234567890
            Carrier: UPS
            Expected Delivery: 2024-02-20
            
            Your recent order of "Wireless Headphones" has shipped.
        `;

        const pkg = this.trackingSystem.extractFromEmail(emailContent);
        if (pkg) {
            console.log('Package extracted successfully:', pkg);
        }
    }

    // Command-line interface methods
    showMenu() {
        console.log('\n=== Package Tracking System ===');
        console.log('1. Add package from email');
        console.log('2. View all packages');
        console.log('3. Search packages');
        console.log('4. Filter by status');
        console.log('5. Add tag to package');
        console.log('6. Exit');
        console.log('===========================');
    }

    async start() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        while (true) {
            this.showMenu();
            const choice = await rl.question('Enter your choice (1-6): ');

            switch (choice) {
                case '1':
                    this.simulateEmailInput();
                    break;
                case '2':
                    console.log('\nAll Packages:');
                    console.log(this.trackingSystem.getPackagesSorted());
                    break;
                case '3':
                    const searchQuery = await rl.question('Enter search term: ');
                    console.log(this.trackingSystem.searchPackages(searchQuery));
                    break;
                case '4':
                    const status = await rl.question('Enter status (Delivered/In Transit/Arriving Soon): ');
                    console.log(this.trackingSystem.filterByStatus(status));
                    break;
                case '5':
                    const trackingNumber = await rl.question('Enter tracking number: ');
                    const tag = await rl.question('Enter tag: ');
                    const pkg = this.trackingSystem.packages.find(p => p.trackingNumber === trackingNumber);
                    if (pkg) {
                        pkg.addTag(tag);
                        console.log(`Tag "${tag}" added to package ${trackingNumber}`);
                    }
                    break;
                case '6':
                    console.log('Goodbye!');
                    rl.close();
                    return;
                default:
                    console.log('Invalid choice. Please try again.');
            }
        }
    }
}

// Start the CLI
const cli = new PackageTrackerCLI();
// cli.start();

export { PackageTrackerCLI }; 