module.exports = {
    login: login,
    register: register,
    check: check,
    resetPassword: resetPassword,
    Reset: Reset
}

var jwt = require('jwt-simple');
var secret = "test123";
var db = require('./db.js');
var Mail = require('./email.js');

var users = [];

function* Reset() {
    var token = this.request.query.token;
    var data = JSON.parse(this.request.body);
    var succes = false;
    var response=false;
    if (data.newPass1 === data.newPass2) {
        try{
        var decoded = jwt.decode(token, secret);
        var currentDate = new Date();
        var TokenDate = new Date(decoded.expirationDate.toString());
        if (TokenDate > currentDate) {
            this.userName = decoded.userName;
            succes=true;
        }
        }
        catch(err){
            console.log("Decode failed");
        }
    }
    if (succes)
    {
        db.passwordReset(decoded.userName,data.newPass1);
        var expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 7);
        var response={};
        response.token=jwt.encode({ userName: decoded.userName, expirationDate: expirationDate }, secret);
        response.name=decoded.userName;
    }
    this.body = response;
}
function* resetPassword() {
    var email = this.request.query.email;
    var users = db.getAllUsers();
    var found = false;
    Object.keys(users).forEach(function (key) {
        if (users[key].email == email) {
            found = true;
            var expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 1);
            var Token = jwt.encode({ userName: key, expirationDate: expirationDate }, secret);
            var ResetPassword = {
                from: '"Echipa practică 👥" <admin@calendar.org>',
                to: email,
                subject: 'Hello ✔',
                //text: 'Acces this link to reset your password 🐴 \n http://localhost/#/login/' + Token, 
                html: 'Accesați link-ul pentru a vă reseta parola <a href="http://localhost/#/login/' + Token + '"> <strong> 🐒 resetare </strong></a>'
            };
            Mail.SendMail(ResetPassword);

        }
    });
    this.body = found;
}

function* check(next) {
    var headers = this.request.headers;
    if (headers)
        if (headers.token) {
            var decoded = jwt.decode(headers.token, secret);
            var currentDate = new Date();
            var TokenDate = new Date(decoded.expirationDate.toString());
            if (TokenDate > currentDate) {
                this.userName = decoded.userName;
            } else {
                console.warn('token expired');
            }
        }
    yield next;
}

function* login() {
    var user = this.request.query.user;
    user = user.split(".");
    var valid = false;
    var name = user[0];
    var password = user[1];
    var users = db.getAllUsers();
    if (users[name])
        if (users[name].password == password)
            valid = true;
    if (valid) {
        var expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 7);
        var response = jwt.encode({ userName: name, expirationDate: expirationDate }, secret);
        this.body = response;
    }
    else
        this.body = false;
}

function* register() {
    var data = this.request.query.newUser;
    var succes = false;
    var users = db.getAllUsers();
    data = data.split("/");
    if (data[1] == data[2])
        if (!users[data[0]])
            succes = true;
    Object.keys(users).forEach((user) => {
        if (users[user].email == data[3]) {
            succes = false;
        }
    });
    var name = data[0];
    var password = data[2];
    var email = data[3];
    if (succes) {
        var newUser = {};
        newUser[name] = {
            password: password,
            email: email,
            events: []
        }
        db.addNewUser(newUser);
    }
    this.body = succes;
}



