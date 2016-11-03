var fs = require('fs');
var path = require('path');
var jsSHA = require('jssha');
var arrMember = require('array-member');
const {clipboard} = require('electron');

var exports = module.exports = {};

exports.makeEncryptor = function(pass) {
    let shaPass = new jsSHA("SHA-512", "TEXT");
    shaPass.update(pass);
    let key = shaPass.getHash("HEX");
    let encryptor = require('simple-encryptor')(key);
    return encryptor;
}
exports.encrypt = function(text) {
    if (!window.encryptor) {
        window.encryptor = exports.makeEncryptor(window.passIn);
    }
    let encrypted = window.encryptor.encrypt(text);
    return encrypted;
}
exports.decrypt = function(text) {
    if (!window.encryptor) {
        window.encryptor = exports.makeEncryptor(window.passIn);
    }
    let decrypted = window.encryptor.decrypt(text);
    // console.log(decrypted);
    return decrypted
}
exports.load = function() {
    try {
        let passpath = path.join(__dirname, "..", ".pwdb");
        console.log(`pass path: ${passpath}`);
        let enc = fs.readFileSync(passpath, 'utf8');
        let db = exports.decrypt(enc);
        window.db = JSON.parse(db);
    } catch (err) {
        console.log(err.stack);
        console.log("No database found. Will create one.");
        window.db = {};
    }
}

exports.displayRetrieve = function() {
    exports.load();
    let sites = Object.keys(window.db);
    console.log(`sites: ${sites}`);
    let siteList = [];
    for (let i = 0; i < sites.length; i++) {
        let listOpt = `<option value="${sites[i]}">${sites[i]}</option>`;
        siteList.push(listOpt);
    }
    let siteListHTML = siteList.join("");
    let listHTML = `<div id="site-list" class="form">
        <div class="form-group">
            <label>Select a site:</label>
            <!--input type="text" list="sites" class="form-control" id="select-site" autocomplete="on" /-->
            <!--datalist id="sites"-->
            <select id="select-site" class="form-control">
            ${siteListHTML}
            </select>
            <!--/datalist-->
            <div class="form-actions">
                <button class="form-control btn btn-form btn-primary" onclick=access.retrieve("view")>View password</button>
                <button class="form-control btn btn-form btn-primary" onclick=access.retrieve("clipboard")>Copy password to clipboard</button>
            </div>
        </div>
        </div>
        <div id="retrieve-resp"></div>
        ${window.opt}`;
    document.getElementById("pane").innerHTML = listHTML;
}

exports.retrieve = function(style) {
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

exports.displayStore = function() {
    document.getElementById("nav-store").class = "nav-group-item active";
    document.getElementById("nav-retrieve").class = "nav-group-item";
    if (!window.db) {
        exports.load();
    }
    let storeHTML = `<div class="form" id="store-pass">
        <div class="form-group">
            <label>Site label:</label>
            <input class="form-control" type="text" id="site-name" />
        </div>
        <div class="form-group">
        <label>Password:</label>
        <input class="form-control" type="text" id="password" />
        </div>
        <div class="form-group">
        <div class="inline-group">
            <label>Generate a password with</label>
            <input class="form-control" id="digits" type="number" value=16 min=8 max=100 />
            <label>characters.</label>
            <button class="form-control btn" onclick=access.generate()>Generate</button>
        </div>
        </div>
        <div class="form-actions">
        <button class="form-control btn" id="hide" onclick=access.toggleHidePass()>Hide password</button>
        <button class="form-control btn btn-form btn-primary" onclick=access.store()>Save password</button>
        </div>
        </div>
        <div id="store-resp"></div>
        ${window.opt}`
        document.getElementById("pane").innerHTML = storeHTML;
}

exports.store = function() {
    fs.writeFile(path.join(__dirname, "..", ".pwdb-backup"), exports.encrypt(JSON.stringify(window.db)), (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Backup saved.");
            let site = document.getElementById("site-name").value;
            let pwd = document.getElementById("password").value;
            if (arrMember.objectKey(site, window.db)) {
                let overwrite = confirm(`There is already an entry for ${site}.
                Press "OK" to overwrite it, or "Cancel" to go back.` );
                if(overwrite == false) {
                    document.getElementById("store-resp").innerHTML = `<p>Password for ${site} not changed.</p>`
                    return;
                }
            }
            window.db[site] = pwd;
            fs.writeFile(path.join(__dirname, "..", ".pwdb"), exports.encrypt(JSON.stringify(window.db)), (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("New db saved.");
                    document.getElementById("store-resp").innerHTML = `<p>Password for ${site} saved!</p>`;
                }
            });
        }
    });
}

exports.generate = function() {
    let passLen = document.getElementById("digits").value;
    let arr = new Uint32Array(16);
    let ranVals = window.crypto.getRandomValues(arr);
    let passLong = "";
    for (let i = 0; i < ranVals.length; i++) {
        passLong += ranVals[i].toString(36);
    }
    let pass = passLong.substring(0, passLen);
    document.getElementById("password").value = pass;
}

exports.toggleHidePass = function() {
    if (document.getElementById("password").type == "text") {
        document.getElementById("password").type = "password";
        document.getElementById("hide").innerHTML = "Show password";
    } else {
        document.getElementById("password").type = "text";
        document.getElementById("hide").innerHTML = "Hide password";
    }
}
