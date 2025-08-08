// .eslintrc.js
// This file is a bridge to allow Next.js to use the ESLint flat config.
// It imports the flat config from eslint.config.mjs and exports it in CommonJS format.

const eslintConfig = require('./eslint.config.mjs');

module.exports = {
  // Assuming eslint.config.mjs exports an array of configurations
  // Next.js expects a single configuration object or an array.
  // If your eslint.config.mjs exports a default array, you can directly use it.
  // If not, you might need to adjust this based on the actual export of eslint.config.mjs
  ...eslintConfig,
};
