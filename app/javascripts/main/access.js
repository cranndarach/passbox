// var jsonfile = require('jsonfile');
var fs = require('fs');
var path = require('path');
const {clipboard} = require('electron');
var crypto = require('crypto');

var algorithm = "aes-256-ctr";
var pData = "";

// encrypt() and decrypt() derived from examples on node-crypto-examples;
// The MIT License (MIT), Copyright (c) 2014-2015 Christoph Hartmann
// https://github.com/chris-rock/node-crypto-examples
function encrypt(text) {
    window.iv = crypto.pbkdf2(window.passIn, hashPass(), 10000, 512, 'sha512', (err, key) => {
        if (err) throw err;
        console.log(key.toString('hex'));
        return key.toString('hex');
    });
    let cipher = crypto.createCipheriv(algorithm, window.passIn, window.iv);
    let crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text) {
    let decipher = crypto.createDecipheriv(algorithm, window.passIn, window.iv);
    let dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

function load() {
    window.db = {};
    fs.readFile(path.join(__dirname, "..", "..", "/.pdb"), (err, data) => {
        if (err) {
            if (err.fileNotFound) {
                console.log("No database found. Will create one.");
            } else {
                throw err;
            }
        } else {
            let dbFile = decrypt(data);
            window.db = JSON.parse(dbFile);
        }
    });
}

function displayRetrieve() {
    load();
    let sites = Object.keys(window.db);
    let siteList = [];
    for (let i = 0; i < sites.length; i++) {
        let listOpt = `<option value="${sites[i]}">`;
        siteList.push(listOpt);
    }
    let listHTML = `<div id="site-list" class="form">
        <div class="form-group">
            <label>Select a site:</label>
            <input class="form-control" id="select-site" list="sites">
            <datalist id="sites">
            ${siteList}
            </datalist>
            <button class="form-control" onclick=retrieve("view")>View password</button>
            <button class="form-control" onclick=retrieve("clipboard")>Copy password to clipboard</button>
            </div>
        </div>
        <div id="retrieve-resp"></div>
        ${window.opt}`;
    document.getElementById("pane").innerHTML = listHTML;
}

function retrieve(style) {
    let site = document.getElementById("select-site").value;
    let pwd = window.db[site];
    switch (style) {
        case "view":
            document.getElementById("retrieve-resp").innerHTML = `<p>
                The password for ${site} is: ${pwd}
                </p>`;
            break;
        case "clipboard":
            clipboard.writeText(pwd);
            document.getElementById("retrieve-resp").innerHTML = `<p>
                The password for ${site} has been copied to your clipboard!
                </p>`;
            break;
        default:
            console.log("Unrecognized option.");
    }
}

function displayStore() {
    if (!window.db) {
        load();
    }
    let storeHTML = `<div class="form" id="store-pass">
        <div class="form-group">
            <label>Site label:</label>
            <input type="text" id="site-name" />
        </div>
        <div class="form-group">
            <label>Password:</label>
            <input type="text" id="password" />
            <label class="generate">Generate a password: (How many digits?)</label>
            <input class="generate" id="digits" type="number" value=32 min=8 max=100 />
            <button class="generate" onclick=generate()>Generate</button>
            <button id="hide" onclick=toggleHidePass()>Hide password</button>
        </div>
        <button class="form-control" onclick=store()>Save password</button>
        </div>
        <div id="store-resp"></div>
        ${window.opt}`
        document.getElementById("pane").innerHTML = storeHTML;
}

function store() {
    fs.writeFile(path.join(__dirname, "..", "..", "/.pdb-backup"), encrypt(window.db), (err) => {
        if (err) {
            throw err;
        } else {
            console.log("Backup saved.");
        }
    });
    let site = document.getElementById("site-name").value;
    let pwd = document.getElementById("password").value;
    window.db[site] = pwd;
    fs.writeFile(path.join(__dirname, "..", "..", "/.pdb"), encrypt(window.db), (err) => {
        if (err) {
            throw err;
        } else {
            console.log("New db saved.");
        }
    });
    document.getElementById("store-resp").innerHTML = `<p>Password for ${site} saved!</p>`;
}

function generate() {
    let passLen = document.getElementById("digits").value;
    let arr = new Uint32Array(16);
    let ranVals = window.crypto.getRandomValues(arr);
    let passLong = "";
    for (let i = 0; i < ranVals.length; i++) {
        passLong += ranVals[i].toString(36);
    }
    let pass = passLong.substr(1, passLen+1);
    document.getElementById("password").value = pass;
}

function toggleHidePass() {
    if (document.getElementById("password").type == "text") {
        document.getElementById("password").type = "password";
        document.getElementById("hide").innerHTML = "Show password";
    } else {
        document.getElementById("password").type = "text";
        document.getElementById("hide").innerHTML = "Hide password";
    }
}
