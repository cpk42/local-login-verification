var bodyParser = require("body-parser");
var Aural = require('./aural.js')
var fs = require('fs');
var serialize = require('node-serialize');
var crypto = require("crypto"),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';
var firstExec = true;
var exports = module.exports = {};

const db = new Aural("passwd", "./private/passwd/passwd.json", {
    login: {},
    passwd: {}
})

checkLogin = (login, passwd) => {
    data = db.getAll().entries
    for (var name in data) {
        if (data[name].login != serialize.serialize(login))
            continue;
        else {
            console.log("Error");
            return false
        }
    }
    return true
}

encrypt = (text) => {
    var cipher = crypto.createCipher(algorithm, password)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

decrypt = (text) => {
    var decipher = crypto.createDecipher(algorithm, password)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}

module.exports = {
    handleLogin: (query) => {
        if (firstExec == true) {
            firstExec = false
            if (!fs.existsSync('./private')) {
                fs.mkdirSync('./private');
            }
            if (!fs.existsSync('./private/passwd')) {
                fs.mkdirSync('./private/passwd');
            }
            db.init()
        }
        if (query['user_id'] && query['token']) {
            if (checkLogin(query['user_id'], query['token'])) {
                var login = serialize.serialize(query['user_id']),
                    passwd = encrypt(query['token'])
                db.addEntry({
                    login,
                    passwd
                })
                console.log('OK');
                return ('OK')
            }
        }
    },
    checkLogin: (login, passwd) => {
        data = db.getAll().entries
        for (var name in data) {
            if (data[name].login != serialize.serialize(login))
                continue;
            else {
                console.log("Error");
                return false
            }
        }
        return true
    },
    checkPasswd: (login, passwd) => {
        data = db.getAll().entries
        if (passwd && login) {
            for (var name in data) {
                if (data[name].login == serialize.serialize(login) && data[name].passwd == encrypt(passwd)) {
                    return true;
                } else {
                    console.log('OK');
                    continue;
                }
            }
        }
        console.log('ERROR');
        return false
    }
}
