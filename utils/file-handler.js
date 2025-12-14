const fs = require('fs');
const path = require('path');

/**
 * File Handler Utility Library
 * Handles file operations for mass checker
 * @author Dsigala
 * @version 1.0.0
 */
class FileHandler {
    /**
     * Read lines from a text file
     * @param {string} filePath - Path to the file
     * @returns {Array<string>} Array of lines
     */
    static readLines(filePath) {
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            return data.split('\n')
                .map(line => line.trim())
                .filter(line => line !== '');
        } catch (error) {
            console.log(`❌ Error reading file ${filePath}: ${error.message}`);
            return [];
        }
    }

    /**
     * Parse combo file (email:password format)
     * @param {string} filePath - Path to combo file
     * @returns {Array<Object>} Array of {email, password} objects
     */
    static parseComboFile(filePath) {
        const lines = this.readLines(filePath);
        const combos = [];

        for (const line of lines) {
            if (line.includes(':')) {
                const [email, password] = line.split(':');
                if (email && password) {
                    combos.push({
                        email: email.trim(),
                        password: password.trim()
                    });
                }
            }
        }

        return combos;
    }

    /**
     * Save results to file
     * @param {Array<Object>} results - Array of result objects
     * @param {string} fileName - Output file name
     * @param {string} statusFilter - Status to filter by (optional)
     */
    static saveResults(results, fileName, statusFilter = null) {
        try {
            let filteredResults = results;
            
            if (statusFilter) {
                filteredResults = results.filter(result => result.status === statusFilter);
            }

            const lines = filteredResults.map(result => `${result.email}:${result.password}`);
            
            if (lines.length > 0) {
                fs.writeFileSync(fileName, lines.join('\n'));
                console.log(`✅ ${filteredResults.length} results saved to ${fileName}`);
            } else {
                console.log(`⚠️ No results to save for ${fileName}`);
            }
        } catch (error) {
            console.log(`❌ Error saving to ${fileName}: ${error.message}`);
        }
    }

    /**
     * Check if file exists
     * @param {string} filePath - Path to check
     * @returns {boolean}
     */
    static exists(filePath) {
        return fs.existsSync(filePath);
    }

    /**
     * Create directory if it doesn't exist
     * @param {string} dirPath - Directory path
     */
    static createDir(dirPath) {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    }

    /**
     * Get file stats
     * @param {string} filePath - File path
     * @returns {Object|null} File stats or null if error
     */
    static getStats(filePath) {
        try {
            return fs.statSync(filePath);
        } catch (error) {
            return null;
        }
    }

    /**
     * Save categorized results to separate files
     * @param {Array<Object>} results - Array of result objects
     * @param {string} outputDir - Output directory
     */
    static saveCategorizedResults(results, outputDir = './results') {
        this.createDir(outputDir);

        const categories = {
            'valid': 'ok',
            'invalid': 'fail',
            'custom': 'custom',
            'nfa': 'nfa',
            'retry': 'retry'
        };

        for (const [fileName, status] of Object.entries(categories)) {
            const filePath = path.join(outputDir, `${fileName}.txt`);
            this.saveResults(results, filePath, status);
        }
    }
}

module.exports = FileHandler;
