# Design Principles and Patterns in Package Tracking System

## Object-Oriented Programming (OOP) Principles

### **Abstraction**
✅ **Good Example:**
Hiding email parsing logic behind an `EmailParser` class.
```js
class EmailParser {
    parseEmail(content) {
        return {
            trackingNumber: this.extractTrackingNumber(content),
            carrier: this.extractCarrier(content),
        };
    }
    extractTrackingNumber(content) {
        return content.match(/Tracking Number: (\w+)/)?.[1] || null;
    }
    extractCarrier(content) {
        return content.match(/Carrier: (\w+)/)?.[1] || null;
    }
}
```
🚫 **Bad Example:**
```js
function parseEmail(content) {
    let trackingNumber = content.match(/Tracking Number: (\w+)/)?.[1];
    let carrier = content.match(/Carrier: (\w+)/)?.[1];
    return { trackingNumber, carrier };
}
```

---
### **Encapsulation**
✅ **Good Example:**
Encapsulating user data within the `User` class to restrict direct modification.
```js
class User {
    constructor(username, email) {
        this._username = username;
        this._email = email;
        this._packages = []; // Private field
    }
    
    addPackage(pkg) {
        this._packages.push(pkg);
    }
    
    getPackages() {
        return [...this._packages]; // Return a copy to prevent direct modification
    }
}
```
🚫 **Bad Example:**
```js
class User {
    constructor(username, email) {
        this.username = username;
        this.email = email;
        this.packages = []; // No encapsulation
    }
}
const user = new User("lacey", "lacey@example.com");
user.packages.push("fake_package"); // Direct modification (violates encapsulation)
```

