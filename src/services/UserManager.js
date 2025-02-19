import User from '../models/User.js';

class UserManager {
    constructor() {
        this.users = new Map(); // username -> User
        this.loggedInUsers = new Map(); // sessionId -> User
    }

    registerUser({ username, email, password }) {
        if (this.users.has(username)) {
            throw new Error('Username already exists');
        }

        const user = new User({ username, email, password });
        this.users.set(username, user);
        return user;
    }

    login(username, password) {
        const user = this.users.get(username);
        if (!user || !user.validatePassword(password)) {
            throw new Error('Invalid username or password');
        }

        const sessionId = this.generateSessionId();
        this.loggedInUsers.set(sessionId, user);
        return sessionId;
    }

    logout(sessionId) {
        this.loggedInUsers.delete(sessionId);
    }

    getUser(sessionId) {
        return this.loggedInUsers.get(sessionId);
    }

    generateSessionId() {
        // In a real app, use a proper session ID generator
        return `session_${Date.now()}_${Math.random()}`;
    }
}

export default UserManager; 