// Import Preact and HTM
import { h } from 'https://cdn.skypack.dev/preact@10.19.3';
import { html } from 'https://cdn.skypack.dev/htm@3.1.1/preact';
import { useState, useEffect, useRef } from 'https://cdn.skypack.dev/preact@10.19.3/hooks';

const STORAGE_KEY = '{{name}}-todos';

export function TodoApp() {
    const [todos, setTodos] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef(null);

    // Load todos from localStorage on mount
    useEffect(() => {
        const savedTodos = localStorage.getItem(STORAGE_KEY);
        if (savedTodos) {
            try {
                setTodos(JSON.parse(savedTodos));
            } catch (e) {
                console.error('Error loading todos:', e);
            }
        }
    }, []);

    // Save todos to localStorage when todos change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }, [todos]);

    const addTodo = () => {
        const text = inputValue.trim();
        if (!text) return;

        const newTodo = {
            id: Date.now(),
            text,
            completed: false,
            createdAt: new Date().toISOString()
        };

        setTodos(prev => [...prev, newTodo]);
        setInputValue('');
        inputRef.current?.focus();
    };

    const toggleTodo = (id) => {
        setTodos(prev => prev.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const deleteTodo = (id) => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    };

    const completedCount = todos.filter(t => t.completed).length;
    const totalCount = todos.length;

    return html`
        <div class="header">
            <h1>{{title}}</h1>
            <p>A modern todo app built with Preact & HTM</p>
        </div>
        
        <div class="todo-container">
            <div class="add-todo">
                <input
                    ref=${inputRef}
                    type="text"
                    value=${inputValue}
                    onInput=${(e) => setInputValue(e.target.value)}
                    onKeyPress=${handleKeyPress}
                    placeholder="What needs to be done?"
                    autoFocus
                />
                <button onClick=${addTodo}>Add Todo</button>
            </div>

            ${todos.length === 0 
                ? html`<div class="empty-state">No todos yet. Add one above to get started!</div>`
                : html`
                    <ul class="todo-list">
                        ${todos.map(todo => html`
                            <li key=${todo.id} class="todo-item">
                                <input
                                    type="checkbox"
                                    class="todo-checkbox"
                                    checked=${todo.completed}
                                    onChange=${() => toggleTodo(todo.id)}
                                />
                                <span class="todo-text ${todo.completed ? 'completed' : ''}">
                                    ${todo.text}
                                </span>
                                <button 
                                    class="todo-delete"
                                    onClick=${() => deleteTodo(todo.id)}
                                    title="Delete todo"
                                >
                                    Delete
                                </button>
                            </li>
                        `)}
                    </ul>
                    <div class="stats">
                        <span>${totalCount} total</span>
                        <span>${completedCount} completed</span>
                        <span>${totalCount - completedCount} remaining</span>
                    </div>
                `
            }
        </div>
    `;
}