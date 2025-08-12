/**
 * Professional Todo Application
 * Advanced JavaScript implementation with modern ES6+ features
 * Author: Interview-Ready Student Project
 */

class TodoApp {
    constructor() {
        // Application state
        this.todos = [];
        this.filteredTodos = [];
        this.currentFilter = { status: 'all', priority: 'all', search: '', sort: 'createdAt' };
        this.currentView = 'list';
        this.editingTodo = null;
        this.selectedTodos = new Set();
        this.draggedTodo = null;
        this.nextId = 1;

        // DOM elements
        this.elements = this.initializeElements();
        
        // Initialize application
        this.init();
    }

    initializeElements() {
        return {
            // Forms and inputs
            todoForm: document.getElementById('todoForm'),
            todoTitle: document.getElementById('todoTitle'),
            todoDescription: document.getElementById('todoDescription'),
            todoPriority: document.getElementById('todoPriority'),
            todoDueDate: document.getElementById('todoDueDate'),
            
            // Search and filters
            searchInput: document.getElementById('searchInput'),
            clearSearch: document.getElementById('clearSearch'),
            statusFilter: document.getElementById('statusFilter'),
            priorityFilter: document.getElementById('priorityFilter'),
            sortSelect: document.getElementById('sortSelect'),
            
            // Statistics
            totalTodos: document.getElementById('totalTodos'),
            completedTodos: document.getElementById('completedTodos'),
            pendingTodos: document.getElementById('pendingTodos'),
            progressFill: document.getElementById('progressFill'),
            progressText: document.getElementById('progressText'),
            
            // Todo list
            todoList: document.getElementById('todoList'),
            emptyState: document.getElementById('emptyState'),
            
            // Bulk operations
            selectAll: document.getElementById('selectAll'),
            bulkActions: document.getElementById('bulkActions'),
            bulkComplete: document.getElementById('bulkComplete'),
            bulkIncomplete: document.getElementById('bulkIncomplete'),
            bulkDelete: document.getElementById('bulkDelete'),
            
            // View toggle
            listView: document.getElementById('listView'),
            gridView: document.getElementById('gridView'),
            
            // Modals
            editModal: document.getElementById('editModal'),
            editForm: document.getElementById('editForm'),
            editTitle: document.getElementById('editTitle'),
            editDescription: document.getElementById('editDescription'),
            editPriority: document.getElementById('editPriority'),
            editDueDate: document.getElementById('editDueDate'),
            closeModal: document.getElementById('closeModal'),
            cancelEdit: document.getElementById('cancelEdit'),
            
            confirmModal: document.getElementById('confirmModal'),
            confirmTitle: document.getElementById('confirmTitle'),
            confirmMessage: document.getElementById('confirmMessage'),
            confirmCancel: document.getElementById('confirmCancel'),
            confirmOk: document.getElementById('confirmOk'),
            
            // Theme and utilities
            themeToggle: document.getElementById('themeToggle'),
            exportBtn: document.getElementById('exportBtn'),
            importBtn: document.getElementById('importBtn'),
            fileInput: document.getElementById('fileInput'),
            toastContainer: document.getElementById('toastContainer')
        };
    }

    init() {
        this.loadSampleData();
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
        this.loadTheme();
        this.updateDisplay();
        
        // Show welcome message after a short delay
        setTimeout(() => {
            this.showToast('Welcome to TaskMaster Pro!', 'success');
        }, 500);
    }

    loadSampleData() {
        const sampleTodos = [
            {
                id: 1,
                title: "Complete project documentation",
                description: "Write comprehensive documentation for the final year project including API docs and user manual",
                priority: "high",
                dueDate: "2025-08-20",
                completed: false,
                createdAt: "2025-08-10T10:30:00.000Z"
            },
            {
                id: 2,
                title: "Prepare for technical interview",
                description: "Review data structures, algorithms, and system design concepts",
                priority: "high", 
                dueDate: "2025-08-15",
                completed: false,
                createdAt: "2025-08-09T14:20:00.000Z"
            },
            {
                id: 3,
                title: "Submit assignment",
                description: "Submit the web development assignment for CS course",
                priority: "medium",
                dueDate: "2025-08-13",
                completed: true,
                createdAt: "2025-08-08T09:15:00.000Z"
            }
        ];

        this.todos = sampleTodos;
        this.nextId = Math.max(...sampleTodos.map(t => t.id)) + 1;
    }

