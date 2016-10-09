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

  window.webContents.on('did-finish-load', () => {
    let passpath = path.join(__dirname, "..", "..", "/.boxpasswd");

    // let loginPrompt = `Welcome. Please enter your password: <input type=password id="password" />
    //     &ensp;<button onclick=checkPassword()>Submit</button><br />
    //     <span id="message"></span>`;
    // let newPassPrompt = `Welcome. Please set a password:
    //     <input type="password" id="pass1" /><br />
    //     <input type="password" id="pass2" /><br />
    //     <button onclick=setPassword()>Submit</button><br />
    //     <span id="message"></span>`;
    //
    // function checkPassword() {
    //     let passIn = document.getElementById("password").value;
    //     let shaPass = new jsSHA("SHA-256", "TEXT");
    //     shaPass.update(passIn);
    //     let hashPass = shaPass.getHash("HEX");
    //     if (hashPass === data.pass) {
    //         document.getElementById("message").innerHTML = "Thank you!";
    //     } else {
    //         document.getElementById("message").innerHTML = "Incorrect password.";
    //     }
    // }
    //
    // function setPassword() {
    //     if (document.getElementById("pass1").value === document.getElementById("pass2").value) {
    //         let passIn = document.getElementById("pass1").value;
    //         let shaPass = new jsSHA("SHA-256", "TEXT");
    //         shaPass.update(passIn);
    //         let hashPass = shaPass.getHash("HEX");
    //         fs.writeFile(path.join(__dirname, "/.boxpasswd"), hashPass, (err) => {
    //             if(err) {
    //                 throw err;
    //             }
    //             document.getElementById("message").innerHTML = "Password set!";
    //         });
    //     } else {
    //         document.getElementById("message").innerHTML = "The passwords do not match.";
    //     }
    // }

    // let sendData = {};
    fs.readFile(passpath, (err, data) => {
      if (err) {
          window.pass = false;
        //   document.getElementById("details").innerHTML = newPassPrompt;
        // //   if (err === "ENOENT") {
        //     window.pass = false;
        // //   } else {
        //     //   throw err;
        // //  }
      } else {
          window.pass = data;
        // document.getElementById("details").innerHTML = loginPrompt;
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
