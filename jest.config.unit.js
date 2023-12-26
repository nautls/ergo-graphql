const baseConfig = require('./jest.config');

module.exports = {
    ...baseConfig,
    setupFiles: ['<rootDir>/.jest/setEnvVars.ts'],
};
