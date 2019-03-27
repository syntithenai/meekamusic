const express = require('express');
const bodyParser= require('body-parser')
const cookieParser = require('cookie-parser');
var session = require('express-session')
let config = require('./config');
global.gConfig = config;
const proxy = require('http-proxy-middleware')
const path = require('path');
const fs = require('fs'),
    http = require('http'),
    https = require('https')
//const passport = require("passport");

let app = express();
var flash = require('connect-flash');
var meekaRoutes = require('./server');
var authenticate = require('react-express-oauth-login-system/authenticate');
//var authenticate = require('../authenticate');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.all('*', function (req, res, next) {
  console.log(['SERVER REQUEST',req.url,req.query,req.body])
  next() // pass control to the next handler
});

//app.use(flash());
//app.use(session({ secret: 'board GOAT' , cookie: { secure: true }}));
//app.use(passport.initialize());
//app.use(passport.session());

process.on('unhandledRejection', (reason, p) => {
    console.log("Unhandled Rejection at: Promise ", p, " reason: ", reason);
    // application specific logging, throwing an error, or other logic here
});

var router = express.Router();

// ENDPOINTS
// login system
var loginRouter = require('react-express-oauth-login-system/routes/loginsystem.js');
//var loginRouter = require('../routes/loginsystem.js');

//console.log(['INIT EXAMPLE login router',loginRouter])
router.use('/api/login',loginRouter);

router.use('/api/meeka',meekaRoutes);

app.use(router);
// Development, proxy to local create-react-app
app.use('/', proxy({ target: config.reactServer }))
// production - Serve the static files from the React app
//app.use(express.static(path.join(__dirname, 'client/build')));


// SSL
// allow self generated certs
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var options = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./certificate.pem'),
};
let port='443'
var webServer = https.createServer(options, app).listen(port, function(){
  console.log("Express server listening on port " + port);
});
webServer.setTimeout(2000);