---
### **Inheritance**
✅ **Good Example:**
Defining a `Carrier` superclass and extending it for specific carrier types.
```js
class Carrier {
    constructor(name, trackingPattern) {
        this.name = name;
        this.trackingPattern = trackingPattern;
    }
}

class DHL extends Carrier {
    constructor() {
        super("DHL", /DHL\d{10}/);
    }
}
```
🚫 **Bad Example:**
Using redundant attributes instead of inheritance:
```js
class DHL {
    constructor() {
        this.name = "DHL";
        this.trackingPattern = /DHL\d{10}/;
    }
}
```
---
### **Polymorphism**
✅ **Good Example:**
Each carrier class overrides `generateTrackingLink()` differently.
```js
class Carrier {
    generateTrackingLink(trackingNumber) {
        throw new Error("Method must be implemented");
    }
}
class FedEx extends Carrier {
    generateTrackingLink(trackingNumber) {
        return `https://www.fedex.com/track/${trackingNumber}`;
    }
}
```
🚫 **Bad Example:**
Using `if` conditions instead of polymorphism:
```js
function getTrackingLink(carrier, trackingNumber) {
    if (carrier === "FedEx") {
        return `https://www.fedex.com/track/${trackingNumber}`;
    } else if (carrier === "DHL") {
        return `https://www.dhl.com/track/${trackingNumber}`;
    }
}
```

---
## SOLID Principles

### **Single Responsibility Principle (SRP)**
✅ **Good Example:**
Separate classes for `EmailParser` and `PackageTrackingSystem`.
```js
class EmailParser {
    extractTrackingNumber(emailContent) {
        return emailContent.match(/Tracking Number: (\w+)/)?.[1];
    }
}
class PackageTrackingSystem {
    addPackage(emailContent) {
        const trackingNumber = new EmailParser().extractTrackingNumber(emailContent);
        if (trackingNumber) console.log("Package Added:", trackingNumber);
    }
}
```
🚫 **Bad Example:**
One class doing multiple things.
```js
class PackageTrackingSystem {
    extractTrackingNumber(emailContent) {
        return emailContent.match(/Tracking Number: (\w+)/)?.[1];
    }
    addPackage(emailContent) {
        const trackingNumber = this.extractTrackingNumber(emailContent);
        if (trackingNumber) console.log("Package Added:", trackingNumber);
    }
}
```
---
## 📌 SOLID Principles

### **Single Responsibility Principle (SRP)**
✅ **Good Example:**
```js
class EmailParser {
    extractTrackingNumber(emailContent) {
        return emailContent.match(/Tracking Number: (\w+)/)?.[1];
    }
}
```
🚫 **Bad Example:**
```js
class PackageTrackingSystem {
    extractTrackingNumber(emailContent) {
        return emailContent.match(/Tracking Number: (\w+)/)?.[1];
    }
    addPackage(emailContent) {
        const trackingNumber = this.extractTrackingNumber(emailContent);
        console.log("Package Added:", trackingNumber);
    }
}
```

### **Open/Closed Principle (OCP)**
✅ **Good Example:**
```js
class Carrier {
    generateTrackingLink(trackingNumber) {
        throw new Error("Method must be implemented");
    }
}
```
🚫 **Bad Example:**
```js
function getTrackingLink(carrier, trackingNumber) {
    if (carrier === "UPS") return `https://ups.com/${trackingNumber}`;
    if (carrier === "FedEx") return `https://fedex.com/${trackingNumber}`;
}
```

### **Liskov Substitution Principle (LSP)**
✅ **Good Example:**
```js
class DHLCarrier extends Carrier {
    generateTrackingLink(trackingNumber) {
        return `https://www.dhl.com/track/${trackingNumber}`;
    }
}
```
🚫 **Bad Example:**
```js
class SpecialDHL extends Carrier {
    generateTrackingLink(trackingNumber) {
        return null; // Violates LSP by not implementing expected behavior
    }
}
```

### **Interface Segregation Principle (ISP)**
✅ **Good Example:**
```js
class Notifiable {
    sendNotification() {}
}
class Trackable {
    trackPackage() {}
}
```
🚫 **Bad Example:**
```js
class Carrier {
    sendNotification() {}
    trackPackage() {}
}
```

### **Dependency Inversion Principle (DIP)**
✅ **Good Example:**
```js
class PackageTrackingSystem {
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
}
```
🚫 **Bad Example:**
```js
class PackageTrackingSystem {
    constructor() {
        this.notificationService = new EmailNotificationService(); // Hard dependency
    }
}
```

---
## Design Patterns

### **Factory Pattern**
✅ **Good Example:**
```js
class CarrierFactory {
    static createCarrier(type) {
        switch (type) {
            case "DHL": return new DHL();
            case "FedEx": return new FedEx();
            default: throw new Error("Unknown carrier type");
        }
    }
}
```
🚫 **Bad Example:**
```js
function createCarrier(type) {
    let carrier;
    if (type === "DHL") carrier = new DHL();
    else if (type === "FedEx") carrier = new FedEx();
    else throw new Error("Unknown carrier type");
    return carrier;
}
```

---
### **Observer Pattern**
✅ **Good Example:**
```js
class NotificationSystem {
    constructor() {
        this.subscribers = [];
    }
    subscribe(subscriber) {
        this.subscribers.push(subscriber);
    }
    notify(event) {
        this.subscribers.forEach(subscriber => subscriber.update(event));
    }
}
```
🚫 **Bad Example:**
```js
class NotificationSystem {
    notify(event, user) {
        if (user.preference === "email") {
            console.log("Send Email Notification");
        } else if (user.preference === "SMS") {
            console.log("Send SMS Notification");
        }
    }
}
```

---
### **Singleton Pattern**
✅ **Good Example:**
```js
class UserManager {
    constructor() {
        if (!UserManager.instance) {
            UserManager.instance = this;
            this.users = [];
        }
        return UserManager.instance;
    }
}
```
🚫 **Bad Example:**
```js
class UserManager {
    constructor() {
        this.users = [];
    }
}
const manager1 = new UserManager();
const manager2 = new UserManager(); // Multiple instances (not a singleton)
```

---
## 🎯 Conclusion
This system follows **OOP, SOLID, and design patterns** to ensure a well-structured and maintainable package tracking system. 🚀
