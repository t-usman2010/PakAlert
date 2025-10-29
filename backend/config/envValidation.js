// config/envValidation.js
const requiredEnvVars = [
    'PORT',
    'MONGO_URI',
    'SESSION_SECRET',
    'OPENWEATHER_KEY',
    'ADMIN_USER',
    'ADMIN_PASS'
];

function validateEnv() {
    const missingVars = [];
    
    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            missingVars.push(envVar);
        }
    }
    
    if (missingVars.length > 0) {
        console.error('❌ Missing required environment variables:');
        missingVars.forEach(variable => {
            console.error(`   - ${variable}`);
        });
        console.error('\nPlease set these variables in your .env file');
        process.exit(1);
    }
    
    console.log('✅ All required environment variables are set');
}

module.exports = validateEnv;