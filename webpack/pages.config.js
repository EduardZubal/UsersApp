const Path = require('path');

const pages = [
  {
    entryName: 'app',
    entryPath: 'index.js',
    title: 'UsersApp',
    template: Path.resolve(__dirname, '../src/index.ejs'),
    filename: 'index',
  },
];

module.exports = pages;
