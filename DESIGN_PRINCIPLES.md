# Package Tracking System Design Documentation

## OOP Pillars Examples

### 1. Abstraction
The `EmailParser` class abstracts away the complexity of parsing emails:

Javascript
// EmailParser abstracts email parsing complexity
class EmailParser {
parse(emailContent) {
// Complex parsing logic hidden from users
const trackingInfo = this.findTrackingInfo(emailContent);
return {
trackingNumber: trackingInfo.trackingNumber,
carrier: trackingInfo.carrier,
sender: this.extractSender(emailContent),
description: this.extractDescription(emailContent)
};
}
}
// Bad Example - Breaking Abstraction:
class BadEmailParser {
parse(email) {
// Exposing internal implementation details
this.content = email.split('\n');
this.headers = this.parseHeaders();
this.body = this.parseBody();
// Forces users to understand internals
}
}

### 2. Encapsulation
Demonstrated through private data and controlled access:

```javascript
class User {
    #passwordHash; // Private field
    
    constructor({ username, password }) {
        this.username = username;
        this.#passwordHash = this.hashPassword(password);
    }

    validatePassword(password) {
        return this.#passwordHash === this.hashPassword(password);
    }
}

// Bad Example - Breaking Encapsulation:
class BadUser {
    constructor(username, password) {
        this.username = username;
        this.password = password; // Exposed sensitive data!
    }
}
```

### 3. Inheritance
Shown in the carrier hierarchy:

```javascript
class BaseCarrier {
    constructor(config) {
        this.name = config.name;
        this.trackingPattern = config.trackingPattern;
    }

    validateTrackingNumber(number) {
        return this.trackingPattern.test(number);
    }
}

class FedExCarrier extends BaseCarrier {
    constructor() {
        super({
            name: 'FedEx',
            trackingPattern: /(\b\d{12}\b|\b\d{15}\b)/
        });
    }
}

// Bad Example - Breaking Inheritance:
class BadCarrier {
    // Duplicating code instead of inheriting
    validateTrackingNumber(number) {
        return /(\b\d{12}\b|\b\d{15}\b)/.test(number);
    }
}
```

### 4. Polymorphism
Demonstrated through carrier interfaces:

```javascript
class Package {
    constructor(carrier) {
        this.carrier = carrier;
    }

    getTrackingUrl() {
        // Works with any carrier type
        return this.carrier.generateTrackingLink(this.trackingNumber);
    }
}

// Bad Example - Breaking Polymorphism:
class BadPackage {
    getTrackingUrl() {
        switch(this.carrierType) {
            case 'fedex':
                return `fedex.com/${this.number}`;
            case 'ups':
                return `ups.com/${this.number}`;
            // Hard-coded for each type
        }
    }
}
```

## SOLID Principles Implementation

### 1. Single Responsibility Principle (SRP)
Each class has one primary responsibility:

```javascript
// Good - Single Responsibility
class EmailParser {
    parse(emailContent) { /* ... */ }
}

class UserManager {
    authenticateUser(credentials) { /* ... */ }
}

// Bad - Multiple Responsibilities
class BadSystem {
    parseEmail() { /* ... */ }
    authenticateUser() { /* ... */ }
    generateInvoice() { /* ... */ }
}
```

### 2. Open/Closed Principle (OCP)
System is open for extension but closed for modification:

```javascript
// Good - Open for Extension
class CarrierConfig {
    constructor(name, pattern, urlTemplate) {
        this.name = name;
        this.pattern = pattern;
        this.urlTemplate = urlTemplate;
    }
}

const newCarrier = new CarrierConfig(
    'NewCarrier',
    /\d{10}/,
    'newcarrier.com/track/{number}'
);

// Bad - Closed for Extension
class BadCarrierSystem {
    validateNumber(carrier, number) {
        if (carrier === 'fedex') { /* ... */ }
        else if (carrier === 'ups') { /* ... */ }
        // Must modify code to add carriers
    }
}
```

### 3. Liskov Substitution Principle (LSP)
Subtypes must be substitutable for their base types:

```javascript
// Good - LSP Compliance
class Carrier {
    validateTrackingNumber(number) {
        return this.pattern.test(number);
    }
}

class FedExCarrier extends Carrier {
    // Maintains the same contract
    validateTrackingNumber(number) {
        return super.validateTrackingNumber(number);
    }
}

// Bad - LSP Violation
class BadCarrier extends Carrier {
    validateTrackingNumber() {
        return true; // Breaking the contract!
    }
}
```

### 4. Interface Segregation Principle (ISP)
Clients shouldn't depend on interfaces they don't use:

```javascript
// Good - Segregated Interfaces
class BasicCarrier {
    validateTrackingNumber(number) { /* ... */ }
}

class PremiumCarrier extends BasicCarrier {
    calculateShippingCost() { /* ... */ }
}

// Bad - Fat Interface
class BadCarrier {
    validateNumber() { /* ... */ }
    calculateCost() { /* ... */ }
    handleCustoms() { /* ... */ }
    // Forces all carriers to implement everything
}
```

### 5. Dependency Inversion Principle (DIP)
High-level modules should depend on abstractions:

```javascript
// Good - Depends on Abstraction
class PackageTracker {
    constructor(notificationService) {
        this.notifier = notificationService;
    }

    updateStatus(status) {
        this.notifier.notify(status);
    }
}

// Bad - Depends on Concrete Implementation
class BadTracker {
    constructor() {
        this.emailService = new EmailService();
        this.smsService = new SMSService();
    }
}
```

## Design Patterns Implementation

### 1. Observer Pattern
Used for package status notifications:

```javascript
class PackageTrackingSystem {
    constructor() {
        this.subscribers = [];
    }

    subscribe(callback) {
        this.subscribers.push(callback);
    }

    notifySubscribers(event, data) {
        this.subscribers.forEach(callback => callback(event, data));
    }
}
```

### 2. Factory Pattern
For creating carrier instances:

```javascript
class CarrierFactory {
    static createCarrier(type) {
        const configs = {
            FEDEX: {
                name: 'FedEx',
                pattern: /(\b\d{12}\b|\b\d{15}\b)/,
                urlTemplate: 'fedex.com/track/{number}'
            },
            UPS: {
                name: 'UPS',
                pattern: /\b1Z[A-Z0-9]{16}\b/,
                urlTemplate: 'ups.com/track/{number}'
            }
        };

        return new Carrier(configs[type]);
    }
}
```

### 3. Singleton Pattern
For user session management:

```javascript
class UserManager {
    static instance = null;

    static getInstance() {
        if (!this.instance) {
            this.instance = new UserManager();
        }
        return this.instance;
    }

    constructor() {
        if (UserManager.instance) {
            throw new Error('Use getInstance()');
        }
        this.sessions = new Map();
    }
}
```

### 4. Adapter Pattern
For integrating different APIs:

```javascript
class LegacyAPI {
    getTrackingInfo(number) { /* ... */ }
}

class NewAPI {
    fetchTracking(number) { /* ... */ }
}

class TrackingAdapter {
    constructor(legacyAPI) {
        this.legacyAPI = legacyAPI;
    }

    getTrackingInfo(number) {
        return this.legacyAPI.getTrackingInfo(number);
    }
}
```

### 5. Decorator Pattern
For adding behavior dynamically:

```javascript
class Package {
    constructor(carrier) {
        this.carrier = carrier;
    }

    getTrackingUrl() {
        return this.carrier.generateTrackingLink(this.trackingNumber);
    }
}

class PremiumPackage extends Package {
    getTrackingUrl() {
        return `https://premium.carrier.com/track/${this.trackingNumber}`;
    }
}
```
    