// Free Clipboard Manager
let clipboardItems = [];
let currentFilter = 'all';
let advancedSearchActive = false;
let advancedFilters = {
    category: '',
    tag: '',
    dateFrom: '',
    dateTo: '',
    favoritesOnly: false
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadClipboardFromStorage();
    renderClipboard();
    updateStats();
    updateTagFilter();
    
    // Setup search
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    
    // Setup paste detection
    document.getElementById('newClipboardText').addEventListener('paste', function() {
        setTimeout(() => {
            const text = this.value;
            if (text) {
                detectCategory(text);
            }
        }, 10);
    });
    
    // Setup advanced search listeners
    document.getElementById('searchCategory').addEventListener('change', applyAdvancedSearch);
    document.getElementById('searchTag').addEventListener('change', applyAdvancedSearch);
    document.getElementById('searchDateFrom').addEventListener('change', applyAdvancedSearch);
    document.getElementById('searchDateTo').addEventListener('change', applyAdvancedSearch);
    document.getElementById('searchFavoritesOnly').addEventListener('change', applyAdvancedSearch);
});

// Add new clipboard item
function addClipboardItem() {
    const text = document.getElementById('newClipboardText').value.trim();
    const category = document.getElementById('entryCategory').value;
    const title = document.getElementById('entryTitle').value.trim();
    const tagsInput = document.getElementById('entryTags').value.trim();
    
    if (!text) {
        showNotification('Please enter some text', 'error');
        return;
    }
    
    // Parse tags
    const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
    
    const item = {
        id: Date.now(),
        text: text,
        category: category,
        title: title || generateTitle(text, category),
        tags: tags,
        timestamp: new Date().toISOString(),
        favorite: false,
        copyCount: 0
    };
    
    clipboardItems.unshift(item);
    saveClipboardToStorage();
    renderClipboard();
    updateStats();
    updateTagFilter();
    
    // Clear inputs
    document.getElementById('newClipboardText').value = '';
    document.getElementById('entryTitle').value = '';
    document.getElementById('entryTags').value = '';
    
    showNotification('Added to clipboard!', 'success');
}

// Generate title from text
function generateTitle(text, category) {
    const maxLength = 50;
    let title = text.substring(0, maxLength);
    if (text.length > maxLength) title += '...';
    
    // Add emoji based on category
    const emoji = {
        'text': '📝',
        'code': '💻',
        'url': '🔗',
        'email': '📧'
    };
    
    return `${emoji[category] || '📋'} ${title}`;
}

// Detect category automatically
function detectCategory(text) {
    const urlPattern = /^(https?:\/\/|www\.)/i;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const codePattern = /(function|const|let|var|class|import|export|<\?php|def |public |private )/;
    
    let category = 'text';
    
    if (urlPattern.test(text)) {
        category = 'url';
    } else if (emailPattern.test(text)) {
        category = 'email';
    } else if (codePattern.test(text)) {
        category = 'code';
    }
    
    document.getElementById('entryCategory').value = category;
}

