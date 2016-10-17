var electron, path, pkg, fs, jsf;

path = require('path');
pkg = require('../../package.json');
fs = require('fs');
jsf = require('jsonfile');

electron = require('electron');

electron.app.on('ready', () => {
  var window;

  window = new electron.BrowserWindow({
    title: pkg.name,
    width: pkg.settings.width,
    height: pkg.settings.height
  });

  window.loadURL('file://' + path.join(__dirname, '..', '..') + '/index.html');
  // window.openDevTools();

  window.webContents.on('did-finish-load', () => {
    let passpath = path.join(__dirname, "..", "..", "/.boxpasswd");
    fs.readFile(passpath, (err, data) => {
      if (err) {
          window.pass = false;
      } else {
          window.pass = data;
      }
      window.webContents.send('loaded', {
          pass: window.pass
      });
    });
  });

  window.on('closed', function() {
    window = null;
  });

});
