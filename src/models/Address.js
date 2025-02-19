class Address {
    constructor(addressString) {
        const parts = this.parseAddress(addressString);
        this.name = parts.name || '';
        this.street = parts.street || '';
        this.city = parts.city || '';
        this.state = parts.state || '';
        this.zipCode = parts.zipCode || '';
    }

    parseAddress(addressString) {
        return {
            name: addressString,
            street: '',
            city: '',
            state: '',
            zipCode: ''
        };
    }

    toString() {
        return `${this.name}, ${this.street}, ${this.city}, ${this.state} ${this.zipCode}`;
    }
}

export default Address; 