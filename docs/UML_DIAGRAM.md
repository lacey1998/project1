@startuml Package Tracking System

' Base Classes
class Carrier {
  -name: String
  -trackingPattern: RegExp
  +generateTrackingLink(trackingNumber: String): String
  +validateTrackingNumber(trackingNumber: String): Boolean
}

class DHLInternational {
  +constructor()
  -name: "DHL International"
  -trackingPattern: /DHL[A-Z0-9]{7}X/
  +validateInternationalTracking(trackingNumber: String): Boolean
  +getInternationalShippingZones(): Array<String>
  -internationalZones: Array<String>
  +generateTrackingLink(trackingNumber: String): String
}

class HazmatCarrier {
  +constructor()
  -name: "Chemical Logistics"
  -trackingPattern: /HZ\d{8}/
  +validateHazmatClass(materialClass: String): Boolean
  +getHandlingInstructions(materialType: String): String
  -hazmatClasses: Array<String>
  -safetyProtocols: Map<String, String>
  +generateTrackingLink(trackingNumber: String): String
}

' Other Core Classes
class Package {
  -trackingNumber: String
  -carrier: Carrier
  -sender: Address
  -description: String
  -estimatedDeliveryDate: Date
  -status: String
  -tags: Array
  -trackingLink: String
  -history: ShipmentHistory
  +addTag(tagName: String): void
  +removeTag(tagName: String): void
  +updateStatus(newStatus: String): void
}

class User {
  -username: String
  -email: String
  -passwordHash: String
  -packages: Array
  -preferences: UserPreferences
  +addPackage(pkg: Package): void
  +removePackage(trackingNumber: String): void
  +getPackages(): Array
}

class PackageTrackingSystem {
  -packages: Array
  -subscribers: Array
  -carriers: Map
  -emailParser: EmailParser
  -userManager: UserManager
  +registerUser(userDetails: Object): User
  +login(username: String, password: String): String
  +logout(sessionId: String): void
  +extractFromEmail(emailContent: String, sessionId: String): Package
}

' Relationships
Carrier <|-- DHLInternational
Carrier <|-- HazmatCarrier

Package "*" --o "1" User : belongs to
Package "1" --> "1" Carrier : uses
PackageTrackingSystem "1" --> "*" Carrier : manages
PackageTrackingSystem "1" --> "1" EmailParser : uses
PackageTrackingSystem "1" --> "1" UserManager : uses

@enduml 