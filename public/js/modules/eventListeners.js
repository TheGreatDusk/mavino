export function initializeEventListeners() {
    setupButtonListeners();
    setupFormListeners();
    setupPreferenceListeners();
}

function setupButtonListeners() {
    const continueBtn = document.getElementById('continue-learning-btn');
    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            window.location.hash = '#/learn';
        });
    }

    const practiceBtn = document.getElementById('start-practice-btn');
    if (practiceBtn) {
        practiceBtn.addEventListener('click', () => {
            window.location.hash = '#/practice';
        });
    }

    const viewProgressBtn = document.getElementById('view-progress-btn');
    if (viewProgressBtn) {
        viewProgressBtn.addEventListener('click', () => {
            window.location.hash = '#/dashboard';
        });
    }

    const newCourseBtn = document.getElementById('new-course-btn');
    if (newCourseBtn) {
        newCourseBtn.addEventListener('click', showNewCourseModal);
    }

    const exportBtn = document.getElementById('export-data-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportUserData);
    }

    const importBtn = document.getElementById('import-data-btn');
    if (importBtn) {
        importBtn.addEventListener('click', importUserData);
    }
}

function setupFormListeners() {
    // Form submission handlers
}

function setupPreferenceListeners() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('change', (e) => {
            document.body.classList.toggle('dark-theme', e.target.checked);
            localStorage.setItem('theme', e.target.checked ? 'dark' : 'light');
        });
    }

    const notificationsToggle = document.getElementById('notifications-toggle');
    if (notificationsToggle) {
        notificationsToggle.addEventListener('change', (e) => {
            localStorage.setItem('notifications', e.target.checked);
        });
    }

    const soundToggle = document.getElementById('sound-toggle');
    if (soundToggle) {
        soundToggle.addEventListener('change', (e) => {
            localStorage.setItem('sound', e.target.checked);
        });
    }
}

async function showNewCourseModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h2>Create New Course</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <form id="new-course-form">
                    <div class="form-group">
                        <label class="form-label">Course Title</label>
                        <input type="text" class="form-control" name="title" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Description</label>
                        <textarea class="form-control" name="description" required></textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Difficulty</label>
                        <select class="form-select" name="difficulty">
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                <button class="btn btn-primary" onclick="submitCourseForm()">Create Course</button>
            </div>
        </div>
    `;

    document.getElementById('modal-container').appendChild(modal);
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
}

async function submitCourseForm() {
    const form = document.getElementById('new-course-form');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    try {
        const response = await fetch('/api/courses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Failed to create course');

        document.querySelector('.modal-overlay').remove();
        // Refresh editor view
        const editorView = document.getElementById('editor-view');
        if (editorView && editorView.classList.contains('active')) {
            const response2 = await fetch('/api/courses');
            const result = await response2.json();
            // Update UI
        }
    } catch (error) {
        console.error('Error creating course:', error);
    }
}

async function exportUserData() {
    try {
        const response = await fetch('/api/users/export-data', {
            method: 'POST'
        });

        if (!response.ok) throw new Error('Failed to export data');

        const data = await response.json();
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `music-master-export-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error exporting data:', error);
    }
}

async function importUserData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            const data = JSON.parse(text);

            const response = await fetch('/api/users/import-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data })
            });

            if (!response.ok) throw new Error('Failed to import data');

            alert('Data imported successfully! Refreshing page...');
            window.location.reload();
        } catch (error) {
            console.error('Error importing data:', error);
            alert('Failed to import data. Make sure the file is valid.');
        }
    });

    input.click();
}

window.submitCourseForm = submitCourseForm;
