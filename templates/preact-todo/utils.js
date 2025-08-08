// Utility functions for todo app

export function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString();
}

export function exportTodos(todos) {
    const data = JSON.stringify(todos, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'todos.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export function importTodos(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const todos = JSON.parse(e.target.result);
                resolve(todos);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = reject;
        reader.readAsText(file);
    });
}

// Simple DAV-like storage utilities
export const storage = {
    async save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return { success: true };
        } catch (error) {
            console.error('Storage save error:', error);
            return { success: false, error };
        }
    },

    async load(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Storage load error:', error);
            return null;
        }
    },

    async remove(key) {
        try {
            localStorage.removeItem(key);
            return { success: true };
        } catch (error) {
            console.error('Storage remove error:', error);
            return { success: false, error };
        }
    }
};