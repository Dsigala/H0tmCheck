/**
 * Console Display Utilities
 * Handles console output formatting and display
 * @author masanto
 * @contributor Not-ISellStuff
 * @version 1.0.0
 */
class Display {
    /**
     * Clear console and show HOTKU banner
     */
    static showBanner() {
        console.clear();
        console.log('\x1b[36m%s\x1b[0m', `

 __    __    ___   .___________..___  ___.   ______  __    __   _______   ______  __  ___ 
|  |  |  |  / _ \\  |           ||   \\/   |  /      ||  |  |  | |   ____| /      ||  |/  / 
|  |__|  | | | | | \`---|  |----\`|  \\  /  | |  ,----'|  |__|  | |  |__   |  ,----'|  '  /  
|   __   | | | | |     |  |     |  |\\/|  | |  |     |   __   | |   __|  |  |     |    <   
|  |  |  | | |_| |     |  |     |  |  |  | |  \`----.|  |  |  | |  |____ |  \`----.|  .  \\  
|__|  |__|  \\___/      |__|     |__|  |__|  \\______||__|  |__| |_______| \\______||__|\\__\\ 

        `);
        console.log('\x1b[33m%s\x1b[0m', '═══════════════════════════════════════════════');
        console.log('\x1b[32m%s\x1b[0m', '              Checker v1.0');
        console.log('\x1b[32m%s\x1b[0m', '           Author : Dsigala');
        console.log('\x1b[35m%s\x1b[0m', '           🔥 H0tmCheck 🔥');
        console.log('\x1b[33m%s\x1b[0m', '═══════════════════════════════════════════════');
        console.log('\x1b[37m%s\x1b[0m', '✅ Mass Email Checking  📊 High Performance');
        console.log('\x1b[37m%s\x1b[0m', '💾 Auto Save Valid     🚀 Direct Connection');
        console.log('\x1b[33m%s\x1b[0m', '═══════════════════════════════════════════════');
        console.log('');
    }

    /**
     * Show real-time progress statistics
     * @param {number} current - Current progress
     * @param {number} total - Total items
     * @param {Object} stats - Statistics object
     */
    static showProgress(current, total, stats) {
        const { valid, invalid, custom, nfa, retry } = stats;
        process.stdout.write(`\r🔄 Progress: ${current}/${total} | ✅ Valid: ${valid} | ❌ Invalid: ${invalid} | 🔒 Custom: ${custom} | 📧 NFA: ${nfa} | 🔄 Retry: ${retry}`);
    }

    /**
     * Show result with color coding
     * @param {string} status - Result status
     * @param {string} email - Email address
     * @param {string} password - Password
     */
    static showResult(status, email, password) {
        const combo = `${email}:${password}`;
        
        switch (status) {
            case 'ok':
                console.log(`\n✅ \x1b[32mVALID:\x1b[0m ${combo}`);
                break;
            case 'custom':
                console.log(`\n🔒 \x1b[33mCUSTOM:\x1b[0m ${combo}`);
                break;
            case 'nfa':
                console.log(`\n📧 \x1b[36mNFA:\x1b[0m ${combo}`);
                break;
            case 'fail':
                // Don't show invalid results to reduce spam
                break;
            case 'retry':
                console.log(`\n🔄 \x1b[31mRETRY:\x1b[0m ${combo}`);
                break;
        }
    }

    /**
     * Show final statistics
     * @param {Object} stats - Final statistics
     * @param {number} total - Total processed
     */
    static showFinalStats(stats, total) {
        console.log('\n\n🎉 Mass check completed!');
        console.log('\x1b[33m%s\x1b[0m', '═══════════════════════════════════════════════');
        console.log('\x1b[32m%s\x1b[0m', '📊 FINAL RESULTS:');
        console.log(`✅ Valid: \x1b[32m${stats.valid}\x1b[0m`);
        console.log(`❌ Invalid: \x1b[31m${stats.invalid}\x1b[0m`);
        console.log(`🔒 Custom: \x1b[33m${stats.custom}\x1b[0m`);
        console.log(`📧 NFA: \x1b[36m${stats.nfa}\x1b[0m`);
        console.log(`🔄 Retry: \x1b[31m${stats.retry}\x1b[0m`);
        console.log(`📊 Total: \x1b[37m${total}\x1b[0m`);
        
        const successRate = total > 0 ? ((stats.valid / total) * 100).toFixed(2) : 0;
        console.log(`📈 Success Rate: \x1b[32m${successRate}%\x1b[0m`);
        console.log('\x1b[33m%s\x1b[0m', '═══════════════════════════════════════════════');
    }

    /**
     * Show error message
     * @param {string} message - Error message
     */
    static showError(message) {
        console.log(`\x1b[31m❌ ${message}\x1b[0m`);
    }

    /**
     * Show success message
     * @param {string} message - Success message
     */
    static showSuccess(message) {
        console.log(`\x1b[32m✅ ${message}\x1b[0m`);
    }

    /**
     * Show info message
     * @param {string} message - Info message
     */
    static showInfo(message) {
        console.log(`\x1b[36mℹ️ ${message}\x1b[0m`);
    }

    /**
     * Show warning message
     * @param {string} message - Warning message
     */
    static showWarning(message) {
        console.log(`\x1b[33m⚠️ ${message}\x1b[0m`);
    }

    /**
     * Show configuration summary
     * @param {Object} config - Configuration object
     */
    static showConfig(config) {
        console.log('\n📋 Configuration Summary:');
        console.log(`📂 Combo file: ${config.comboPath}`);
        console.log(`🌐 Connection: Direct (no proxy)`);
        console.log(`💾 Output: ${config.outputDir || './results'}`);
    }
}

module.exports = Display;
