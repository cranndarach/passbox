var fs = require('fs');
var path = require('path');
var jsSHA = require('jssha');

var exports = module.exports = {};

exports.checkPassword = function() {
    fs.readFile(__dirname + "/.boxpasswd", (err, passwd) => {
        if (err) {
            // console.log(err.stack);
            throw err;
        }
        window.passIn =  document.getElementById("password").value;
        let hashedPass = exports.hashPass();
        if (hashedPass == passwd) {
            document.getElementById("pane").innerHTML = window.opt;
        } else {
            document.getElementById("message").innerHTML = "Incorrect password.";
        }
    });
};
exports.setPassword = function() {
    if (document.getElementById("pass1").value === document.getElementById("pass2").value) {
        let passIn = document.getElementById("pass1").value;
        let shaPass = new jsSHA("SHA-256", "TEXT");
        shaPass.update(passIn);
        let hashPass = shaPass.getHash("HEX");
        let passPath = path.join(__dirname, "..", ".boxpasswd")
        fs.writeFile(passPath, hashPass, (err) => {
            if (err) {
                throw err;
            } else {
                document.getElementById("pane").innerHTML = `<p>Password set! Please log in.</p>
                    ${window.loginPrompt};`;
            }
        });
    } else {
        document.getElementById("message").innerHTML = "The passwords do not match.";
    }
};
exports.hashPass = function() {
    let shaPass = new jsSHA("SHA-256", "TEXT");
    shaPass.update(window.passIn);
    let hshPass = shaPass.getHash("HEX");
    return hshPass;
};
