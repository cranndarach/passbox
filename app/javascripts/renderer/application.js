require('electron').ipcRenderer.on('loaded' , function(event, data) {
    let loginPrompt = `<div class="form-group">
    <label class="form-control">Welcome. Please enter your password:</label>
    <input class="form-control" type=password id="password" />
        &ensp;<button class="form-control" onclick=checkPassword("${data.pass}")>Submit</button><br />
        <span id="message"></span>
        </div>`;
    let newPassPrompt = `<div class="form-group">
    <label class="form-control">Welcome. Please set a password:</label>
        <input class="form-control" type="password" id="pass1" /><br />
        <input class="form-control" type="password" id="pass2" /><br />
        <button class="form-control" onclick=setPassword()>Submit</button><br />
        <span id="message"></span>
        </div>`;

    if (data.pass) {
        document.getElementById("details").innerHTML = loginPrompt;
    } else {
        document.getElementById("details").innerHTML = newPassPrompt;
    }
});
