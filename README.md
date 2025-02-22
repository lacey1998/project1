# 📦 Package Tracking System

A system for tracking packages and delivery notifications across multiple carriers.

## Project Overview
This **Package Tracking System** is designed to extract package details from emails automatically, sort them by delivery date, and notify users of upcoming deliveries. The system **prioritizes object-oriented programming (OOP) principles** and is implemented using **JavaScript**.

⚡ **Key Features:**
- Extracts package information (tracking number, shipping company, sender, delivery date) from emails.
- Organizes packages by **delivery date** and allows users to filter by status (**Delivered, In Transit, Arriving Soon**).
- Simulates **notifications** for upcoming deliveries.
- Enables users to **categorize** packages (Electronics, Clothing, Gift).
- Supports **search and filtering** by tracking number, sender, or category.

## 📂 Project Structure
```
PROJECT1/
│── docs/                      # Documentation (JSDoc)
│── src/
│   ├── models/                # Data models
│   │   ├── Address.js         # Address representation
│   │   ├── Carrier.js         # Carrier abstraction
│   │   ├── Package.js         # Package details
│   │   ├── ShipmentHistory.js # Package tracking history
│   │   ├── StatusUpdate.js    # Status update representation
│   │   ├── Tag.js             # Tags for categorization
│   │   ├── User.js            # User entity
│   │   ├── UserPreferences.js # User preferences model
│   ├── services/              # Business logic services
│   │   ├── EmailParser.js     # Parses email for tracking details
│   │   ├── UserManager.js     # Manages user authentication
│   ├── main.js                # Main CLI application
│   ├── PackageTrackingSystem.js # Core package tracking logic
│── CS5700 Project1.pdf        # Business requirements, UML, mockups
│── DESIGN_PRINCIPLES.md       # OOP, SOLID, and design pattern documentation
│── jsdoc.json                 # JSDoc configuration
│── LICENSE.txt                # License information
│── package.json               # Project dependencies
│── README.md                  # Project documentation
```

## 📖 How to Use
### **1️⃣ Installation**
```sh
# Clone the repository
git clone https://github.com/lacey1998/project1.git
cd project1

# Install dependencies
npm install
```

### **2️⃣ Running the CLI**
```sh
node src/main.js
```

### **3️⃣ Available Options**
Once you start the CLI, you will see the following options:
```
=== 📦 Package Tracking System ===
1. Add package from email
2. Add hazmat package from email
3. Add international package from email
4. View all packages
5. Search packages
6. Filter by status
7. Add tag to package
8. Show notifications
9. Exit
==================================
```

### **4️⃣ Email Simulations**
The system provides three email simulations for testing:
- **Regular Package Email (UPS)** → Option `1`
- **Hazmat Package Email** → Option `2`
- **International Package Email (DHL)** → Option `3`

These simulate receiving shipment notifications and extracting tracking details. Full email details can be viewed in `main.js`.

## 🛠️ Technical Stack
- **Node.js** – JavaScript runtime
- **JSDoc** – Documentation generation
- **Object-Oriented Programming (OOP)** – Encapsulation, Inheritance, Polymorphism
- **SOLID Principles** – Clean architecture design
- **Design Patterns** – Factory, Observer, Singleton

## 📈 Future Enhancements
- Integration with **real-time tracking APIs** (FedEx, UPS, DHL).
- Actual **email parsing implementation**.
- User interface for better interaction.

## Youtube Video
- https://youtu.be/NcwBXck2xJY

## UML Diagram
- https://lucid.app/lucidchart/f09e9faa-2289-42c8-aac8-a565e59f32de/edit?invitationId=inv_32b86b0b-176c-4a36-99b2-6c56b5d748f3&page=0_0# 

## 📜 License
This project is licensed under the **MIT License**.


## 📌 Use of Generative AI in Development

### **Purpose**
Generative AI (ChatGPT) was consulted during development to enhance my understanding of software design principles, including the **SOLID principles** and **design patterns**, as well as for brainstorming child classes for the `Carrier` class.

### **Prompts and Responses**

#### **Prompt:**
_"Explain the SOLID principles with examples in JavaScript."_

✅ **Response:**
ChatGPT provided explanations and examples for each SOLID principle, including **good and bad examples** to illustrate best practices.
- **Single Responsibility Principle (SRP):** Suggested refactoring classes that handle multiple concerns into smaller, focused classes.
- **Open/Closed Principle (OCP):** Recommended using abstraction to allow extensions without modifying existing code.
- **Liskov Substitution Principle (LSP):** Highlighted the need for subclasses to behave as expected when used in place of their parent class.
- **Interface Segregation Principle (ISP):** Suggested breaking large interfaces into smaller, specific ones.
- **Dependency Inversion Principle (DIP):** Encouraged using dependency injection to decouple high-level modules from low-level details.

---

#### **Prompt:**
_"Explain the Factory, Observer, and Singleton design patterns with examples."_

✅ **Response:**
ChatGPT provided practical implementations for these patterns:
- **Factory Pattern:** Used to create `Carrier` objects dynamically based on the shipping provider.
- **Observer Pattern:** Applied in the `NotificationSystem` to notify users of package status updates.
- **Singleton Pattern:** Ensured only one instance of `UserManager` exists.

🚫 **Bad Example for Factory Pattern:**
```js
function createCarrier(type) {
    let carrier;
    if (type === "DHL") carrier = new DHL();
    else if (type === "FedEx") carrier = new FedEx();
    else throw new Error("Unknown carrier type");
    return carrier;
}
```
This approach lacks scalability as new carrier types require modifying this function, violating the Open/Closed Principle.

✅ **Good Example for Factory Pattern:**
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
This implementation allows new carrier types to be added without modifying existing code.

---

#### **Prompt:**
_"What is a good child class for the Carrier class that has unique attributes and methods?"_

✅ **Response:**
ChatGPT suggested child classes that already exist in the codebase:

1. **DHLInternational** (for handling international shipments)
```js
class DHLInternational extends Carrier {
    constructor() {
        super("DHL", /DHL\d{10}/);
        this.internationalZones = [];
    }
    validateInternationalTracking(trackingNumber) {
        return trackingNumber.startsWith("DHL");
    }
}
```

2. **HazmatCarrier** (for hazardous material shipments)
```js
class HazmatCarrier extends Carrier {
    constructor() {
        super("CHEMLOG", /HZ\d{8}/);
        this.hazmatClasses = ["flammable", "corrosive", "radioactive"];
    }
    getHandlingInstructions(materialType) {
        const instructions = {
            "flammable": "Keep away from heat sources",
            "corrosive": "Handle with protective gear",
            "radioactive": "Special containment required"
        };
        return instructions[materialType] || "No special instructions";
    }
}
```
### **How It Was Used**
- It helps me understand the SOLID and design principles of OOP, I use some of ChatGPT's response plus my own finding to finish the Design_Principle.md
- The suggestions for the child class helps me introduce inheritence to my projects, I use ChatGPT's suggestion. 
