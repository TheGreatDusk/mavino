import { initializeRouter } from './modules/router.js';
import { initializeEventListeners } from './modules/eventListeners.js';
import { loadUserData } from './modules/userManager.js';
import { syncWithAPI } from './modules/apiClient.js';
import { initializeSoundManager } from './modules/soundManager.js';

class MusicMaster {
    constructor() {
        this.isInitialized = false;
        this.user = null;
        this.courses = [];
        this.currentCourse = null;
    }

    async initialize() {
        try {
            console.log('🎵 Initializing Music Master...');

            // Load user data
            this.user = await loadUserData();
            console.log('✓ User data loaded');

            // Initialize sound manager
            initializeSoundManager();
            console.log('✓ Sound manager initialized');

            // Initialize router
            initializeRouter();
            console.log('✓ Router initialized');

            // Initialize event listeners
            initializeEventListeners();
            console.log('✓ Event listeners initialized');

            // Sync with API
            await syncWithAPI();
            console.log('✓ API sync completed');

            // Load courses
            await this.loadCourses();

            // Update UI
            this.updateUI();

            // Navigate to dashboard
            window.location.hash = '#/dashboard';

            this.isInitialized = true;
            console.log('✓ Music Master initialized successfully');
        } catch (error) {
            console.error('Error initializing Music Master:', error);
            this.showError('Failed to initialize application');
        }
    }

    async loadCourses() {
        try {
            const response = await fetch('/api/courses');
            if (!response.ok) throw new Error('Failed to fetch courses');
            this.courses = await response.json();
        } catch (error) {
            console.error('Error loading courses:', error);
            this.courses = [];
        }
    }

    updateUI() {
        this.updateStreakCount();
        this.updateXPCount();
        this.updateProfileInfo();
    }

    updateStreakCount() {
        const element = document.getElementById('streak-count');
        if (element) {
            element.textContent = this.user?.streak || 0;
        }
    }

    updateXPCount() {
        const element = document.getElementById('xp-count');
        if (element) {
            element.textContent = this.user?.xp || 0;
        }
    }

    updateProfileInfo() {
        const username = document.getElementById('profile-username');
        const level = document.getElementById('profile-level');
        const xp = document.getElementById('profile-xp');
        const avatar = document.getElementById('profile-avatar');

        if (username) username.textContent = this.user?.username || 'Learner';
        if (level) level.textContent = `Level ${this.user?.level || 1}`;
        if (xp) xp.textContent = this.user?.xp || 0;
        if (avatar) avatar.textContent = (this.user?.username || 'U')[0].toUpperCase();
    }

    showError(message) {
        const container = document.getElementById('notifications-container');
        if (container) {
            const notification = document.createElement('div');
            notification.className = 'notification error';
            notification.innerHTML = `
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
            `;
            container.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
        }
    }

    showSuccess(message) {
        const container = document.getElementById('notifications-container');
        if (container) {
            const notification = document.createElement('div');
            notification.className = 'notification success';
            notification.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            `;
            container.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
        }
    }
}

// Initialize app
const app = new MusicMaster();
app.initialize();

export { app };
