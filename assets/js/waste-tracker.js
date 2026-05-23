/**
 * Waste Reduction Tracker - Track waste and discover eco-friendly alternatives
 * Features: Eco-swaps database, gamification, sustainability score
 */

const WasteTracker = {
    // Eco-friendly swaps database
    ecoSwaps: [
        // Plastic Items
        { trigger: 'plastic bottle', alternative: 'Stainless Steel or Glass Bottle', impact: 'Plastic bottles take 450 years to decompose. Reusable bottles last years.' },
        { trigger: 'plastic bag', alternative: 'Reusable Cloth Bags', impact: 'Plastic bags kill marine life and take 1000 years to break down.' },
        { trigger: 'plastic straw', alternative: 'Metal, Bamboo, or Glass Straws', impact: '500 million straws used daily in US alone. Most end up in oceans.' },
        { trigger: 'cling film', alternative: 'Beeswax Wraps or Silicone Lids', impact: 'Cling film is non-recyclable and leaches chemicals into food.' },
        { trigger: 'plastic wrap', alternative: 'Beeswax Wraps or Silicone Lids', impact: 'Cling film is non-recyclable and leaches chemicals into food.' },

        // Kitchen Items
        { trigger: 'paper towel', alternative: 'Swedish Dishcloths or Reusable Rags', impact: 'One Swedish cloth replaces 17 rolls of paper towels.' },
        { trigger: 'disposable cup', alternative: 'Reusable Coffee Cup or Tumbler', impact: '500 billion disposable cups used yearly. Most aren\'t recyclable.' },
        { trigger: 'plastic cutlery', alternative: 'Reusable Utensils or Bamboo Set', impact: '40 billion plastic utensils thrown away yearly in US alone.' },
        { trigger: 'tea bag', alternative: 'Loose Leaf Tea with Strainer', impact: 'Many tea bags contain hidden microplastics in the seal.' },
        { trigger: 'coffee pod', alternative: 'Refillable Pods or French Press', impact: 'Pods are major source of unrecyclable mixed waste.' },

        // Personal Care
        { trigger: 'disposable razor', alternative: 'Safety Razor', impact: 'Steel blades are recyclable. Plastic handles are not.' },
        { trigger: 'plastic toothbrush', alternative: 'Bamboo Toothbrush', impact: '1 billion plastic toothbrushes thrown away yearly in US.' },
        { trigger: 'makeup wipe', alternative: 'Reusable Makeup Remover Pads', impact: 'Wipes contain plastic and don\'t break down in sewers.' },
        { trigger: 'cotton swab', alternative: 'Reusable Silicone Swabs', impact: 'Plastic stems harm wildlife. Silicone swabs last years.' },
        { trigger: 'shampoo bottle', alternative: 'Shampoo Bar or Refill Station', impact: '550 million shampoo bottles thrown away yearly.' },

        // Food Storage
        { trigger: 'ziplock bag', alternative: 'Silicone Reusable Bags', impact: 'Ziplocks are single-use plastic. Silicone bags last years.' },
        { trigger: 'aluminum foil', alternative: 'Reusable Silicone Covers', impact: 'Foil production is energy-intensive. Reuse instead.' },
        { trigger: 'plastic container', alternative: 'Glass or Stainless Steel Containers', impact: 'Glass doesn\'t leach chemicals and lasts forever.' },

        // Other
        { trigger: 'paper napkin', alternative: 'Cloth Napkins', impact: 'Cloth napkins can be washed and reused hundreds of times.' },
        { trigger: 'sponge', alternative: 'Natural Loofah or Bamboo Brush', impact: 'Plastic sponges shed microplastics. Natural options biodegrade.' },
        { trigger: 'batteries', alternative: 'Rechargeable Batteries', impact: 'Rechargeable batteries can be used 1000+ times.' },
        { trigger: 'water bottle', alternative: 'Reusable Water Bottle', impact: '1 million plastic bottles sold per minute globally.' }
    ],

    // Waste history
    wasteHistory: [],

    /**
     * Search for eco-friendly alternative
     */
    searchSwap(query) {
        const searchTerm = query.toLowerCase().trim();

        if (!searchTerm) return null;

        // Find matching swap
        const swap = this.ecoSwaps.find(item =>
            item.trigger.includes(searchTerm) || searchTerm.includes(item.trigger)
        );

        return swap || null;
    },

    /**
     * Log waste produced
     */
    logWaste(item, category = 'general') {
        const entry = {
            id: Date.now() + Math.random(),
            type: 'waste',
            item,
            category,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString()
        };

        this.wasteHistory.push(entry);
        this.save();
        return entry;
    },

    /**
     * Log waste avoided
     */
    logAvoided(item, category = 'general') {
        const entry = {
            id: Date.now() + Math.random(),
            type: 'avoided',
            item,
            category,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString()
        };

        this.wasteHistory.push(entry);
        this.save();
        return entry;
    },

    /**
     * Calculate sustainability score
     */
    calculateScore() {
        if (this.wasteHistory.length === 0) return 0;

        const avoided = this.wasteHistory.filter(e => e.type === 'avoided').length;
        const total = this.wasteHistory.length;

        return Math.round((avoided / total) * 100);
    },

    /**
     * Get statistics
     */
    getStats(period = 'all') {
        let filteredHistory = this.wasteHistory;

        // Filter by period
        if (period === 'week') {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            filteredHistory = this.wasteHistory.filter(e =>
                new Date(e.timestamp) >= weekAgo
            );
        } else if (period === 'month') {
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            filteredHistory = this.wasteHistory.filter(e =>
                new Date(e.timestamp) >= monthAgo
            );
        }

        const wasteCount = filteredHistory.filter(e => e.type === 'waste').length;
        const avoidedCount = filteredHistory.filter(e => e.type === 'avoided').length;
        const totalActions = filteredHistory.length;
        const score = totalActions > 0 ? Math.round((avoidedCount / totalActions) * 100) : 0;

        return {
            wasteCount,
            avoidedCount,
            totalActions,
            score,
            period
        };
    },

    /**
     * Get recent history
     */
    getRecentHistory(limit = 10) {
        return this.wasteHistory
            .slice(-limit)
            .reverse();
    },

    /**
     * Get chart data for visualization
     */
    getChartData(days = 7) {
        const data = [];
        const today = new Date();

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toLocaleDateString();

            const dayEntries = this.wasteHistory.filter(e => e.date === dateStr);
            const avoided = dayEntries.filter(e => e.type === 'avoided').length;
            const waste = dayEntries.filter(e => e.type === 'waste').length;

            data.push({
                date: dateStr,
                avoided,
                waste
            });
        }

        return data;
    },

    /**
     * Delete entry
     */
    deleteEntry(entryId) {
        this.wasteHistory = this.wasteHistory.filter(e => e.id !== entryId);
        this.save();
    },

    /**
     * Clear all history
     */
    clearHistory() {
        if (confirm('Are you sure you want to clear all history? This cannot be undone.')) {
            this.wasteHistory = [];
            this.save();
            return true;
        }
        return false;
    },

    /**
     * Save to localStorage
     */
    save() {
        localStorage.setItem('waste_history', JSON.stringify(this.wasteHistory));
    },

    /**
     * Load from localStorage
     */
    load() {
        const saved = localStorage.getItem('waste_history');
        if (saved) {
            this.wasteHistory = JSON.parse(saved);
            return true;
        }
        return false;
    },

    /**
     * Export data
     */
    exportData() {
        const dataStr = JSON.stringify(this.wasteHistory, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `waste-tracker-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }
};

// Export for use
window.WasteTracker = WasteTracker;
