/**
 * Basic Library Usage Example
 * Shows how to use HOTKU MailHub as a library in your project
 */

const { MailHubApp, MassChecker, FileHandler, Display } = require('@masanto/hotku-mailhub');

async function basicExample() {
    console.log('🚀 Basic Library Usage Example\n');

    // Create mass checker instance
    const checker = new MassChecker();

    // Sample combo data
    const combos = [
        { email: 'test1@outlook.com', password: 'password123' },
        { email: 'test2@hotmail.com', password: 'password456' },
        { email: 'test3@live.com', password: 'password789' }
    ];

    // Create temporary combo file
    const comboFile = './temp-combo.txt';
    const comboLines = combos.map(c => `${c.email}:${c.password}`).join('\n');
    require('fs').writeFileSync(comboFile, comboLines);

    try {
        // Show banner
        Display.showBanner();
        Display.showInfo(`Processing ${combos.length} email accounts...\n`);

        // Process mass checking
        await checker.processMass(comboFile, {
            outputDir: './example-results'
        });

        // Get results
        const stats = checker.getStats();
        const results = checker.getResults();

        // Show custom summary
        console.log('\n📊 Custom Results Summary:');
        console.log(`Total processed: ${results.length}`);
        console.log(`Valid accounts: ${stats.valid}`);
        console.log(`Invalid accounts: ${stats.invalid}`);

        // Get only valid results
        const validResults = results.filter(r => r.status === 'ok');
        if (validResults.length > 0) {
            console.log('\n✅ Valid Accounts:');
            validResults.forEach(result => {
                console.log(`  - ${result.email}:${result.password}`);
            });
        }

    } catch (error) {
        Display.showError(`Error: ${error.message}`);
    } finally {
        // Cleanup
        if (require('fs').existsSync(comboFile)) {
            require('fs').unlinkSync(comboFile);
        }
    }
}

// Run example
if (require.main === module) {
    basicExample().catch(console.error);
}

module.exports = basicExample;
