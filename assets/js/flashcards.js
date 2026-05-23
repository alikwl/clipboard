/**
 * Flashcards with SM-2 Spaced Repetition Algorithm
 * Implements the SuperMemo-2 algorithm for optimal learning
 */

const FlashcardApp = {
    decks: [],
    currentDeck: null,
    currentCard: null,
    studyQueue: [],

    /**
     * SM-2 Algorithm Implementation
     * Based on SuperMemo-2 specifications
     */
    calculateSM2(card, quality) {
        // quality: 0-5 (0=blackout, 5=perfect)
        let { repetitions, easiness, interval } = card.sm2Data;

        // Update easiness factor
        easiness = Math.max(1.3, easiness + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

        // Update repetitions and interval
        if (quality < 3) {
            // Failed - reset
            repetitions = 0;
            interval = 1;
        } else {
            // Passed
            if (repetitions === 0) {
                interval = 1;
            } else if (repetitions === 1) {
                interval = 6;
            } else {
                interval = Math.round(interval * easiness);
            }
            repetitions++;
        }

        // Calculate next review date
        const nextReview = new Date();
        nextReview.setDate(nextReview.getDate() + interval);

        return {
            repetitions,
            easiness,
            interval,
            nextReview: nextReview.toISOString()
        };
    },

    /**
     * Create a new deck
     */
    createDeck(name, description = '') {
        const deck = {
            id: Date.now() + Math.random(),
            name,
            description,
            cards: [],
            createdAt: new Date().toISOString(),
            lastStudied: null
        };

        this.decks.push(deck);
        this.save();
        return deck;
    },

    /**
     * Delete a deck
     */
    deleteDeck(deckId) {
        this.decks = this.decks.filter(d => d.id !== deckId);
        this.save();
    },

    /**
     * Add card to deck
     */
    addCard(deckId, front, back) {
        const deck = this.decks.find(d => d.id === deckId);
        if (!deck) return null;

        const card = {
            id: Date.now() + Math.random(),
            front,
            back,
            sm2Data: {
                repetitions: 0,
                easiness: 2.5,
                interval: 1,
                nextReview: new Date().toISOString()
            },
            createdAt: new Date().toISOString(),
            lastReviewed: null
        };

        deck.cards.push(card);
        this.save();
        return card;
    },

    /**
     * Delete card
     */
    deleteCard(deckId, cardId) {
        const deck = this.decks.find(d => d.id === deckId);
        if (!deck) return;

        deck.cards = deck.cards.filter(c => c.id !== cardId);
        this.save();
    },

    /**
     * Update card
     */
    updateCard(deckId, cardId, front, back) {
        const deck = this.decks.find(d => d.id === deckId);
        if (!deck) return;

        const card = deck.cards.find(c => c.id === cardId);
        if (card) {
            card.front = front;
            card.back = back;
            this.save();
        }
    },

    /**
     * Get cards due for review
     */
    getDueCards(deckId) {
        const deck = this.decks.find(d => d.id === deckId);
        if (!deck) return [];

        const now = new Date();
        return deck.cards.filter(card => {
            const nextReview = new Date(card.sm2Data.nextReview);
            return nextReview <= now;
        });
    },

    /**
     * Start study session
     */
    startStudySession(deckId) {
        this.currentDeck = this.decks.find(d => d.id === deckId);
        if (!this.currentDeck) return null;

        this.studyQueue = this.getDueCards(deckId);
        this.currentCard = this.studyQueue[0] || null;

        return {
            deck: this.currentDeck,
            totalCards: this.studyQueue.length,
            currentCard: this.currentCard
        };
    },

    /**
     * Review current card
     */
    reviewCard(quality) {
        if (!this.currentCard) return null;

        // Update SM-2 data
        const newSM2Data = this.calculateSM2(this.currentCard, quality);
        this.currentCard.sm2Data = newSM2Data;
        this.currentCard.lastReviewed = new Date().toISOString();

        // Update deck last studied
        if (this.currentDeck) {
            this.currentDeck.lastStudied = new Date().toISOString();
        }

        // Remove from queue
        this.studyQueue.shift();

        // Get next card
        this.currentCard = this.studyQueue[0] || null;

        this.save();

        return {
            remaining: this.studyQueue.length,
            nextCard: this.currentCard
        };
    },

    /**
     * Get deck statistics
     */
    getDeckStats(deckId) {
        const deck = this.decks.find(d => d.id === deckId);
        if (!deck) return null;

        const totalCards = deck.cards.length;
        const dueCards = this.getDueCards(deckId).length;
        const newCards = deck.cards.filter(c => c.sm2Data.repetitions === 0).length;
        const masteredCards = deck.cards.filter(c => c.sm2Data.repetitions >= 5).length;

        return {
            totalCards,
            dueCards,
            newCards,
            masteredCards
        };
    },

    /**
     * Save to localStorage
     */
    save() {
        localStorage.setItem('flashcard_decks', JSON.stringify(this.decks));
    },

    /**
     * Load from localStorage
     */
    load() {
        const saved = localStorage.getItem('flashcard_decks');
        if (saved) {
            this.decks = JSON.parse(saved);
            return true;
        }
        return false;
    },

    /**
     * Export deck as JSON
     */
    exportDeck(deckId) {
        const deck = this.decks.find(d => d.id === deckId);
        if (!deck) return;

        const dataStr = JSON.stringify(deck, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `deck-${deck.name.replace(/\s+/g, '-')}.json`;
        link.click();
        URL.revokeObjectURL(url);
    },

    /**
     * Import deck from JSON
     */
    importDeck(jsonData) {
        try {
            const deck = JSON.parse(jsonData);
            deck.id = Date.now() + Math.random(); // New ID
            this.decks.push(deck);
            this.save();
            return deck;
        } catch (e) {
            console.error('Import failed:', e);
            return null;
        }
    }
};

// Export for use
window.FlashcardApp = FlashcardApp;
