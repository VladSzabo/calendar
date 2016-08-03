var koa = require('koa');
var serve = require('koa-static');
var requests = require('./serverScript');
var db = require('./db');
var router = require('koa-router')();
var koaBody = require('koa-body')();
var jwt = require('jwt-simple');

var app = koa();
app.use(serve('./public'));

app.use(requests.check);

router.get('/login', requests.login);
router.get('/resetPassword', requests.resetPassword);
router.get('/eventConfirm', db.eventConfirm);
router.get('/getEvents', db.getEvents);
router.get('/getAllGuests', db.getAllGuests);
router.get('/getAllEvents', db.getAllEvents);
router.get('/getTheme', db.getTheme);
router.post('/addEvent', koaBody, db.addEvent);
router.post('/saveEvent', koaBody, db.saveEvent);
router.post('/deleteEvent', koaBody, db.deleteEvent);
router.post('/resetPassword', koaBody, requests.resetPassword);
router.post('/Reset', koaBody, requests.Reset);
router.post('/changeTheme', koaBody, db.changeTheme);

router.post('/register', koaBody, requests.register);

app
  .use(router.routes())
  .use(router.allowedMethods());


app.listen(80);