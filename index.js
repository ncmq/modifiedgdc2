const axios = require('axios');
const crypto = require('crypto');

const config = {
    username:   "flipper2001helloguyswhatisgoingontoday",   // Your gd username (CHANGE THIS!!!)
    accountID:  "69696969",  // Your gd account ID (CHANGE THIS!!)
    password:   "funny password",   // Your gd password
    percentage: "69",          // Percent
    secret:     "Wmfd2893gb7",  // Don't change if you don't know what it means (but you probably know if you found this file lmao)
    loopInterval: 16_000,       // Time to wait before each comment in milliseconds.
    commentList: [
        // put ur little comments here
    ]
}

// Skidded from GD BROWSER by Colon
class XOR {
    xor(str, key) { return String.fromCodePoint(...str.split('').map((char, i) => char.charCodeAt(0) ^ key.toString().charCodeAt(i % key.toString().length))) }
    encrypt(str, key = 37526) { return Buffer.from(this.xor(str, key)).toString('base64').replace(/./gs, c => ({'/': '_', '+': '-'}[c] || c)); }
    decrypt(str, key = 37526) { return this.xor(Buffer.from(str.replace(/./gs, c => ({'/': '_', '+': '-'}[c] || c)), 'base64').toString(), key) }
}
function sha1(data) { return crypto.createHash("sha1").update(data, "binary").digest("hex"); }
// -------------------------------

const gjp = new XOR().encrypt(config.password, 37526);

async function getLevel(){

    const gameInfoR = {

        "gameVersion": "21",
        "binaryVersion": "35",
        "gdw":"0",
        "inc": "0",
        "extras": "0",
        "secret": config.secret,
        "type": "4",
        "total": "9999",
        "str": ""
    
    }

    let idr = await axios.post('http://www.boomlings.com/database/getGJLevels21.php', new URLSearchParams(gameInfoR), {headers: {"Accept": null, "User-Agent": null, "Content-Type": "application/x-www-form-urlencoded"}});
    let id = idr.data.split(':')[1];

    console.log("Comment on: "+id);
    const randomIndex = Math.floor(Math.random() * config.commentList.length);
    const randomComment = config.commentList[randomIndex];
    comment(id, randomComment);
}

async function comment(lvlID, msg){

    msg = Buffer.from(msg).toString('base64');

    let form = {
        "gameVersion": "21",
        "binaryVersion": "35",
        "gdw": "0",
        "accountID": config.accountID,
        "gjp": gjp,
        "userName": config.username,
        "comment": msg,
        "secret": config.secret,
        "levelID": lvlID,
        "percent": config.percentage,
        "chk": chk(config.username, lvlID, msg, config.percentage)
    }

    try {
        let cr = await axios.post('http://www.boomlings.com/database/uploadGJComment21.php', new URLSearchParams(form), {headers: {"Accept": null, "User-Agent": null, "Content-Type": "application/x-www-form-urlencoded"}});

        if(Number.isNaN(parseInt(cr.data))) return console.log(`Unknown response (might be banned): ${cr.data}`);
        if(cr.data.startsWith("-1")) return console.log('Something went wrong. Make sure you entered the password and the other data correctly.');

        console.log('Success: '+cr.data);
    } catch (e) {
        console.log('Failed or ratelimited.');
    };
}

function chk(uname, id, comment, percent){

    let chk = uname + comment + id + percent + "0xPT6iUrtws0J"
    chk = sha1(chk)
    chk = new XOR().encrypt(chk, 29481)
    //console.log('CHK hash is: '+chk);
    return chk
};

getLevel();

setInterval(() => {
    getLevel();
}, config.loopInterval);

/* Made by a doxyf for the love of breaking the rules <3 */
/* Modified by ncmq */
