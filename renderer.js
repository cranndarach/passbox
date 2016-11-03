// var path = require('path');
var login = require(__dirname + '/lib/login.js');
var access = require(__dirname + '/lib/access.js');

require('electron').ipcRenderer.on('loaded' , function(event, data) {
    window.loginPrompt = `<div class="form">
        <div class="form-group">
        <label>Please enter your password:</label>
        <input class="form-control" type=password id="password" />
        </div>
        <button class="form-control" onclick=login.checkPassword("${data.pass}")>Submit</button><br />
        <span id="message"></span>
        </div>`;
    window.newPassPrompt = `<div class="form">
        <div class="form-group">
        <label>Welcome. Please set a password:</label>
        <input class="form-control" type="password" id="pass1" /><br />
        </div>
        <div class="form-group">
        <input class="form-control" type="password" id="pass2" /><br />
        </div>
        <button class="form-control" onclick=login.setPassword()>Submit</button><br />
        <span id="message"></span>
        </div>`;
    window.opt = `<div id="options" class="form options">
        <table>
            <tr>
                <td class="option-btn">
                    <button class="btn btn-large btn-positive form-control"
                    onclick=access.displayRetrieve()>Retrieve a password</button>
                </td>
                <td class="option-btn">
                    <button class="btn btn-large btn-positive form-control" onclick=access.displayStore()>Add a password to the database</button>
                </td>
            </tr>
        </table>
        </div>`

    if (data.pass) {
        document.getElementById("pane").innerHTML = loginPrompt;
    } else {
        document.getElementById("pane").innerHTML = newPassPrompt;
    }
});
