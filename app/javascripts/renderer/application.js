require('electron').ipcRenderer.on('loaded' , function(event, data) {
    let loginPrompt = `Welcome. Please enter your password: <input type=password id="password" />
        &ensp;<button onclick=checkPassword(${data.pass})>Submit</button><br />
        <span id="message"></span>`;
    let newPassPrompt = `Welcome. Please set a password:
        <input type="password" id="pass1" /><br />
        <input type="password" id="pass2" /><br />
        <button onclick=setPassword()>Submit</button><br />
        <span id="message"></span>`;

    if (data.pass) {
        document.getElementById("details").innerHTML = loginPrompt;
    } else {
        document.getElementById("details").innerHTML = newPassPrompt;
    }

  // document.getElementById('title').innerHTML = data.appName + ' App';
  // document.getElementById('details').innerHTML = 'built with Electron v' + data.electronVersion;
  // document.getElementById('versions').innerHTML = 'running on Node v' + data.nodeVersion + ' and Chromium v' + data.chromiumVersion;
});
