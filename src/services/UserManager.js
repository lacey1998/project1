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
        this.users = new Map();
        // if (!globalThis.__users) {
        //     globalThis.__users = new Map(); // Store users persistently during runtime
        // }
        // if (!globalThis.__sessions) {
        //     globalThis.__sessions = new Map();
        // }

        // this.users = globalThis.__users;
        // this.sessions = globalThis.__sessions;
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
    
        const user = new User({
            username: details.username,
            email: details.email,
            password: details.password,  // 🔹 Store plain text password
        });
    
        this.users.set(details.username, user);
        console.log(`✅ User registered successfully: ${details.username}`);
        console.log("🔍 Debug: Users after registration:", Array.from(this.users.keys())); 
    
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
        console.log("🔍 Debug: All registered users:", Array.from(this.users.keys()));
        console.log(`🔍 Checking login for: ${username}, ${password}`);
    
        const user = this.users.get(username);
        
        if (!user || user.password !== password) {  // 🔹 FIXED: Compare passwords correctly
            throw new Error('Invalid username or password');
        }

        const sessionId = this.generateSessionId();
        this.sessions.set(sessionId, user);
        console.log(`✅ User logged in: ${username}, Session ID: ${sessionId}`);
        return sessionId;
    }
    

    logout(sessionId) {
        this.sessions.delete(sessionId);
    }

    getUser(sessionId) {
        return this.sessions.get(sessionId);
    }

    generateSessionId() {
        return `session_${Date.now()}_${Math.random()}`;
    }
}

export default UserManager;