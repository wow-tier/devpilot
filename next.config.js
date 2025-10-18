/** @type {import('next').NextConfig} */

require('dotenv').config();

const nextConfig = {
  webpack: (config) => {
    // Exclude user-repos directory from webpack compilation
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/user-repos/**', '**/node_modules/**'],
    };
    return config;
  },
  // Exclude user-repos from TypeScript compilation
  typescript: {
    ignoreBuildErrors: false,
  },
  // Exclude user-repos from linting
  eslint: {
    dirs: ['src'],
  },
};

module.exports = nextConfig;
