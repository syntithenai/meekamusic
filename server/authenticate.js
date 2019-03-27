// COULD ALSO USE PASSPORT
//```npm install passport-http-bearer```
//Configuration

//```

let config = require('./config');
	
//const oauthMiddlewares = require('./oauth/oauthServerMiddlewares');
const database = require('react-express-oauth-login-system/oauth/database');
database.connect(config.databaseConnection+config.database);



passport.use(new BearerStrategy(
  function(token, done) {
    database.User.findOne({ token: token }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      return done(null, user, { scope: 'read' });
    });
  }
));

//```

//Protect Endpoints
//```
//app.get('/api/me',
  //passport.authenticate('bearer', { session: false }),
  //function(req, res) {
    //res.json(req.user);
  //});
//```

module.exports =  oauthMiddlewares.authenticate;
