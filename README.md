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
- `/docs/`: This directory contains **JSDoc-generated documentation** for the project. After running `npm run doc`, JSDoc will generate an HTML documentation site here. Open `docs/index.html` in a browser to view the API documentation.
- `CS5700 Project 1 Design a Social Network.pdf`: The project specification document outlining the requirements and objectives.
- `DESIGN_PRINCIPLES.md`: A markdown file demonstrate the application of object oriented programming in my code, such as OOP pillars, SOLID Principles, and design patterns.
- `/src/`
- `cli.js`: The command-line interface script that allows users to interact with the package tracking system via terminal commands.
- `package-tracker.js`: The core module responsible for parsing emails, extracting package information, and managing package statuses.
- `user.js`: Module defining the `User` class, handling user-specific data and preferences.
- models & services inlcudes all the classes in this project
- Root Files


## How to Use
1. Please clone the repository
```bash
git clone https://github.com/lacey1998/project1
cd project1
```

2. Install Dependencies

```bash
npm install
```

3. To run the basic example in main.js please run

```bash
node main.js
```


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



