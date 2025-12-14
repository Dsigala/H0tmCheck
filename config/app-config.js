/**
 * Application Configuration
 * @author Dsigala
 * @version 1.0.0
 */
const config = {
    // Application info
    app: {
        name: 'H0tmCheck',
        version: '1.0.0',
        author: 'Dsigala',
        contributors: ['Not-ISellStuff'],
        description: 'Professional email verification tool'
    },

    // Default settings
    defaults: {
        timeout: 100000, // 100 seconds
        delay: 1000,     // 1 second between requests
        outputDir: './results',
        validFile: 'valid.txt'
    },

    // File paths
    paths: {
        lib: './lib',
        utils: './utils',
        config: './config',
        src: './src'
    },

    // Supported providers
    providers: {
        microsoft: {
            enabled: true,
            name: 'Microsoft',
            library: 'microsoft-auth'
        }
        // Future providers can be added here
        // gmail: {
        //     enabled: false,
        //     name: 'Gmail',
        //     library: 'gmail-auth'
        // }
    },

    // Result categories
    resultTypes: {
        ok: { 
            name: 'Valid', 
            emoji: '✅', 
            color: '\x1b[32m',
            save: true 
        },
        fail: { 
            name: 'Invalid', 
            emoji: '❌', 
            color: '\x1b[31m',
            save: false 
        },
        custom: { 
            name: 'Custom', 
            emoji: '🔒', 
            color: '\x1b[33m',
            save: true 
        },
        nfa: { 
            name: 'NFA', 
            emoji: '📧', 
            color: '\x1b[36m',
            save: true 
        },
        retry: { 
            name: 'Retry', 
            emoji: '🔄', 
            color: '\x1b[31m',
            save: false 
        }
    },

    // Performance settings
    performance: {
        maxConcurrency: 1,  // Sequential processing for now
        retryAttempts: 3,
        rateLimitDelay: 1000
    }
};

module.exports = config;
