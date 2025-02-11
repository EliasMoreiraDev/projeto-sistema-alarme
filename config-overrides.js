const path = require('path');

module.exports = function override(config, env) {
  // Adiciona fallbacks para módulos Node.js
  config.resolve.fallback = {
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "stream": require.resolve("stream-browserify"),
    "util": require.resolve("util/"),
    "zlib": require.resolve("browserify-zlib")
  };

  return config;
};
