const { PackageTrackingSystem } = require('./package-tracker');

class PackageTrackerCLI {
    constructor() {
        this.trackingSystem = new PackageTrackingSystem();
        this.setupNotifications();
    }

    setupNotifications() {
        this.trackingSystem.subscribe((event, data) => {
            switch (event) {
                case 'NEW_PACKAGE':
                    console.log(`New package added: ${data.trackingNumber}`);
                    break;
                case 'STATUS_UPDATE':
                    console.log(`Package ${data.trackingNumber} status updated to: ${data.status}`);
                    break;
            }
        });
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

        const package = this.trackingSystem.extractFromEmail(emailContent);
        if (package) {
            console.log('Package extracted successfully:', package);
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
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const question = (query) => new Promise((resolve) => readline.question(query, resolve));

        while (true) {
            this.showMenu();
            const choice = await question('Enter your choice (1-6): ');

            switch (choice) {
                case '1':
                    this.simulateEmailInput();
                    break;
                case '2':
                    console.log('\nAll Packages:');
                    console.log(this.trackingSystem.getPackagesSorted());
                    break;
                case '3':
                    const searchQuery = await question('Enter search term: ');
                    console.log(this.trackingSystem.searchPackages(searchQuery));
                    break;
                case '4':
                    const status = await question('Enter status (Delivered/In Transit/Arriving Soon): ');
                    console.log(this.trackingSystem.filterByStatus(status));
                    break;
                case '5':
                    const trackingNumber = await question('Enter tracking number: ');
                    const tag = await question('Enter tag: ');
                    const pkg = this.trackingSystem.packages.find(p => p.trackingNumber === trackingNumber);
                    if (pkg) {
                        pkg.addTag(tag);
                        console.log(`Tag "${tag}" added to package ${trackingNumber}`);
                    }
                    break;
                case '6':
                    console.log('Goodbye!');
                    readline.close();
                    return;
                default:
                    console.log('Invalid choice. Please try again.');
            }
        }
    }
}

// Start the CLI
const cli = new PackageTrackerCLI();
cli.start(); 