    setupEventListeners() {
        // Form submission - use proper event handling
        if (this.elements.todoForm) {
            this.elements.todoForm.addEventListener('submit', (e) => this.handleAddTodo(e));
        }
        
        if (this.elements.editForm) {
            this.elements.editForm.addEventListener('submit', (e) => this.handleEditSubmit(e));
        }

        // Search functionality
        if (this.elements.searchInput) {
            this.elements.searchInput.addEventListener('input', (e) => this.handleSearch(e));
        }
        
        if (this.elements.clearSearch) {
            this.elements.clearSearch.addEventListener('click', () => this.clearSearch());
        }

        // Filters and sorting
        if (this.elements.statusFilter) {
            this.elements.statusFilter.addEventListener('change', (e) => this.handleFilterChange('status', e.target.value));
        }
        
        if (this.elements.priorityFilter) {
            this.elements.priorityFilter.addEventListener('change', (e) => this.handleFilterChange('priority', e.target.value));
        }
        
        if (this.elements.sortSelect) {
            this.elements.sortSelect.addEventListener('change', (e) => this.handleFilterChange('sort', e.target.value));
        }

        // Bulk operations
        if (this.elements.selectAll) {
            this.elements.selectAll.addEventListener('change', (e) => this.handleSelectAll(e));
        }
        
        if (this.elements.bulkComplete) {
            this.elements.bulkComplete.addEventListener('click', () => this.handleBulkComplete());
        }
        
        if (this.elements.bulkIncomplete) {
            this.elements.bulkIncomplete.addEventListener('click', () => this.handleBulkIncomplete());
        }
        
        if (this.elements.bulkDelete) {
            this.elements.bulkDelete.addEventListener('click', () => this.handleBulkDelete());
        }

        // View toggle
        if (this.elements.listView) {
            this.elements.listView.addEventListener('click', () => this.setView('list'));
        }
        
        if (this.elements.gridView) {
            this.elements.gridView.addEventListener('click', () => this.setView('grid'));
        }

        // Modals
        if (this.elements.closeModal) {
            this.elements.closeModal.addEventListener('click', () => this.closeEditModal());
        }
        
        if (this.elements.cancelEdit) {
            this.elements.cancelEdit.addEventListener('click', () => this.closeEditModal());
        }
        
        if (this.elements.confirmCancel) {
            this.elements.confirmCancel.addEventListener('click', () => this.closeConfirmModal());
        }

        // Theme toggle
        if (this.elements.themeToggle) {
            this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Import/Export
        if (this.elements.exportBtn) {
            this.elements.exportBtn.addEventListener('click', () => this.exportTodos());
        }
        
        if (this.elements.importBtn) {
            this.elements.importBtn.addEventListener('click', () => this.elements.fileInput.click());
        }
        
        if (this.elements.fileInput) {
            this.elements.fileInput.addEventListener('change', (e) => this.importTodos(e));
        }

        // Todo list delegation
        if (this.elements.todoList) {
            this.elements.todoList.addEventListener('click', (e) => this.handleTodoListClick(e));
            this.elements.todoList.addEventListener('change', (e) => this.handleTodoListChange(e));

            // Drag and drop
            this.elements.todoList.addEventListener('dragstart', (e) => this.handleDragStart(e));
            this.elements.todoList.addEventListener('dragover', (e) => this.handleDragOver(e));
            this.elements.todoList.addEventListener('drop', (e) => this.handleDrop(e));
            this.elements.todoList.addEventListener('dragend', (e) => this.handleDragEnd(e));
        }

        // Modal backdrop clicks
        if (this.elements.editModal) {
            this.elements.editModal.addEventListener('click', (e) => {
                if (e.target === this.elements.editModal) this.closeEditModal();
            });
        }
        
        if (this.elements.confirmModal) {
            this.elements.confirmModal.addEventListener('click', (e) => {
                if (e.target === this.elements.confirmModal) this.closeConfirmModal();
            });
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'n':
                        e.preventDefault();
                        if (this.elements.todoTitle) this.elements.todoTitle.focus();
                        break;
                    case 'e':
                        e.preventDefault();
                        this.exportTodos();
                        break;
                    case 'i':
                        e.preventDefault();
                        if (this.elements.fileInput) this.elements.fileInput.click();
                        break;
                }
            }

            if (e.key === 'Escape') {
                this.closeEditModal();
                this.closeConfirmModal();
            }

            if (e.key === 'Delete' && this.selectedTodos.size > 0) {
                this.handleBulkDelete();
            }
        });
    }

    handleAddTodo(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const title = this.elements.todoTitle?.value?.trim();
        const description = this.elements.todoDescription?.value?.trim();
        const priority = this.elements.todoPriority?.value || 'medium';
        const dueDate = this.elements.todoDueDate?.value;

        if (!title) {
            this.showToast('Please enter a task title', 'error');
            return;
        }

        const newTodo = {
            id: this.nextId++,
            title,
            description: description || '',
            priority,
            dueDate: dueDate || null,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.todos.unshift(newTodo);
        
        // Reset form
        if (this.elements.todoForm) {
            this.elements.todoForm.reset();
        }
        
        this.updateDisplay();
        this.showToast('Task added successfully!', 'success');
        
        // Focus back to title for quick entry
        if (this.elements.todoTitle) {
            this.elements.todoTitle.focus();
        }
    }

    handleSearch(e) {
        const searchTerm = e.target.value.trim();
        this.currentFilter.search = searchTerm;
        
        if (this.elements.clearSearch) {
            this.elements.clearSearch.style.display = searchTerm ? 'block' : 'none';
        }
        
        this.updateDisplay();
    }

    clearSearch() {
        if (this.elements.searchInput) {
            this.elements.searchInput.value = '';
        }
        
        this.currentFilter.search = '';
        
        if (this.elements.clearSearch) {
            this.elements.clearSearch.style.display = 'none';
        }
        
        this.updateDisplay();
    }

    handleFilterChange(filterType, value) {
        this.currentFilter[filterType] = value;
        this.updateDisplay();
    }

    handleSelectAll(e) {
        if (e.target.checked) {
            this.filteredTodos.forEach(todo => this.selectedTodos.add(todo.id));
        } else {
            this.selectedTodos.clear();
        }
        this.updateBulkActions();
        this.updateTodoCheckboxes();
    }

    handleBulkComplete() {
        this.selectedTodos.forEach(id => {
            const todo = this.todos.find(t => t.id === id);
            if (todo) todo.completed = true;
        });
        this.selectedTodos.clear();
        this.updateDisplay();
        this.showToast('Selected tasks marked as completed', 'success');
    }

    handleBulkIncomplete() {
        this.selectedTodos.forEach(id => {
            const todo = this.todos.find(t => t.id === id);
            if (todo) todo.completed = false;
        });
        this.selectedTodos.clear();
        this.updateDisplay();
        this.showToast('Selected tasks marked as incomplete', 'info');
    }

    handleBulkDelete() {
        this.showConfirmDialog(
            'Delete Tasks',
            `Are you sure you want to delete ${this.selectedTodos.size} selected task(s)?`,
            () => {
                this.todos = this.todos.filter(todo => !this.selectedTodos.has(todo.id));
                this.selectedTodos.clear();
                this.updateDisplay();
                this.showToast('Selected tasks deleted', 'success');
            }
        );
    }

    handleTodoListClick(e) {
        e.stopPropagation();
        
        const todoItem = e.target.closest('.todo-item');
        if (!todoItem) return;

        const todoId = parseInt(todoItem.dataset.id);

        if (e.target.classList.contains('todo-checkbox')) {
            this.toggleTodoCompletion(todoId);
        } else if (e.target.classList.contains('item-checkbox')) {
            this.toggleTodoSelection(todoId, e.target.checked);
        } else if (e.target.closest('.edit-btn')) {
            e.preventDefault();
            this.openEditModal(todoId);
        } else if (e.target.closest('.delete-btn')) {
            e.preventDefault();
            this.deleteTodo(todoId);
        }
    }

    handleTodoListChange(e) {
        if (e.target.classList.contains('item-checkbox')) {
            const todoItem = e.target.closest('.todo-item');
            if (todoItem) {
                const todoId = parseInt(todoItem.dataset.id);
                this.toggleTodoSelection(todoId, e.target.checked);
            }
        }
    }

    toggleTodoCompletion(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.updateDisplay();
            this.showToast(
                `Task ${todo.completed ? 'completed' : 'marked as incomplete'}`,
                todo.completed ? 'success' : 'info'
            );
        }
    }

    toggleTodoSelection(id, selected) {
        if (selected) {
            this.selectedTodos.add(id);
        } else {
            this.selectedTodos.delete(id);
        }
        this.updateBulkActions();
        this.updateSelectAllCheckbox();
    }

    deleteTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            this.showConfirmDialog(
                'Delete Task',
                `Are you sure you want to delete "${todo.title}"?`,
                () => {
                    this.todos = this.todos.filter(t => t.id !== id);
                    this.selectedTodos.delete(id);
                    this.updateDisplay();
                    this.showToast('Task deleted', 'success');
                }
            );
        }
    }

    openEditModal(id) {
        const todo = this.todos.find(t => t.id === id);
        if (!todo) return;

        this.editingTodo = todo;
        
        if (this.elements.editTitle) this.elements.editTitle.value = todo.title;
        if (this.elements.editDescription) this.elements.editDescription.value = todo.description || '';
        if (this.elements.editPriority) this.elements.editPriority.value = todo.priority;
        if (this.elements.editDueDate) this.elements.editDueDate.value = todo.dueDate || '';
        
        if (this.elements.editModal) {
            this.elements.editModal.classList.remove('hidden');
        }
        
        if (this.elements.editTitle) {
            this.elements.editTitle.focus();
        }
    }

    closeEditModal() {
        if (this.elements.editModal) {
            this.elements.editModal.classList.add('hidden');
        }
        this.editingTodo = null;
    }

    handleEditSubmit(e) {
        e.preventDefault();
        
        if (!this.editingTodo) return;

        const title = this.elements.editTitle?.value?.trim();
        if (!title) {
            this.showToast('Please enter a task title', 'error');
            return;
        }

        this.editingTodo.title = title;
        this.editingTodo.description = this.elements.editDescription?.value?.trim() || '';
        this.editingTodo.priority = this.elements.editPriority?.value || 'medium';
        this.editingTodo.dueDate = this.elements.editDueDate?.value || null;

        this.closeEditModal();
        this.updateDisplay();
        this.showToast('Task updated successfully!', 'success');
    }

    setView(view) {
        this.currentView = view;
        
        if (this.elements.listView) {
            this.elements.listView.classList.toggle('active', view === 'list');
        }
        
        if (this.elements.gridView) {
            this.elements.gridView.classList.toggle('active', view === 'grid');
        }
        
        if (this.elements.todoList) {
            this.elements.todoList.classList.toggle('grid-view', view === 'grid');
        }
    }

    // Drag and Drop functionality
    handleDragStart(e) {
        if (!e.target.classList.contains('todo-item')) return;
        
        this.draggedTodo = parseInt(e.target.dataset.id);
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    handleDrop(e) {
        e.preventDefault();
        
        if (!this.draggedTodo) return;

        const draggedTodoObj = this.todos.find(t => t.id === this.draggedTodo);
        
        if (draggedTodoObj) {
            // Simple reorder to top for now
            this.todos = this.todos.filter(t => t.id !== this.draggedTodo);
            this.todos.unshift(draggedTodoObj);
            
            this.updateDisplay();
            this.showToast('Task reordered', 'info');
        }
    }

    handleDragEnd(e) {
        if (e.target.classList.contains('todo-item')) {
            e.target.classList.remove('dragging');
        }
        
        this.draggedTodo = null;
    }

    // Theme functionality
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-color-scheme');
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const actualCurrentTheme = currentTheme || systemTheme;
        const newTheme = actualCurrentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-color-scheme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        const icon = this.elements.themeToggle?.querySelector('i');
        if (icon) {
            icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        this.showToast(`Switched to ${newTheme} theme`, 'info');
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-color-scheme', savedTheme);
            const icon = this.elements.themeToggle?.querySelector('i');
            if (icon) {
                icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
    }

    // Import/Export functionality
    exportTodos() {
        const dataStr = JSON.stringify({
            todos: this.todos,
            exportDate: new Date().toISOString(),
            version: '1.0'
        }, null, 2);
        
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `tasks-export-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showToast('Tasks exported successfully!', 'success');
    }

    importTodos(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.todos && Array.isArray(data.todos)) {
                    this.showConfirmDialog(
                        'Import Tasks',
                        `This will replace all current tasks with ${data.todos.length} imported tasks. Continue?`,
                        () => {
                            this.todos = data.todos.map(todo => ({
                                ...todo,
                                id: this.nextId++
                            }));
                            this.selectedTodos.clear();
                            this.updateDisplay();
                            this.showToast(`Imported ${data.todos.length} tasks successfully!`, 'success');
                        }
                    );
                } else {
                    throw new Error('Invalid file format');
                }
            } catch (error) {
                this.showToast('Error importing file. Please check the format.', 'error');
            }
        };
        
        reader.readAsText(file);
        e.target.value = ''; // Reset file input
    }

    // Filtering and sorting
    applyFilters() {
        let filtered = [...this.todos];

        // Apply status filter
        if (this.currentFilter.status === 'active') {
            filtered = filtered.filter(todo => !todo.completed);
        } else if (this.currentFilter.status === 'completed') {
            filtered = filtered.filter(todo => todo.completed);
        }

        // Apply priority filter
        if (this.currentFilter.priority !== 'all') {
            filtered = filtered.filter(todo => todo.priority === this.currentFilter.priority);
        }

        // Apply search filter
        if (this.currentFilter.search) {
            const searchTerm = this.currentFilter.search.toLowerCase();
            filtered = filtered.filter(todo => 
                todo.title.toLowerCase().includes(searchTerm) ||
                (todo.description && todo.description.toLowerCase().includes(searchTerm))
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (this.currentFilter.sort) {
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'priority':
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                case 'dueDate':
                    if (!a.dueDate && !b.dueDate) return 0;
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate) - new Date(b.dueDate);
                case 'createdAt':
                default:
                    return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });

        this.filteredTodos = filtered;
    }

    // UI Updates
    updateDisplay() {
        this.applyFilters();
        this.renderTodos();
        this.updateStatistics();
        this.updateBulkActions();
        this.updateSelectAllCheckbox();
        this.updateEmptyState();
    }

    renderTodos() {
        if (!this.elements.todoList) return;
        
        if (this.filteredTodos.length === 0) {
            this.elements.todoList.innerHTML = '';
            return;
        }

        const todosHtml = this.filteredTodos.map((todo) => {
            const isOverdue = todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date();
            const isSelected = this.selectedTodos.has(todo.id);

            return `
                <div class="todo-item ${todo.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}" 
                     data-id="${todo.id}" 
                     draggable="true">
                    <div class="todo-header">
                        <div class="todo-main">
                            <input type="checkbox" class="item-checkbox" ${isSelected ? 'checked' : ''}>
                            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                            <div class="todo-content">
                                <h3 class="todo-title ${todo.completed ? 'completed' : ''}">${this.escapeHtml(todo.title)}</h3>
                                ${todo.description ? `<p class="todo-description">${this.escapeHtml(todo.description)}</p>` : ''}
                                <div class="todo-meta">
                                    <span class="priority-badge priority-${todo.priority}">
                                        ${todo.priority.toUpperCase()}
                                    </span>
                                    ${todo.dueDate ? `
                                        <span class="due-date ${isOverdue ? 'overdue' : ''}">
                                            <i class="fas fa-calendar"></i>
                                            ${this.formatDate(todo.dueDate)}
                                        </span>
                                    ` : ''}
                                    <span class="created-date">
                                        Created: ${this.formatDateTime(todo.createdAt)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="todo-actions">
                            <button class="action-btn edit-btn" title="Edit task">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn delete-btn" title="Delete task">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        this.elements.todoList.innerHTML = todosHtml;
    }

    updateStatistics() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        const pending = total - completed;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

        if (this.elements.totalTodos) this.elements.totalTodos.textContent = total;
        if (this.elements.completedTodos) this.elements.completedTodos.textContent = completed;
        if (this.elements.pendingTodos) this.elements.pendingTodos.textContent = pending;
        if (this.elements.progressFill) this.elements.progressFill.style.width = `${progress}%`;
        if (this.elements.progressText) this.elements.progressText.textContent = `${progress}%`;
    }

    updateBulkActions() {
        const hasSelected = this.selectedTodos.size > 0;
        if (this.elements.bulkActions) {
            this.elements.bulkActions.style.display = hasSelected ? 'flex' : 'none';
        }
    }

    updateSelectAllCheckbox() {
        if (!this.elements.selectAll) return;
        
        const hasFiltered = this.filteredTodos.length > 0;
        const allSelected = hasFiltered && this.filteredTodos.every(todo => this.selectedTodos.has(todo.id));
        const someSelected = this.filteredTodos.some(todo => this.selectedTodos.has(todo.id));

        this.elements.selectAll.checked = allSelected;
        this.elements.selectAll.indeterminate = someSelected && !allSelected;
    }

    updateTodoCheckboxes() {
        if (!this.elements.todoList) return;
        
        const checkboxes = this.elements.todoList.querySelectorAll('.item-checkbox');
        checkboxes.forEach(checkbox => {
            const todoItem = checkbox.closest('.todo-item');
            if (todoItem) {
                const todoId = parseInt(todoItem.dataset.id);
                checkbox.checked = this.selectedTodos.has(todoId);
            }
        });
    }

    updateEmptyState() {
        const isEmpty = this.filteredTodos.length === 0;
        
        if (this.elements.emptyState) {
            this.elements.emptyState.style.display = isEmpty ? 'block' : 'none';
        }
        
        if (this.elements.todoList) {
            this.elements.todoList.style.display = isEmpty ? 'none' : 'flex';
        }
    }

    // Utility functions
    formatDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        } else {
            return date.toLocaleDateString();
        }
    }

    formatDateTime(dateString) {
        return new Date(dateString).toLocaleDateString();
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Modal functionality
    showConfirmDialog(title, message, onConfirm) {
        if (!this.elements.confirmModal) return;
        
        if (this.elements.confirmTitle) this.elements.confirmTitle.textContent = title;
        if (this.elements.confirmMessage) this.elements.confirmMessage.textContent = message;
        
        this.elements.confirmModal.classList.remove('hidden');

        const handleConfirm = () => {
            onConfirm();
            this.closeConfirmModal();
            cleanup();
        };

        const handleCancel = () => {
            this.closeConfirmModal();
            cleanup();
        };

        const cleanup = () => {
            if (this.elements.confirmOk) {
                this.elements.confirmOk.removeEventListener('click', handleConfirm);
            }
            if (this.elements.confirmCancel) {
                this.elements.confirmCancel.removeEventListener('click', handleCancel);
            }
        };

        if (this.elements.confirmOk) {
            this.elements.confirmOk.addEventListener('click', handleConfirm);
        }
        if (this.elements.confirmCancel) {
            this.elements.confirmCancel.addEventListener('click', handleCancel);
        }
    }

    closeConfirmModal() {
        if (this.elements.confirmModal) {
            this.elements.confirmModal.classList.add('hidden');
        }
    }

    // Toast notifications
    showToast(message, type = 'info', duration = 3000) {
        if (!this.elements.toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        toast.innerHTML = `
            <i class="${icons[type]} toast-icon"></i>
            <span class="toast-message">${this.escapeHtml(message)}</span>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        const closeButton = toast.querySelector('.toast-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => this.removeToast(toast));
        }

        this.elements.toastContainer.appendChild(toast);

        // Auto remove after duration
        setTimeout(() => {
            if (toast.parentNode) {
                this.removeToast(toast);
            }
        }, duration);
    }

    removeToast(toast) {
        toast.classList.add('removing');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 250);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.todoApp = new TodoApp();
});

// Service worker registration for PWA capabilities (optional enhancement)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker would be registered here in a production app
        console.log('TodoApp: Ready for PWA enhancement');
    });
}