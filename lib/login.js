var fs = require('fs');
var path = require('path');
var jsSHA = require('jssha');

function checkPassword(pass) {
    window.passIn =  document.getElementById("password").value;
    let hashedPass = hashPass();
    if (hashedPass === pass) {
        document.getElementById("pane").innerHTML = window.opt;
    } else {
        document.getElementById("message").innerHTML = "Incorrect password.";
    }
}

function setPassword() {
    if (document.getElementById("pass1").value === document.getElementById("pass2").value) {
        let passIn = document.getElementById("pass1").value;
        let shaPass = new jsSHA("SHA-256", "TEXT");
        shaPass.update(passIn);
        let hashPass = shaPass.getHash("HEX");
        fs.writeFile(path.join(__dirname, "/.boxpasswd"), hashPass, (err) => {
            if(err) {
                throw err;
            }
            document.getElementById("pane").innerHTML = `<p>Password set! Please log in.</p>
                ${window.loginPrompt};`;
        });
    } else {
        document.getElementById("message").innerHTML = "The passwords do not match.";
    }
}

function hashPass() {
    let shaPass = new jsSHA("SHA-256", "TEXT");
    shaPass.update(window.passIn);
    let hshPass = shaPass.getHash("HEX");
    return hshPass;
}
