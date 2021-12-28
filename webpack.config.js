const path = require('path');

module.exports = {
  entry: './dist/src/unremarkable.js',
  output: {
    filename: 'unremarkable.js',
    path: path.resolve(__dirname, 'public/js'),
  },
};