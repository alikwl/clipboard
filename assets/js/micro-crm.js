/**
 * Micro CRM - Simple client and project management
 * Features: Client management, project tracking, relational data, backup/restore
 */

const MicroCRM = {
    clients: [],
    projects: [],

    /**
     * Generate UUID for entities
     */
    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    /**
     * Create new client
     */
    createClient(name, email, phone = '', company = '', notes = '') {
        const client = {
            id: this.generateUUID(),
            name,
            email,
            phone,
            company,
            notes,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.clients.push(client);
        this.save();
        return client;
    },

    /**
     * Update client
     */
    updateClient(clientId, updates) {
        const client = this.clients.find(c => c.id === clientId);
        if (client) {
            Object.assign(client, updates, { updatedAt: new Date().toISOString() });
            this.save();
            return client;
        }
        return null;
    },

    /**
     * Delete client (cascade delete projects)
     */
    deleteClient(clientId) {
        // Delete associated projects
        this.projects = this.projects.filter(p => p.clientId !== clientId);

        // Delete client
        this.clients = this.clients.filter(c => c.id !== clientId);
        this.save();
    },

    /**
     * Get client by ID
     */
    getClient(clientId) {
        return this.clients.find(c => c.id === clientId);
    },

    /**
     * Search clients
     */
    searchClients(query) {
        const searchTerm = query.toLowerCase();
        return this.clients.filter(c =>
            c.name.toLowerCase().includes(searchTerm) ||
            c.email.toLowerCase().includes(searchTerm) ||
            c.company.toLowerCase().includes(searchTerm)
        );
    },

    /**
     * Create new project
     */
    createProject(clientId, name, description = '', status = 'active', budget = 0, deadline = '') {
        const project = {
            id: this.generateUUID(),
            clientId,
            name,
            description,
            status, // active, completed, on-hold
            budget,
            deadline,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.projects.push(project);
        this.save();
        return project;
    },

    /**
     * Update project
     */
    updateProject(projectId, updates) {
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            Object.assign(project, updates, { updatedAt: new Date().toISOString() });
            this.save();
            return project;
        }
        return null;
    },

    /**
     * Delete project
     */
    deleteProject(projectId) {
        this.projects = this.projects.filter(p => p.id !== projectId);
        this.save();
    },

    /**
     * Get projects by client
     */
    getProjectsByClient(clientId) {
        return this.projects.filter(p => p.clientId === clientId);
    },

    /**
     * Get project with client info
     */
    getProjectWithClient(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return null;

        const client = this.getClient(project.clientId);
        return { ...project, client };
    },

    /**
     * Get dashboard statistics
     */
    getDashboardStats() {
        const totalClients = this.clients.length;
        const totalProjects = this.projects.length;
        const activeProjects = this.projects.filter(p => p.status === 'active').length;
        const completedProjects = this.projects.filter(p => p.status === 'completed').length;
        const totalBudget = this.projects.reduce((sum, p) => sum + (parseFloat(p.budget) || 0), 0);

        return {
            totalClients,
            totalProjects,
            activeProjects,
            completedProjects,
            totalBudget
        };
    },

    /**
     * Get recent activity
     */
    getRecentActivity(limit = 10) {
        const activity = [];

        // Add clients
        this.clients.forEach(client => {
            activity.push({
                type: 'client',
                action: 'created',
                entity: client,
                timestamp: client.createdAt
            });
        });

        // Add projects
        this.projects.forEach(project => {
            activity.push({
                type: 'project',
                action: 'created',
                entity: project,
                timestamp: project.createdAt
            });
        });

        // Sort by timestamp and limit
        return activity
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, limit);
    },

    /**
     * Save to localStorage
     */
    save() {
        localStorage.setItem('crm_clients', JSON.stringify(this.clients));
        localStorage.setItem('crm_projects', JSON.stringify(this.projects));
    },

    /**
     * Load from localStorage
     */
    load() {
        const clients = localStorage.getItem('crm_clients');
        const projects = localStorage.getItem('crm_projects');

        if (clients) this.clients = JSON.parse(clients);
        if (projects) this.projects = JSON.parse(projects);

        return !!(clients || projects);
    },

    /**
     * Export all data
     */
    exportData() {
        const data = {
            clients: this.clients,
            projects: this.projects,
            exportedAt: new Date().toISOString()
        };

        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `crm-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    },

    /**
     * Import data
     */
    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);

            if (data.clients) this.clients = data.clients;
            if (data.projects) this.projects = data.projects;

            this.save();
            return true;
        } catch (e) {
            console.error('Import failed:', e);
            return false;
        }
    },

    /**
     * Clear all data
     */
    clearAllData() {
        if (confirm('Are you sure you want to delete ALL clients and projects? This cannot be undone!')) {
            this.clients = [];
            this.projects = [];
            this.save();
            return true;
        }
        return false;
    }
};

// Export for use
window.MicroCRM = MicroCRM;
