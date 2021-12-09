const path = require('path');

module.exports = {
  resolve: {
    alias: {
      'uhandlers': path.resolve(__dirname, 'dist/esm/src/uhandler.js'),
    }
  }
};
