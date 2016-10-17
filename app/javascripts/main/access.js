var fs = require('fs');
var path = require('path');
var jssha = require('jssha');
var arrMember = require('array-member');
const {clipboard} = require('electron');

function makeEncryptor(pass) {
    let shaPass = new jsSHA("SHA-512", "TEXT");
    shaPass.update(pass);
    let key = shaPass.getHash("HEX");
    let encryptor = require('simple-encryptor')(key);
    return encryptor;
}

function encrypt(text) {
    if (!window.encryptor) {
        window.encryptor = makeEncryptor(window.passIn);
    }
    let encrypted = window.encryptor.encrypt(text);
    return encrypted;
}

function decrypt(text) {
    if (!window.encryptor) {
        window.encryptor = makeEncryptor(window.passIn);
    }
    let decrypted = window.encryptor.decrypt(text);
    console.log(decrypted);
    return decrypted;
}

function load() {
    try {
        let enc = fs.readFileSync(path.join(process.cwd(), "/.pwdb"), 'utf8');
        let db = decrypt(enc);
        window.db = JSON.parse(db);
    } catch (err) {
        console.log(err);
        console.log("No database found. Will create one.");
        window.db = {};
    }
}

function displayRetrieve() {
    load();
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
                <button class="form-control btn btn-form btn-positive" onclick=retrieve("view")>View password</button>
                <button class="form-control btn btn-form btn-primary" onclick=retrieve("clipboard")>Copy password to clipboard</button>
            </div>
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
        <div class="form-actions">
        <button class="form-control btn btn-form btn-primary" onclick=store()>Save password</button>
        </div>
        </div>
        <div id="store-resp"></div>
        ${window.opt}`
        document.getElementById("pane").innerHTML = storeHTML;
}

function store() {
    fs.writeFile(path.join(process.cwd(), "/.pwdb-backup"), encrypt(JSON.stringify(window.db)), (err) => {
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
            fs.writeFile(path.join(process.cwd(), "/.pwdb"), encrypt(JSON.stringify(window.db)), (err) => {
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

function generate() {
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

function toggleHidePass() {
    if (document.getElementById("password").type == "text") {
        document.getElementById("password").type = "password";
        document.getElementById("hide").innerHTML = "Show password";
    } else {
        document.getElementById("password").type = "text";
        document.getElementById("hide").innerHTML = "Hide password";
    }
}