// Render clipboard items
function renderClipboard() {
    const container = document.getElementById('clipboardList');
    const emptyState = document.getElementById('emptyState');
    
    let filteredItems = clipboardItems;
    
    // Apply category filter
    if (currentFilter !== 'all') {
        if (currentFilter === 'favorite') {
            filteredItems = clipboardItems.filter(item => item.favorite);
        } else {
            filteredItems = clipboardItems.filter(item => item.category === currentFilter);
        }
    }
    
    // Apply basic search filter
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (searchTerm && !advancedSearchActive) {
        filteredItems = filteredItems.filter(item => {
            const matchesText = item.text.toLowerCase().includes(searchTerm);
            const matchesTitle = item.title.toLowerCase().includes(searchTerm);
            const matchesTags = item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            return matchesText || matchesTitle || matchesTags;
        });
    }
    
    // Apply advanced search filters
    if (advancedSearchActive) {
        if (advancedFilters.category) {
            filteredItems = filteredItems.filter(item => item.category === advancedFilters.category);
        }
        if (advancedFilters.tag) {
            filteredItems = filteredItems.filter(item => 
                item.tags && item.tags.includes(advancedFilters.tag)
            );
        }
        if (advancedFilters.dateFrom) {
            const fromDate = new Date(advancedFilters.dateFrom);
            filteredItems = filteredItems.filter(item => new Date(item.timestamp) >= fromDate);
        }
        if (advancedFilters.dateTo) {
            const toDate = new Date(advancedFilters.dateTo);
            toDate.setHours(23, 59, 59, 999);
            filteredItems = filteredItems.filter(item => new Date(item.timestamp) <= toDate);
        }
        if (advancedFilters.favoritesOnly) {
            filteredItems = filteredItems.filter(item => item.favorite);
        }
        if (searchTerm) {
            filteredItems = filteredItems.filter(item => {
                const matchesText = item.text.toLowerCase().includes(searchTerm);
                const matchesTitle = item.title.toLowerCase().includes(searchTerm);
                const matchesTags = item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTerm));
                return matchesText || matchesTitle || matchesTags;
            });
        }
    }
    
    if (filteredItems.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'flex';
        return;
    }
    
    container.style.display = 'grid';
    emptyState.style.display = 'none';
    
    container.innerHTML = filteredItems.map(item => `
        <div class="clipboard-item" data-id="${item.id}">
            <div class="item-header">
                <div class="item-title">
                    <span class="category-badge category-${item.category}">${getCategoryIcon(item.category)}</span>
                    <strong>${escapeHtml(item.title)}</strong>
                </div>
                <div class="item-actions">
                    <button onclick="toggleFavorite(${item.id})" class="icon-btn" title="Favorite" aria-label="${item.favorite ? 'Remove from favorites' : 'Add to favorites'}">
                        ${item.favorite ? '⭐' : '☆'}
                    </button>
                    <button onclick="editItem(${item.id})" class="icon-btn" title="Edit" aria-label="Edit item">✏️</button>
                    <button onclick="copyToClipboard(${item.id})" class="icon-btn" title="Copy" aria-label="Copy to clipboard">📋</button>
                    <button onclick="deleteItem(${item.id})" class="icon-btn" title="Delete" aria-label="Delete item">🗑️</button>
                </div>
            </div>
            <div class="item-content">
                <pre>${escapeHtml(item.text)}</pre>
            </div>
            ${item.tags && item.tags.length > 0 ? `
            <div class="item-tags">
                ${item.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
            </div>
            ` : ''}
            <div class="item-footer">
                <span class="item-time">${formatTime(item.timestamp)}</span>
                <span class="item-copies">Copied ${item.copyCount} times</span>
            </div>
        </div>
    `).join('');
}

// Get category icon
function getCategoryIcon(category) {
    const icons = {
        'text': '📝',
        'code': '💻',
        'url': '🔗',
        'email': '📧'
    };
    return icons[category] || '📋';
}

// Copy to clipboard
async function copyToClipboard(id) {
    const item = clipboardItems.find(i => i.id === id);
    if (!item) return;
    
    try {
        await navigator.clipboard.writeText(item.text);
        item.copyCount++;
        saveClipboardToStorage();
        renderClipboard();
        showNotification('Copied to clipboard!');
    } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = item.text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        item.copyCount++;
        saveClipboardToStorage();
        renderClipboard();
        showNotification('Copied to clipboard!');
    }
}

// Toggle favorite
function toggleFavorite(id) {
    const item = clipboardItems.find(i => i.id === id);
    if (item) {
        item.favorite = !item.favorite;
        saveClipboardToStorage();
        renderClipboard();
        updateStats();
    }
}

// Edit item
function editItem(id) {
    const item = clipboardItems.find(i => i.id === id);
    if (!item) return;
    
    const newText = prompt('Edit text:', item.text);
    if (newText !== null && newText.trim()) {
        item.text = newText.trim();
        const newTitle = prompt('Edit title:', item.title);
        if (newTitle !== null && newTitle.trim()) {
            item.title = newTitle.trim();
        }
        const newTags = prompt('Edit tags (comma-separated):', item.tags ? item.tags.join(', ') : '');
        if (newTags !== null) {
            item.tags = newTags.split(',').map(tag => tag.trim()).filter(tag => tag);
        }
        saveClipboardToStorage();
        renderClipboard();
        updateTagFilter();
        showNotification('Item updated!', 'success');
    }
}

// Delete item
function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        clipboardItems = clipboardItems.filter(i => i.id !== id);
        saveClipboardToStorage();
        renderClipboard();
        updateStats();
        showNotification('Item deleted!');
    }
}

// Filter by category
function filterCategory(category) {
    currentFilter = category;
    
    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
        }
    });
    
    renderClipboard();
}

// Toggle advanced search panel
function toggleAdvancedSearch() {
    const panel = document.getElementById('advancedSearchPanel');
    if (panel.style.display === 'none') {
        panel.style.display = 'block';
        advancedSearchActive = true;
    } else {
        panel.style.display = 'none';
        advancedSearchActive = false;
        clearAdvancedSearch();
    }
}

