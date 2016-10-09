var fs = require('fs');
var path = require('path');
var jsSHA = require('jssha');

function checkPassword(pass) {
    let passIn = document.getElementById("password").value;
    let shaPass = new jsSHA("SHA-256", "TEXT");
    shaPass.update(passIn);
    let hashPass = shaPass.getHash("HEX");
    if (hashPass === pass) {
        document.getElementById("message").innerHTML = "Thank you!";
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
            document.getElementById("message").innerHTML = "Password set!";
        });
    } else {
        document.getElementById("message").innerHTML = "The passwords do not match.";
    }
}
