class UserPreferences {
    constructor() {
        this.notificationEnabled = true;
        this.emailNotifications = true;
        this.defaultTags = [];
        this.theme = 'light';
    }

    toggleNotifications() {
        this.notificationEnabled = !this.notificationEnabled;
    }

    setTheme(theme) {
        this.theme = theme;
    }

    addDefaultTag(tag) {
        if (!this.defaultTags.includes(tag)) {
            this.defaultTags.push(tag);
        }
    }

    removeDefaultTag(tag) {
        this.defaultTags = this.defaultTags.filter(t => t !== tag);
    }
}

export default UserPreferences; 