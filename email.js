module.exports = {
    SendMail: SendMail

};

var nodemailer = require('nodemailer');

var user = 'emailcalendar1%40gmail.com';
var pass = 'calendar1'
var transporter = nodemailer.createTransport('smtps://' + user + ':' + pass + '@smtp.gmail.com');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

function SendMail(Message) {
    transporter.sendMail(Message, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}
