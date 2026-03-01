const API_BASE_URL = '/api';

export async function syncWithAPI() {
    try {
        // Test connection
        const response = await fetch('/health');
        if (!response.ok) throw new Error('Server is not responding');

        console.log('✓ API connection established');
    } catch (error) {
        console.error('Error syncing with API:', error);
    }
}

export async function apiCall(endpoint, options = {}) {
    try {
        const url = `${API_BASE_URL}${endpoint}`;
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

export async function getCourses() {
    return apiCall('/courses');
}

export async function getCourseById(courseId) {
    return apiCall(`/courses/${courseId}`);
}

export async function createCourse(courseData) {
    return apiCall('/courses', {
        method: 'POST',
        body: JSON.stringify(courseData)
    });
}

export async function updateCourse(courseId, courseData) {
    return apiCall(`/courses/${courseId}`, {
        method: 'PUT',
        body: JSON.stringify(courseData)
    });
}

export async function deleteCourse(courseId) {
    return apiCall(`/courses/${courseId}`, {
        method: 'DELETE'
    });
}

export async function getLessonsByCourse(courseId) {
    return apiCall(`/lessons/course/${courseId}`);
}

export async function createLesson(lessonData) {
    return apiCall('/lessons', {
        method: 'POST',
        body: JSON.stringify(lessonData)
    });
}

export async function generateAudio(notes, tempo, scale, instrument) {
    return apiCall('/audio/generate', {
        method: 'POST',
        body: JSON.stringify({ notes, tempo, scale, instrument })
    });
}
