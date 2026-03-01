const routes = {
    '/dashboard': 'dashboard-view',
    '/learn': 'learn-view',
    '/practice': 'practice-view',
    '/editor': 'editor-view',
    '/profile': 'profile-view'
};

export function initializeRouter() {
    window.addEventListener('hashchange', handleRouteChange);
    handleRouteChange();
}

function handleRouteChange() {
    const hash = window.location.hash.slice(1) || '/dashboard';
    const [route, ...params] = hash.split('/');
    const fullRoute = '/' + route;

    const viewId = routes[fullRoute];

    if (viewId) {
        showView(viewId, params);
    } else {
        window.location.hash = '#/dashboard';
    }
}

function showView(viewId, params = []) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });

    // Show selected view
    const view = document.getElementById(viewId);
    if (view) {
        view.classList.add('active');
        loadViewContent(viewId, params);
    }
}

async function loadViewContent(viewId, params) {
    try {
        switch (viewId) {
            case 'dashboard-view':
                await loadDashboard();
                break;
            case 'learn-view':
                await loadLearnView();
                break;
            case 'practice-view':
                await loadPracticeView();
                break;
            case 'editor-view':
                await loadEditorView();
                break;
            case 'profile-view':
                await loadProfileView();
                break;
        }
    } catch (error) {
        console.error('Error loading view:', error);
    }
}

async function loadDashboard() {
    try {
        const response = await fetch('/api/analytics/dashboard');
        if (!response.ok) throw new Error('Failed to load dashboard');
        const data = await response.json();

        // Update dashboard stats
        updateDashboardStats(data);
        loadActivities();
        loadAchievements();
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

function updateDashboardStats(data) {
    const stats = data.data || {};
    document.getElementById('lessons-completed').textContent = stats.totalLessonsCompleted || 0;
    document.getElementById('learning-time').textContent = `${Math.round((stats.totalTimeSpent || 0) / 60)}h`;
    document.getElementById('current-streak').textContent = stats.currentStreak || 0;
    document.getElementById('avg-score').textContent = `${Math.round(stats.averageScore || 0)}%`;
}

async function loadActivities() {
    try {
        const response = await fetch('/api/practice/history?limit=5');
        if (!response.ok) throw new Error('Failed to load activities');
        const data = await response.json();

        const container = document.getElementById('activities-list');
        if (container) {
            container.innerHTML = (data.data || []).map(activity => `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas fa-music"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-text">${activity.mode} Practice</div>
                        <div class="activity-time">${new Date(activity.startedAt).toLocaleDateString()}</div>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading activities:', error);
    }
}

async function loadAchievements() {
    try {
        const response = await fetch('/api/users/achievements');
        if (!response.ok) throw new Error('Failed to load achievements');
        const data = await response.json();

        const container = document.getElementById('achievements-container');
        if (container) {
            container.innerHTML = (data.data || []).map(achievement => `
                <div class="achievement-badge ${achievement.unlocked ? 'unlocked' : 'locked'}" title="${achievement.title}">
                    <div class="achievement-icon">${achievement.icon}</div>
                    <div class="achievement-name">${achievement.title}</div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading achievements:', error);
    }
}

async function loadLearnView() {
    try {
        const response = await fetch('/api/courses');
        if (!response.ok) throw new Error('Failed to load courses');
        const result = await response.json();
        const courses = result.data || [];

        const container = document.getElementById('courses-grid');
        if (container) {
            container.innerHTML = courses.map(course => `
                <div class="card course-card" onclick="window.location.hash='#/course/${course.id}'">
                    <div class="course-card-image" style="background: linear-gradient(135deg, ${course.color || '#1f77b4'}, #17a2b8);">
                        <i class="fas fa-book"></i>
                    </div>
                    <div class="course-card-body">
                        <h3 class="course-card-title">${course.title}</h3>
                        <p class="course-card-description">${course.description}</p>
                        <div class="course-card-footer">
                            <div class="course-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${course.progress || 0}%"></div>
                                </div>
                                <p class="progress-text">${Math.round(course.progress || 0)}% Complete</p>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

async function loadPracticeView() {
    // Practice modes are already in HTML
    const modeCards = document.querySelectorAll('.mode-card');
    modeCards.forEach(card => {
        card.addEventListener('click', () => {
            const mode = card.dataset.mode;
            startPractice(mode);
        });
    });
}

async function loadEditorView() {
    try {
        const response = await fetch('/api/courses');
        if (!response.ok) throw new Error('Failed to load courses');
        const result = await response.json();
        const courses = result.data || [];

        const container = document.getElementById('editor-courses-list');
        if (container) {
            container.innerHTML = courses.map(course => `
                <div class="card">
                    <div class="card-body">
                        <h3 class="card-title">${course.title}</h3>
                        <p>${course.description}</p>
                        <div style="display: flex; gap: 8px; margin-top: 12px;">
                            <button class="btn btn-secondary" onclick="editCourse('${course.id}')">Edit</button>
                            <button class="btn btn-danger" onclick="deleteCourse('${course.id}')">Delete</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading editor view:', error);
    }
}

async function loadProfileView() {
    try {
        const response = await fetch('/api/users/profile');
        if (!response.ok) throw new Error('Failed to load profile');
        const result = await response.json();
        const profile = result.data;

        document.getElementById('profile-username').textContent = profile.username;
        document.getElementById('profile-level').textContent = `Level ${profile.level}`;
        document.getElementById('profile-xp').textContent = profile.xp;
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

async function startPractice(mode) {
    try {
        const response = await fetch('/api/practice/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mode })
        });

        if (!response.ok) throw new Error('Failed to create practice session');
        const result = await response.json();
        const sessionId = result.data?.id;

        if (sessionId) {
            window.location.hash = `#/practice/${sessionId}`;
        }
    } catch (error) {
        console.error('Error starting practice:', error);
    }
}

window.editCourse = async (courseId) => {
    // TODO: Implement course editing
    console.log('Edit course:', courseId);
};

window.deleteCourse = async (courseId) => {
    if (confirm('Are you sure you want to delete this course?')) {
        try {
            const response = await fetch(`/api/courses/${courseId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete course');
            loadEditorView();
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    }
};
