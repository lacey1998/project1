/**
 * Represents a physical address.
 * @class
 */
class Address {
    /**
     * Creates a new Address instance.
     * @param {Object} details - Address details
     * @param {string} details.street - Street address
     * @param {string} details.city - City
     * @param {string} details.state - State/Province
     * @param {string} details.country - Country
     * @param {string} details.zipCode - Postal/ZIP code
     */
    constructor({ street, city, state, country, zipCode }) {
        this.street = street;
        this.city = city;
        this.state = state;
        this.country = country;
        this.zipCode = zipCode;
    }

    /**
     * Converts address to string format.
     * @returns {string} Formatted address string
     */
    toString() {
        return `${this.street}, ${this.city}, ${this.state} ${this.zipCode}, ${this.country}`;
    }
}

export default Address; 