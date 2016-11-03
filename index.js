var electron, path, pkg, fs, jsonfile, git;

electron = require('electron');
path = require('path');
// pkg = require('./package.json');
fs = require('fs');
jsonfile = require('jsonfile');
git = require('simple-git');

electron.app.on('ready', () => {
  var window;

  window = new electron.BrowserWindow({
    title: "PassBox"
  });
  window.maximize();
  window.openDevTools();

  window.loadURL('file://' + path.join(__dirname) + '/index.html');

  window.webContents.on('did-finish-load', () => {
    let passpath = path.join(__dirname, ".boxpasswd");
    console.log(passpath);
    fs.readFile(passpath, (err, data) => {
      if (err) {
          console.log(err.stack);
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
