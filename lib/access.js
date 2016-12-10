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
exports.encrypt = function(encryptor, key) {
    // if (!window.encryptor) {
        // window.encryptor = exports.makeEncryptor(window.passIn);
    // }
    let encrypted = encryptor.encrypt(key);
    return encrypted;
}
exports.decrypt = function(encryptor, data) {
    // This will need to be reworked with salts
    // if (!window.encryptor) {
        // window.encryptor = exports.makeEncryptor(window.passIn);
    // }
    let decrypted = encryptor.decrypt(data);
    // console.log(decrypted);
    return decrypted;
}
exports.load = function() {
    // This will also have to be reworked
    try {
        let passpath = path.join(__dirname, "..", ".pwdb");
        // console.log(`pass path: ${passpath}`);
        let dbDecryptor = exports.makeEncryptor(window.passIn);
        let enc = fs.readFileSync(passpath, 'utf8');
        let db = exports.decrypt(dbDecryptor, enc);
        // fs.writeFile(path.join(__dirname, "..", ".decrypted"), db, (err) => {
            // if (err) {
        //         console.log(err.stack);
        //     } else {
        //         console.log("Saved decrypted db.");
        //     }
        // });
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
    // Okay so how am I going to acces my passwords that have not been salted 
    // or re-encrypted like this? Add a try...catch and if it can't find the 
    // salt, revert to prev method, but re-store in the new format? Or maybe 
    // better off just writing a separate script to reformat the db all at once?
    let entryName = document.getElementById("select-site").value;
    let entry = window.db[entryName];
    let salt = entry["salt"];
    let key = window.passIn+salt;
    let passDecryptor = exports.makeEncryptor(key);
    let pwd = exports.decrypt(passDecryptor, entry["password"]);
    switch (style) {
        case "view":
            document.getElementById("retrieve-resp").innerHTML = `<p>
                The password for ${entryName} is: ${pwd}
                </p>`;
            break;
        case "clipboard":
            clipboard.writeText(pwd);
            document.getElementById("retrieve-resp").innerHTML = `<p>
                The password for ${entryName} has been copied to your clipboard!
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
            <input class="form-control" type="text" id="entry-name" />
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
            <button class="form-control btn" onclick='document.getElementById("password").value=access.generate();'>Generate</button>
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
    let dbEncryptor = exports.makeEncryptor(window.passIn);
    fs.writeFile(path.join(__dirname, "..", ".pwdb-backup"), exports.encrypt(dbEncryptor, JSON.stringify(window.db)), (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Backup saved.");
            let entryName = document.getElementById("entry-name").value;
            let val = document.getElementById("password").value;
            let salt = exports.generate();
            let key = window.passIn+salt; // double-check
            let passEncryptor = exports.makeEncryptor(key);
            let encryptedPass = exports.encrypt(passEncryptor, val); // could rework this to work like an object
            if (arrMember.objectKey(entryName, window.db)) {
                let overwrite = confirm(`There is already an entry for ${entryName}.
                Press "OK" to overwrite it, or "Cancel" to go back.`);
                if(overwrite == false) {
                    document.getElementById("store-resp").innerHTML = `<p>Password for ${entryName} not changed.</p>`
                    return;
                }
            }
            window.db[entryName] = {
                salt: salt,
                password: encryptedPass
            };
            fs.writeFile(path.join(__dirname, "..", ".pwdb"), exports.encrypt(dbEncryptor, JSON.stringify(window.db)), (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("New db saved.");
                    document.getElementById("store-resp").innerHTML = `<p>Password for ${entryName} saved!</p>`;
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
    // document.getElementById("password").value = pass;
    return pass;
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
