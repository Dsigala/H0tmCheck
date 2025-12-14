const readlineSync = require('readline-sync');
const MassChecker = require('./src/mass-checker');
const FileHandler = require('./utils/file-handler');
const Display = require('./utils/display');
const config = require('./config/app-config');

/**
 * HOTKU MailHub Mass Checker - Main Application
 * Professional email verification tool with modular architecture
 * @author masanto
 * @contributor Not-ISellStuff
 * @version 1.0.0
 */
class MailHubApp {
    constructor() {
        this.checker = new MassChecker();
    }

    /**
     * Show welcome message and get user input
     */
    async getUserInput() {
        Display.showInfo('Please provide the following information:\n');
        
        // Get combo file path
        const comboPath = readlineSync.question('📂 Enter combo file path (email:password format): ');
        
        if (!FileHandler.exists(comboPath)) {
            Display.showError('Combo file not found!');
            Display.showInfo('Make sure the file path is correct and the file exists.');
            return null;
        }

        // Show configuration
        const appConfig = {
            comboPath,
            outputDir: config.defaults.outputDir
        };
        
        Display.showConfig(appConfig);
        
        // Confirmation
        const confirm = readlineSync.question('\nProceed with mass checking? (y/n): ').toLowerCase();
        if (confirm !== 'y' && confirm !== 'yes') {
            Display.showWarning('Operation cancelled.');
            return null;
        }

        return appConfig;
    }

    /**
     * Main application flow
     */
    async run() {
        try {
            // Show banner
            Display.showBanner();

            // Get user input
            const userConfig = await this.getUserInput();
            if (!userConfig) {
                return;
            }

            // Initialize checker
            Display.showInfo('Initializing HOTKU mass checker...\n');

            // Start mass checking
            await this.checker.processMass(userConfig.comboPath, {
                outputDir: userConfig.outputDir
            });

            // Show completion message
            Display.showSuccess('Thank you for using HOTKU MailHub Mass Checker!');
            Display.showInfo('Check the valid.txt file for successful login credentials.');
            Display.showInfo(`Detailed results saved in: ${userConfig.outputDir}`);

        } catch (error) {
            Display.showError(`Application error: ${error.message}`);
            console.error(error);
        }
    }

    /**
     * Show application information
     */
    static showInfo() {
        console.log(`${config.app.name} v${config.app.version}`);
        console.log(`By: ${config.app.author}`);
        console.log(`Description: ${config.app.description}`);
    }
}

// Main execution
async function main() {
    const app = new MailHubApp();
    await app.run();
}

// Export for module usage
module.exports = {
    MailHubApp,
    MassChecker,
    FileHandler,
    Display,
    config
};

// Run if called directly
if (require.main === module) {
    main().catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}