// Apply advanced search filters
function applyAdvancedSearch() {
    advancedFilters.category = document.getElementById('searchCategory').value;
    advancedFilters.tag = document.getElementById('searchTag').value;
    advancedFilters.dateFrom = document.getElementById('searchDateFrom').value;
    advancedFilters.dateTo = document.getElementById('searchDateTo').value;
    advancedFilters.favoritesOnly = document.getElementById('searchFavoritesOnly').checked;
    
    advancedSearchActive = true;
    renderClipboard();
}

// Clear advanced search filters
function clearAdvancedSearch() {
    document.getElementById('searchCategory').value = '';
    document.getElementById('searchTag').value = '';
    document.getElementById('searchDateFrom').value = '';
    document.getElementById('searchDateTo').value = '';
    document.getElementById('searchFavoritesOnly').checked = false;
    
    advancedFilters = {
        category: '',
        tag: '',
        dateFrom: '',
        dateTo: '',
        favoritesOnly: false
    };
    
    advancedSearchActive = false;
    renderClipboard();
}

// Update tag filter dropdown
function updateTagFilter() {
    const tagSelect = document.getElementById('searchTag');
    const allTags = new Set();
    
    clipboardItems.forEach(item => {
        if (item.tags) {
            item.tags.forEach(tag => allTags.add(tag));
        }
    });
    
    const currentValue = tagSelect.value;
    tagSelect.innerHTML = '<option value="">All Tags</option>';
    
    Array.from(allTags).sort().forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        tagSelect.appendChild(option);
    });
    
    if (currentValue && allTags.has(currentValue)) {
        tagSelect.value = currentValue;
    }
}

// Handle search
function handleSearch() {
    renderClipboard();
}

// Clear all clipboard
function clearAllClipboard() {
    if (confirm('Are you sure you want to clear all clipboard items? This cannot be undone.')) {
        clipboardItems = [];
        saveClipboardToStorage();
        renderClipboard();
        updateStats();
        updateTagFilter();
        showNotification('Clipboard cleared!', 'success');
    }
}

// Export clipboard
function exportClipboard() {
    if (clipboardItems.length === 0) {
        showNotification('No items to export', 'warning');
        return;
    }
    
    const exportData = {
        version: '2.0',
        exportDate: new Date().toISOString(),
        itemCount: clipboardItems.length,
        items: clipboardItems
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `clipboard-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification(`Exported ${clipboardItems.length} items!`, 'success');
}

// Import clipboard
function importClipboard() {
    document.getElementById('importFile').click();
}

function handleImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            let itemsToImport = [];
            
            // Handle both old format (array) and new format (object with metadata)
            if (Array.isArray(imported)) {
                itemsToImport = imported;
            } else if (imported.items && Array.isArray(imported.items)) {
                itemsToImport = imported.items;
            } else {
                showNotification('Invalid clipboard file format', 'error');
                return;
            }
            
            // Ensure imported items have tags array
            itemsToImport = itemsToImport.map(item => ({
                ...item,
                tags: item.tags || []
            }));
            
            if (confirm(`Import ${itemsToImport.length} items? This will add to your existing clipboard.`)) {
                // Merge with existing items, avoiding duplicates by ID
                const existingIds = new Set(clipboardItems.map(item => item.id));
                const newItems = itemsToImport.filter(item => !existingIds.has(item.id));
                
                clipboardItems = [...newItems, ...clipboardItems];
                saveClipboardToStorage();
                renderClipboard();
                updateStats();
                updateTagFilter();
                showNotification(`Imported ${newItems.length} new items!`, 'success');
            }
        } catch (err) {
            showNotification('Error reading file: ' + err.message, 'error');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

// Update statistics
function updateStats() {
    document.getElementById('totalItems').textContent = clipboardItems.length;
    document.getElementById('favoriteCount').textContent = clipboardItems.filter(i => i.favorite).length;
    
    const storageSize = new Blob([JSON.stringify(clipboardItems)]).size;
    document.getElementById('storageUsed').textContent = (storageSize / 1024).toFixed(2) + ' KB';
}

// Storage functions
function saveClipboardToStorage() {
    try {
        localStorage.setItem('freeClipboard', JSON.stringify(clipboardItems));
    } catch (e) {
        console.error('Failed to save to localStorage:', e);
    }
}

function loadClipboardFromStorage() {
    try {
        const stored = localStorage.getItem('freeClipboard');
        if (stored) {
            clipboardItems = JSON.parse(stored);
        }
    } catch (e) {
        console.error('Failed to load from localStorage:', e);
    }
}

// Utility functions
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
