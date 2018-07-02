var express = require('express');
var bodyParser = require("body-parser");
var Aural = require('./src/aural.js');
var path = require('path');
var fs = require('fs');
var app = express('/');
var auth = require('./src/auth.js');

app.use(bodyParser.json());
app.use("/", express.static(path.join(__dirname, 'public/homepage')))
app.use("/shopping", express.static(path.join(__dirname, 'public')))
app.use("/send", express.static(path.join(__dirname, 'public')))

var listener = app.listen(8888, () => {
    console.log('app listening on port 8888!');
});

app.use(bodyParser.urlencoded({
    extended: false
}));

app.get('/post/send', function(req, res) {
    res.sendFile(path.join(__dirname, './public'))
});

app.get('/post', function(req, res) {
    var user_id = req.param('login');
    var token = req.param('passwd');
    var submit = req.param('submit')
    if (!auth.checkPasswd(user_id, token)) {
        res.sendFile(path.join(__dirname, './public/'))
    } else {
        auth.handleLogin({
            user_id,
            token,
            submit
        })
        res.sendFile(path.join(__dirname, './public/error/'))
    }
});

app.post('/post', function(req, res) {
    var user_id = req.param('login');
    var token = req.param('passwd');
    var submit = req.param('submit')
    auth.handleLogin({
        user_id,
        token,
        submit
    })
    res.sendFile(path.join(__dirname, './public/error/'))
});

app.post('/send', (req, res) => {
    res.sendFile(path.join(__dirname, './public/'))
})
// fs.readFile(, (err, data) => {
//     res.writeHead(200, {
//         'Content-Type': 'text/html'
//     });
//     res.write(data);
//     res.end();
// })
