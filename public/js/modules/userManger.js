export async function loadUserData() {
    try {
        const response = await fetch('/api/users/profile');
        if (!response.ok) throw new Error('Failed to load user data');

        const result = await response.json();
        return result.data || createDefaultUser();
    } catch (error) {
        console.error('Error loading user data:', error);
        return createDefaultUser();
    }
}

function createDefaultUser() {
    return {
        id: generateId(),
        username: 'Learner',
        level: 1,
        xp: 0,
        streak: 0,
        preferences: {
            theme: localStorage.getItem('theme') || 'light',
            notifications: localStorage.getItem('notifications') !== 'false',
            soundEffects: localStorage.getItem('sound') !== 'false'
        }
    };
}

function generateId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

export async function updateUserProfile(updates) {
    try {
        const response = await fetch('/api/users/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });

        if (!response.ok) throw new Error('Failed to update profile');
        return await response.json();
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
}

export async function getUserStats() {
    try {
        const response = await fetch('/api/users/stats');
        if (!response.ok) throw new Error('Failed to load stats');
        return await response.json();
    } catch (error) {
        console.error('Error loading stats:', error);
        return null;
    }
}
