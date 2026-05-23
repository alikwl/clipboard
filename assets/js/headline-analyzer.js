/**
 * Headline Analyzer - Scores and analyzes blog headlines
 * Based on SEO best practices, sentiment analysis, and readability
 */

const HeadlineAnalyzer = {
    // Power words that increase engagement
    powerWords: [
        'ultimate', 'essential', 'complete', 'guide', 'free', 'proven', 'amazing',
        'incredible', 'powerful', 'effective', 'simple', 'easy', 'quick', 'fast',
        'best', 'top', 'secret', 'exclusive', 'limited', 'guaranteed', 'absolute',
        'perfect', 'revolutionary', 'breakthrough', 'stunning', 'remarkable'
    ],

    // Emotional words for sentiment
    positiveWords: [
        'love', 'happy', 'joy', 'success', 'win', 'achieve', 'grow', 'thrive',
        'excel', 'triumph', 'delight', 'wonderful', 'fantastic', 'brilliant'
    ],

    negativeWords: [
        'danger', 'risk', 'warning', 'mistake', 'fail', 'avoid', 'stop', 'never',
        'worst', 'terrible', 'disaster', 'crisis', 'problem', 'fear'
    ],

    // Common/filler words (low value)
    commonWords: [
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been'
    ],

    /**
     * Main analysis function
     */
    analyze(headline) {
        if (!headline || headline.trim().length === 0) {
            return {
                score: 0,
                feedback: ['Please enter a headline to analyze.'],
                details: {}
            };
        }

        const text = headline.trim();
        const words = text.toLowerCase().split(/\s+/);
        const charCount = text.length;
        const wordCount = words.length;

        let score = 0;
        let feedback = [];
        let details = {};

        // 1. Length Analysis (0-25 points)
        const lengthResult = this.analyzeLeng(charCount, wordCount);
        score += lengthResult.score;
        feedback.push(...lengthResult.feedback);
        details.length = lengthResult;

        // 2. Power Words (0-25 points)
        const powerResult = this.analyzePowerWords(words);
        score += powerResult.score;
        feedback.push(...powerResult.feedback);
        details.powerWords = powerResult;

        // 3. Sentiment (0-20 points)
        const sentimentResult = this.analyzeSentiment(words);
        score += sentimentResult.score;
        feedback.push(...sentimentResult.feedback);
        details.sentiment = sentimentResult;

        // 4. Type Detection (0-15 points)
        const typeResult = this.analyzeType(text);
        score += typeResult.score;
        feedback.push(...typeResult.feedback);
        details.type = typeResult;

        // 5. Readability (0-15 points)
        const readabilityResult = this.analyzeReadability(words, text);
        score += readabilityResult.score;
        feedback.push(...readabilityResult.feedback);
        details.readability = readabilityResult;

        // Cap score at 100
        score = Math.min(100, Math.round(score));

        return {
            score,
            feedback,
            details,
            grade: this.getGrade(score)
        };
    },

    /**
     * Analyze headline length
     */
    analyzeLeng(charCount, wordCount) {
        let score = 0;
        let feedback = [];

        // Optimal: 40-60 characters (Google truncates at ~60)
        if (charCount >= 40 && charCount <= 60) {
            score = 25;
            feedback.push('✓ Perfect length for SEO (40-60 characters)');
        } else if (charCount >= 30 && charCount < 40) {
            score = 20;
            feedback.push('⚠ Headline is a bit short. Aim for 40-60 characters.');
        } else if (charCount > 60 && charCount <= 70) {
            score = 20;
            feedback.push('⚠ Headline is slightly long. May be truncated in search results.');
        } else if (charCount < 30) {
            score = 10;
            feedback.push('✗ Headline is too short. Add more descriptive words.');
        } else {
            score = 10;
            feedback.push('✗ Headline is too long. Keep it under 60 characters for best SEO.');
        }

        // Word count check (optimal: 6-12 words)
        if (wordCount >= 6 && wordCount <= 12) {
            feedback.push('✓ Good word count (' + wordCount + ' words)');
        } else if (wordCount < 6) {
            feedback.push('⚠ Consider adding more words for clarity');
        } else {
            feedback.push('⚠ Try to be more concise');
        }

        return { score, feedback, charCount, wordCount };
    },

    /**
     * Analyze power words
     */
    analyzePowerWords(words) {
        const foundPowerWords = words.filter(word =>
            this.powerWords.includes(word)
        );

        let score = 0;
        let feedback = [];

        if (foundPowerWords.length >= 2) {
            score = 25;
            feedback.push('✓ Excellent use of power words: ' + foundPowerWords.join(', '));
        } else if (foundPowerWords.length === 1) {
            score = 15;
            feedback.push('✓ Good! Found power word: ' + foundPowerWords[0]);
            feedback.push('⚠ Add one more power word for maximum impact');
        } else {
            score = 0;
            feedback.push('✗ No power words detected. Add words like "ultimate", "essential", or "proven"');
        }

        return { score, feedback, found: foundPowerWords };
    },

    /**
     * Analyze sentiment
     */
    analyzeSentiment(words) {
        const positive = words.filter(word => this.positiveWords.includes(word));
        const negative = words.filter(word => this.negativeWords.includes(word));

        let score = 0;
        let feedback = [];
        let sentiment = 'neutral';

        if (positive.length > 0 || negative.length > 0) {
            score = 20;
            if (positive.length > negative.length) {
                sentiment = 'positive';
                feedback.push('✓ Positive sentiment detected');
            } else if (negative.length > positive.length) {
                sentiment = 'negative';
                feedback.push('✓ Negative sentiment (creates urgency)');
            } else {
                sentiment = 'mixed';
                feedback.push('✓ Mixed sentiment detected');
            }
        } else {
            score = 10;
            sentiment = 'neutral';
            feedback.push('⚠ Neutral tone. Add emotional words for more engagement');
        }

        return { score, feedback, sentiment, positive, negative };
    },

    /**
     * Detect headline type
     */
    analyzeType(text) {
        let score = 0;
        let feedback = [];
        let types = [];

        // Check for number (listicle)
        if (/^\d+/.test(text)) {
            score += 10;
            types.push('listicle');
            feedback.push('✓ Listicle format (starts with number) - performs well!');
        }

        // Check for "How to"
        if (/^how\s+to/i.test(text)) {
            score += 10;
            types.push('how-to');
            feedback.push('✓ "How-to" format - great for tutorials!');
        }

        // Check for question
        if (text.includes('?')) {
            score += 5;
            types.push('question');
            feedback.push('✓ Question format - engages curiosity');
        }

        if (types.length === 0) {
            score = 5;
            feedback.push('⚠ Consider using a listicle (e.g., "7 Ways...") or "How to..." format');
        }

        return { score, feedback, types };
    },

    /**
     * Analyze readability
     */
    analyzeReadability(words, text) {
        let score = 0;
        let feedback = [];

        // Count syllables (simplified)
        const syllableCount = this.countSyllables(text);
        const wordCount = words.length;
        const sentenceCount = 1; // Headlines are typically one sentence

        // Simplified Flesch Reading Ease
        // Higher score = easier to read (aim for 60+)
        const fleschScore = 206.835 - (1.015 * (wordCount / sentenceCount)) - (84.6 * (syllableCount / wordCount));

        if (fleschScore >= 60) {
            score = 15;
            feedback.push('✓ Easy to read and understand');
        } else if (fleschScore >= 30) {
            score = 10;
            feedback.push('⚠ Moderately complex. Simplify if possible');
        } else {
            score = 5;
            feedback.push('✗ Too complex. Use simpler words');
        }

        // Check for title case
        const isTitleCase = this.isTitleCase(text);
        if (isTitleCase) {
            feedback.push('✓ Proper title case formatting');
        } else {
            feedback.push('⚠ Consider using title case (capitalize major words)');
        }

        return { score, feedback, fleschScore: Math.round(fleschScore), syllableCount };
    },

    /**
     * Count syllables (simplified algorithm)
     */
    countSyllables(text) {
        const words = text.toLowerCase().match(/[a-z]+/g) || [];
        let count = 0;

        words.forEach(word => {
            // Count vowel groups
            const vowelGroups = word.match(/[aeiouy]+/g);
            count += vowelGroups ? vowelGroups.length : 1;

            // Subtract silent 'e' at end
            if (word.endsWith('e')) {
                count--;
            }

            // Minimum 1 syllable per word
            if (count < 1) count = 1;
        });

        return count;
    },

    /**
     * Check if text is in title case
     */
    isTitleCase(text) {
        const words = text.split(/\s+/);
        const minorWords = ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'by', 'in', 'of'];

        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const firstChar = word[0];

            // First and last words should always be capitalized
            if (i === 0 || i === words.length - 1) {
                if (firstChar !== firstChar.toUpperCase()) {
                    return false;
                }
            } else {
                // Minor words can be lowercase
                if (!minorWords.includes(word.toLowerCase())) {
                    if (firstChar !== firstChar.toUpperCase()) {
                        return false;
                    }
                }
            }
        }

        return true;
    },

    /**
     * Get grade based on score
     */
    getGrade(score) {
        if (score >= 90) return 'A+';
        if (score >= 80) return 'A';
        if (score >= 70) return 'B';
        if (score >= 60) return 'C';
        if (score >= 50) return 'D';
        return 'F';
    }
};

// Export for use
window.HeadlineAnalyzer = HeadlineAnalyzer;
