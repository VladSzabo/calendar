module.exports = {
    addEvent: addEvent,
    saveEvent: saveEvent,
    deleteEvent: deleteEvent,
    getEvents: getEvents,
    getAllEvents: getAllEvents,
    getAllGuests: getAllGuests,
    getAllUsers: getAllUsers,
    addNewUser: addNewUser,
    passwordReset: passwordReset,
    changeTheme: changeTheme,
    getTheme: getTheme,
    eventConfirm: eventConfirm
};
var email = require('./email');
var fs = require('fs');
var db = fs.readFileSync('db.json', { encoding: 'utf8' });
db = JSON.parse(db || '{}');

function* getAllEvents() {
    var date = this.request.query.date;
    var user = this.userName;
    var events = [];
    if (db[user] && db[user].events) {
        db[user].events.forEach((event) => {
            if (event.day.substr(0, 7) === date) {
                events.push(event);
            }
        });
    }
    this.body = events;
}
function* getEvents() {
    var day = this.request.query.day;
    var user = this.userName;
    var events = [];
    if (db[user] && db[user].events)
        db[user].events.forEach((event) => {
            if (event.day === day)
                events.push(event);
        });
    this.body = events;
}
function* saveEvent() {
    var post = JSON.parse(this.request.body);
    var index = post.index;
    var event = post.event;
    var user = this.userName;
    var position = 0;
    if (db[user] && db[user].events) {
        for (i = 0; i < db[user].events.length; i++)
            if (db[user].events[i].day == event.day) {
                if (position == index) {
                    db[user].events[i] = event;
                    db[user].events[i].isEditing = false;
                    saveDb();
                    index = db[user].events.indexOf(db[user].events[i]);
                    break;
                }
                else
                    position++;
            }
        // send mail notification
        var params = 'user=' + user + '&index=' + index;
        var link = 'http://' + this.host + '/eventConfirm?' + params;
        var mailContent = fs.readFileSync('email-template.html');
        mailContent = mailContent.toString();
        mailContent = mailContent.replace('@userName', user).replace('@eventName', event.title);
        event.guests.forEach((guest) => {
            if (guest.status == 'fa-hourglass') {
                var html = mailContent.replace('@yes', link + '&guest=' + guest.name + '&status=' + encodeURIComponent('fa-check text-success')).replace('@no', link + '&guest=' + guest.name + '&status=' + encodeURIComponent('fa-ban text-danger'));
                fs.writeFile(db[guest.name].email + '.html');
                email.SendMail({
                    from: '"Echipa practică 👥" <admin@calendar.org>',
                    to: db[guest.name].email,
                    subject: 'Invitatie ✔',
                    html: html
                });
            }
        });
    }
    this.body = 'OK';
}
function* eventConfirm() {
    var user = this.request.query.user
        , index = this.request.query.index
        , guest = this.request.query.guest
        , status = this.request.query.status;
    db[user].events[index].guests.forEach(function (item) {
        if (guest == item.name) item.status = status;
    });
    this.set('Content-Type', 'text/html');
    this.body = 'S-a intamplat o catastrofa, nu te ingrijora!<p> <a href="http://' + this.host + '">Vezi catastrofa</a></p>';
}
function* addEvent() {
    var event = JSON.parse(this.request.body);
    var user = this.userName;
    //alert if event already in list
    db[user] = db[user] || { events: [] };
    db[user].events.push(event);
    saveDb();
    this.body = 'OK';
}
function* deleteEvent() {
    var user = this.userName;
    var index = JSON.parse(this.request.body).index;
    var day = JSON.parse(this.request.body).day;
    var position = 0;
    if (db[user] && db[user].events) {
        for (i = 0; i < db[user].events.length; i++)
            if (db[user].events[i].day == day) {
                if (position == index) {
                    db[user].events.splice(i, 1);
                    saveDb();
                    break;
                }
                else
                    position++;
            }
    }
    this.body = 'OK';
}
function* getAllGuests() {
    var guests = [];
    guests = db;
    this.body = Object.keys(guests);
}
function getAllUsers() {
    var users = [];
    var keys = Object.keys(db);
    keys.forEach((item) => {
        users[item] = {
            password: db[item].password,
            email: db[item].email
        }
    });
    return users;
}
function addNewUser(user) {
    var name = Object.keys(user);
    db[name] = user[name];
    saveDb();
}
function passwordReset(user, newPassword) {
    db[user].password = newPassword;
    saveDb();
}
function saveDb() {
    fs.writeFile('db.json', JSON.stringify(db), { encoding: 'utf8' });
}

function* changeTheme() {
    var theme = JSON.parse(this.request.body).theme;
    var user = this.userName;

    if (db[user]) {
        db[user].theme = theme;
        saveDb();
    }

    this.body = 'OK';
}
function* getTheme() {
    var theme;
    var user = this.userName;

    if (db[user] && db[user].theme)
        theme = db[user].theme;

    this.body = theme;
}