/**
 * Invoice Generator - Create professional invoices with PDF export
 * Features: Dynamic line items, live calculations, PDF generation
 */

const InvoiceGenerator = {
    // Invoice data
    invoiceData: {
        invoiceNumber: '',
        date: new Date().toISOString().split('T')[0],
        dueDate: '',
        billFrom: {
            name: '',
            email: '',
            address: '',
            phone: ''
        },
        billTo: {
            name: '',
            company: '',
            email: '',
            address: ''
        },
        items: [],
        subtotal: 0,
        taxRate: 0,
        taxAmount: 0,
        discount: 0,
        total: 0,
        notes: ''
    },

    /**
     * Generate unique invoice number
     */
    generateInvoiceNumber() {
        const prefix = 'INV';
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `${prefix}-${year}${month}-${random}`;
    },

    /**
     * Add new line item
     */
    addItem(description = '', quantity = 1, rate = 0) {
        const item = {
            id: Date.now() + Math.random(),
            description,
            quantity,
            rate,
            amount: quantity * rate
        };

        this.invoiceData.items.push(item);
        return item;
    },

    /**
     * Remove line item
     */
    removeItem(itemId) {
        this.invoiceData.items = this.invoiceData.items.filter(item => item.id !== itemId);
        this.calculateTotals();
    },

    /**
     * Update line item
     */
    updateItem(itemId, field, value) {
        const item = this.invoiceData.items.find(i => i.id === itemId);
        if (item) {
            item[field] = value;

            // Recalculate amount
            if (field === 'quantity' || field === 'rate') {
                item.amount = item.quantity * item.rate;
            }

            this.calculateTotals();
        }
    },

    /**
     * Calculate all totals
     */
    calculateTotals() {
        // Calculate subtotal
        this.invoiceData.subtotal = this.invoiceData.items.reduce((sum, item) => {
            return sum + (item.quantity * item.rate);
        }, 0);

        // Calculate tax
        this.invoiceData.taxAmount = (this.invoiceData.subtotal * this.invoiceData.taxRate) / 100;

        // Calculate total
        this.invoiceData.total = this.invoiceData.subtotal + this.invoiceData.taxAmount - this.invoiceData.discount;

        return {
            subtotal: this.invoiceData.subtotal,
            taxAmount: this.invoiceData.taxAmount,
            total: this.invoiceData.total
        };
    },

    /**
     * Set tax rate
     */
    setTaxRate(rate) {
        this.invoiceData.taxRate = parseFloat(rate) || 0;
        this.calculateTotals();
    },

    /**
     * Set discount
     */
    setDiscount(amount) {
        this.invoiceData.discount = parseFloat(amount) || 0;
        this.calculateTotals();
    },

    /**
     * Update billing info
     */
    updateBillFrom(field, value) {
        this.invoiceData.billFrom[field] = value;
    },

    updateBillTo(field, value) {
        this.invoiceData.billTo[field] = value;
    },

    /**
     * Reset invoice
     */
    reset() {
        this.invoiceData = {
            invoiceNumber: this.generateInvoiceNumber(),
            date: new Date().toISOString().split('T')[0],
            dueDate: '',
            billFrom: { name: '', email: '', address: '', phone: '' },
            billTo: { name: '', company: '', email: '', address: '' },
            items: [],
            subtotal: 0,
            taxRate: 0,
            taxAmount: 0,
            discount: 0,
            total: 0,
            notes: ''
        };
    },

    /**
     * Save to localStorage
     */
    save() {
        localStorage.setItem('invoice_draft', JSON.stringify(this.invoiceData));
    },

    /**
     * Load from localStorage
     */
    load() {
        const saved = localStorage.getItem('invoice_draft');
        if (saved) {
            this.invoiceData = JSON.parse(saved);
            return true;
        }
        return false;
    },

    /**
     * Export as JSON
     */
    exportJSON() {
        const dataStr = JSON.stringify(this.invoiceData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `invoice-${this.invoiceData.invoiceNumber}.json`;
        link.click();
        URL.revokeObjectURL(url);
    },

    /**
     * Format currency
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },

    /**
     * Format date
     */
    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    }
};

// Export for use
window.InvoiceGenerator = InvoiceGenerator;
