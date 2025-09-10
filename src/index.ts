interface TodoItem {
    id: number;
    text: string;
    completed: boolean;
}

class TodoApp {
    private todos: TodoItem[] = [];
    private nextId: number = 1;
    
    private todoListElement: HTMLElement;
    private emptyStateElement: HTMLElement;
    private newTodoInput: HTMLInputElement;
    private addTodoBtn: HTMLButtonElement;

    constructor() {
        this.todoListElement = document.getElementById('todo-list')!;
        this.emptyStateElement = document.getElementById('empty-state')!;
        this.newTodoInput = document.getElementById('new-todo-input') as HTMLInputElement;
        this.addTodoBtn = document.getElementById('add-todo-btn') as HTMLButtonElement;
        
        this.setupEventListeners();
        this.render();
    }

    private setupEventListeners(): void {
        this.addTodoBtn.addEventListener('click', () => this.addTodo());
        this.newTodoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });
    }

    private addTodo(): void {
        const text = this.newTodoInput.value.trim();
        if (!text) return;

        const newTodo: TodoItem = {
            id: this.nextId++,
            text,
            completed: false
        };

        this.todos.push(newTodo);
        this.newTodoInput.value = '';
        this.render();
    }

    private deleteTodo(id: number): void {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.render();
    }

    private toggleTodo(id: number): void {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            
            // If item is completed (checked off), remove it from the list
            if (todo.completed) {
                setTimeout(() => {
                    this.deleteTodo(id);
                }, 300); // Small delay to show the checked animation
            }
        }
    }

    private createTodoElement(todo: TodoItem): HTMLElement {
        const todoElement = document.createElement('div');
        todoElement.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        todoElement.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} 
                   data-id="${todo.id}">
            <span class="todo-text">${this.escapeHtml(todo.text)}</span>
            <button class="delete-btn" data-id="${todo.id}">Delete</button>
        `;

        // Add event listeners
        const checkbox = todoElement.querySelector('.todo-checkbox') as HTMLInputElement;
        const deleteBtn = todoElement.querySelector('.delete-btn') as HTMLButtonElement;

        checkbox.addEventListener('change', () => this.toggleTodo(todo.id));
        deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));

        return todoElement;
    }

    private escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    private render(): void {
        // Clear the todo list
        this.todoListElement.innerHTML = '';

        // Show/hide empty state
        if (this.todos.length === 0) {
            this.emptyStateElement.classList.remove('hidden');
        } else {
            this.emptyStateElement.classList.add('hidden');
            
            // Render each todo item
            this.todos.forEach(todo => {
                const todoElement = this.createTodoElement(todo);
                this.todoListElement.appendChild(todoElement);
            });
        }
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});