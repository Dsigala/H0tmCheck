/**
 * Advanced Integration Example
 * Shows advanced usage with custom processing and error handling
 */

const { MicrosoftAuth, FileHandler, Display } = require('@masanto/hotku-mailhub');

class CustomEmailVerifier {
    constructor(options = {}) {
        this.auth = new MicrosoftAuth();
        this.options = {
            delay: options.delay || 1000,
            maxRetries: options.maxRetries || 3,
            batchSize: options.batchSize || 10,
            ...options
        };
        this.results = [];
        this.stats = {
            total: 0,
            processed: 0,
            valid: 0,
            invalid: 0,
            errors: 0
        };
    }

    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async verifyEmail(email, password, retryCount = 0) {
        try {
            const [status, canary] = await this.auth.verify(email, password);
            
            const result = {
                email,
                password,
                status,
                canary,
                timestamp: new Date().toISOString(),
                retryCount
            };

            this.results.push(result);
            this.stats.processed++;

            if (status === 'ok') {
                this.stats.valid++;
                Display.showResult('ok', email, password);
            } else if (status === 'fail') {
                this.stats.invalid++;
            } else if (status === 'retry' && retryCount < this.options.maxRetries) {
                Display.showWarning(`Retrying ${email} (attempt ${retryCount + 1})`);
                await this.delay(this.options.delay * 2);
                return await this.verifyEmail(email, password, retryCount + 1);
            }

            return result;

        } catch (error) {
            this.stats.errors++;
            Display.showError(`Error verifying ${email}: ${error.message}`);
            
            const errorResult = {
                email,
                password,
                status: 'error',
                error: error.message,
                timestamp: new Date().toISOString(),
                retryCount
            };

            this.results.push(errorResult);
            return errorResult;
        }
    }

    async processBatch(emails) {
        Display.showInfo(`Processing batch of ${emails.length} emails...`);

        const promises = emails.map(async ({ email, password }, index) => {
            // Stagger requests to avoid overwhelming the server
            await this.delay(index * 100);
            return await this.verifyEmail(email, password);
        });

        const results = await Promise.all(promises);
        
        // Wait between batches
        await this.delay(this.options.delay);
        
        return results;
    }

    async verifyEmails(emails) {
        Display.showBanner();
        Display.showInfo(`Starting verification of ${emails.length} emails\n`);

        this.stats.total = emails.length;

        // Process in batches
        const batches = [];
        for (let i = 0; i < emails.length; i += this.options.batchSize) {
            batches.push(emails.slice(i, i + this.options.batchSize));
        }

        Display.showInfo(`Processing ${batches.length} batches of max ${this.options.batchSize} emails each`);

        for (let i = 0; i < batches.length; i++) {
            const batch = batches[i];
            Display.showInfo(`\nProcessing batch ${i + 1}/${batches.length}...`);
            
            await this.processBatch(batch);
            
            // Show progress
            const progress = Math.round((this.stats.processed / this.stats.total) * 100);
            console.log(`Progress: ${this.stats.processed}/${this.stats.total} (${progress}%)`);
        }

        return this.getResults();
    }

    getResults() {
        return {
            stats: { ...this.stats },
            results: [...this.results],
            validResults: this.results.filter(r => r.status === 'ok'),
            invalidResults: this.results.filter(r => r.status === 'fail'),
            errorResults: this.results.filter(r => r.status === 'error')
        };
    }

    saveResults(outputDir = './advanced-results') {
        FileHandler.createDir(outputDir);

        const { validResults, invalidResults, errorResults } = this.getResults();

        // Save valid results
        if (validResults.length > 0) {
            FileHandler.saveResults(validResults, `${outputDir}/valid.txt`);
        }

        // Save detailed JSON report
        const report = {
            timestamp: new Date().toISOString(),
            stats: this.stats,
            options: this.options,
            results: this.results
        };

        require('fs').writeFileSync(
            `${outputDir}/detailed-report.json`, 
            JSON.stringify(report, null, 2)
        );

        Display.showSuccess(`Results saved to ${outputDir}/`);
    }
}

async function advancedExample() {
    const verifier = new CustomEmailVerifier({
        delay: 2000,           // 2 seconds between requests
        maxRetries: 2,         // Retry failed requests 2 times
        batchSize: 5           // Process 5 emails simultaneously
    });

    // Sample emails to verify
    const emails = [
        { email: 'user1@outlook.com', password: 'pass123' },
        { email: 'user2@hotmail.com', password: 'pass456' },
        { email: 'user3@live.com', password: 'pass789' },
        { email: 'invalid@outlook.com', password: 'wrongpass' },
        { email: 'test@hotmail.com', password: 'testpass' }
    ];

    try {
        // Verify emails
        const results = await verifier.verifyEmails(emails);

        // Show final results
        Display.showFinalStats(results.stats, results.stats.total);

        // Save results
        verifier.saveResults('./advanced-results');

        // Custom analysis
        console.log('\n📈 Advanced Analysis:');
        console.log(`Success rate: ${((results.stats.valid / results.stats.total) * 100).toFixed(2)}%`);
        console.log(`Error rate: ${((results.stats.errors / results.stats.total) * 100).toFixed(2)}%`);

        if (results.validResults.length > 0) {
            console.log('\n✅ Valid Accounts Found:');
            results.validResults.forEach(result => {
                console.log(`  📧 ${result.email} (verified at ${result.timestamp})`);
            });
        }

    } catch (error) {
        Display.showError(`Advanced verification failed: ${error.message}`);
    }
}

// Run example
if (require.main === module) {
    advancedExample().catch(console.error);
}

module.exports = { CustomEmailVerifier, advancedExample };
