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

## Project Structure
PROJECT1/ │── docs/ # Documentation (JSDoc) │── node_modules/ # Dependencies │── src/ │ ├── models/ # Data models │ │ ├── Address.js # Address representation │ │ ├── Carrier.js # Carrier abstraction │ │ ├── Package.js # Package details │ │ ├── ShipmentHistory.js # Package tracking history │ │ ├── StatusUpdate.js # Status update representation │ │ ├── Tag.js # Tags for categorization │ │ ├── User.js # User entity │ │ ├── UserPreferences.js # User preferences model │ ├── services/ # Business logic services │ │ ├── EmailParser.js # Parses email for tracking details │ │ ├── UserManager.js # Manages user authentication │ ├── main.js # Main CLI application │ ├── PackageTrackingSystem.js # Core package tracking logic │── CS5700 Project1.pdf # Business requirements, UML, mockups │── Design_principles.md # OOP, SOLID, and design pattern documentation │── jsdoc.json # JSDoc configuration │── LICENSE.txt # License information │── package.json # Project dependencies │── README.md # Project documentation


## 📖 How to Use
### **1️⃣ Installation**
```sh
# Clone the repository
git clone https://github.com/lacey1998/project1.git
cd project1

# Install dependencies
npm install

### **2️⃣ Running the CLI**
node src/main.js

### **3️⃣ Available Options**
Once you start the CLI, you will see the following options:
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

### **4️⃣ Email Simulations**
The system provides three email simulations for testing:

- Regular Package Email (UPS) → Option 1
- Hazmat Package Email → Option 2
- International Package Email (DHL) → Option 3
These simulate receiving shipment notifications and extracting tracking details.Full email can be viewed in main.js. 

## 🛠️ Technical Stack
Node.js – JavaScript runtime
JSDoc – Documentation generation
# More explanation for below can be found in Design_principles.md 
Object-Oriented Programming (OOP) – Encapsulation, Inheritance, Polymorphism
SOLID Principles – Clean architecture design
Design Patterns – Factory, Observer, Singleton

## Future Enhancements
- Integration with **real-time tracking APIs** (FedEx, UPS, DHL).
- Actual **email parsing implementation**.
- User interface for better interaction.

## Youtube Video
- https://youtu.be/qQeD8JyUKIY

## UML Diagram
- https://lucid.app/lucidchart/f09e9faa-2289-42c8-aac8-a565e59f32de/edit?invitationId=inv_32b86b0b-176c-4a36-99b2-6c56b5d748f3&page=0_0# 

## License
This project is licensed under the MIT License. See the LICENSE file for details.

