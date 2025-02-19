import User from '../models/User.js';

/**
 * Manages user accounts and sessions.
 * @class
 */
class UserManager {
    /**
     * Creates a new UserManager instance.
     */
    constructor() {
        this.users = new Map(); // username -> User
        this.sessions = new Map();
    }

    /**
     * Registers a new user.
     * @param {Object} details - User registration details
     * @param {string} details.username - Username
     * @param {string} details.email - Email address
     * @param {string} details.password - Password
     * @returns {User} The newly created user
     */
    registerUser(details) {
        if (this.users.has(details.username)) {
            throw new Error('Username already exists');
        }

        const user = new User({ username: details.username, email: details.email, password: details.password });
        this.users.set(details.username, user);
        return user;
    }

    /**
     * Logs in a user.
     * @param {string} username - Username
     * @param {string} password - Password
     * @returns {string} Session ID
     * @throws {Error} If login fails
     */
    login(username, password) {
        const user = this.users.get(username);
        if (!user || !user.validatePassword(password)) {
            throw new Error('Invalid username or password');
        }

        const sessionId = this.generateSessionId();
        this.sessions.set(sessionId, user);
        return sessionId;
    }

    logout(sessionId) {
        this.sessions.delete(sessionId);
    }

    getUser(sessionId) {
        return this.sessions.get(sessionId);
    }

    generateSessionId() {
        // In a real app, use a proper session ID generator
        return `session_${Date.now()}_${Math.random()}`;
    }
}

export default UserManager; 