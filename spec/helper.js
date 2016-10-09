var path = require('path');

module.exports = {
  appPath: function() {
    switch (process.platform) {
      case 'darwin':
        return path.join(__dirname, '..', '.tmp', 'Passbox-darwin-x64', 'Passbox.app', 'Contents', 'MacOS', 'Passbox');
      case 'linux':
        return path.join(__dirname, '..', '.tmp', 'Passbox-linux-x64', 'Passbox');
      default:
        throw 'Unsupported platform';
    }
  }
};
