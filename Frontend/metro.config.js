const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Fix: Force Metro to use CJS version of zustand instead of ESM
// The ESM version uses `import.meta` which causes SyntaxError on Expo Web
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
