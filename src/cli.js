import PackageTrackingSystem from './PackageTrackingSystem.js';
import readline from 'readline/promises'; // Using the promises version of readline
import Package from './models/Package.js';

/**
 * Command Line Interface for the Package Tracking System.
 * Handles user interaction through a menu-based system.
 * @class
 */
export class PackageTrackerCLI {
    /**
     * Initializes the CLI and sets up package tracking system.
     */
    constructor() {
        this.trackingSystem = new PackageTrackingSystem();
        this.sessionId = null; // Store logged-in session
        this.setupNotifications();
    }

    /**
     * Gets the notification handler for CLI output.
     * @returns {Function} Notification handler function
     */
    static getNotificationHandler() {
        return (event, data) => {
            switch (event) {
                case 'NEW_PACKAGE':
                    console.log(`📦 New package added: ${data.trackingNumber}`);
                    break;
                case 'STATUS_UPDATE':
                    console.log(`📦 Package ${data.trackingNumber} status updated to: ${data.status}`);
                    break;
                case 'DELIVERY_TOMORROW':
                    console.log(`🚚 DELIVERY ALERT: Package ${data.trackingNumber} will be delivered tomorrow!`);
                    break;
            }
        };
    }

    /**
     * Subscribes the CLI to package tracking notifications.
     */
    setupNotifications() {
        this.trackingSystem.subscribe(PackageTrackerCLI.getNotificationHandler());
    }

    /**
     * Simulates user login to ensure package tracking works properly.
     * @returns {Promise<string|null>} The session ID if login is successful, otherwise null.
     */
    async ensureUserRegistered() {
        const username = `user_${Date.now()}`;  // 🔹 Unique username
        const password = 'securepassword';
        const email = `${username}@example.com`;
    
        console.log(`🔹 Registering new user: ${username}...`);
        
        try {
            // Register a new user
            this.trackingSystem.registerUser({ username, password, email });
            const sessionId = this.trackingSystem.login(username, password);
            console.log(`✅ User successfully registered and logged in. Session ID: ${sessionId}`);
            this.sessionId = sessionId;
            return sessionId;
        } catch (error) {
            console.error('❌ Error during registration:', error.message);
        }
    }


    /**
     * Simulates extracting package details from an email.
     * Ensures the user is logged in before extracting package data.
     */
    async simulateEmailInput() {
        const sessionId = await this.ensureUserRegistered(); // Ensure user is logged in
        if (!sessionId) return;

        const emailContent = `
            From: Amazon.com
            Subject: Your package is on its way
            
            Tracking Number: 1Z999AA1234567890
            Carrier: UPS
            Expected Delivery: 2024-02-20
            
            Your recent order of "Wireless Headphones" has shipped.
        `;

        try {
            const pkg = this.trackingSystem.extractFromEmail(emailContent, sessionId);
            if (pkg) {
                console.log('✅ Package extracted successfully:', pkg);
            } else {
                console.log('⚠️ No package found in email.');
            }
        } catch (error) {
            console.error('❌ Error extracting package:', error.message);
        }
    }

    /**
     * Displays the CLI menu options.
     */
    showMenu() {
        console.log('\n=== 📦 Package Tracking System ===');
        console.log('1. Add package from email');
        console.log('2. View all packages');
        console.log('3. Search packages');
        console.log('4. Filter by status');
        console.log('5. Add tag to package');
        console.log('6. Exit');
        console.log('==================================');
    }

    /**
     * Starts the CLI and listens for user input.
     */
    async start() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        await this.ensureUserRegistered();
        while (true) {
            this.showMenu();
            const choice = await rl.question('Enter your choice (1-6): ');

            switch (choice) {
                case '1': // Extract package from email
                    await this.simulateEmailInput();
                    break;
                case '2': // View all packages
                    console.log('\n📦 All Packages:');
                    console.log(this.trackingSystem.getPackagesSorted(this.sessionId));
                    break;
                case '3': // Search packages
                    const searchQuery = await rl.question('🔍 Enter search term: ');
                    console.log(this.trackingSystem.searchPackages(searchQuery, this.sessionId));
                    break;
                case '4': // Filter by status
                    console.log('\n📦 Available status types:');
                    Object.values(Package.STATUS_TYPES).forEach(status => 
                        console.log(`- ${status}`)
                    );
                    const status = await rl.question('Enter status: ');
                    console.log(this.trackingSystem.filterByStatus(status, this.sessionId));
                    break;
                case '5': // Add a tag to a package
                    const trackingNumber = await rl.question('Enter tracking number: ');
                    const tag = await rl.question('Enter tag: ');
                    const pkg = this.trackingSystem.packages.find(p => p.trackingNumber === trackingNumber);
                    if (pkg) {
                        pkg.addTag(tag);
                        console.log(`🏷️ Tag "${tag}" added to package ${trackingNumber}`);
                    } else {
                        console.log('❌ Package not found.');
                    }
                    break;
                case '6': // Exit
                    console.log('👋 Goodbye!');
                    rl.close();
                    return;
                default:
                    console.log('❌ Invalid choice. Please try again.');
            }
        }
    }
}

// Start the CLI
const cli = new PackageTrackerCLI();
cli.start();
