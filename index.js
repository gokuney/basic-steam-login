/*----------  Add Deps  ----------*/

var express = require('express'),
    steam   = require('steam-login'),
    session = require('express-session');


/*----------  Initiate Application  ----------*/

var app = express();

app.set('trust proxy', 1)

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {
        secure: false,
        maxAge: 864000000 
    }
}))

/*----------  Define Middleware for Steam  ----------*/

 
app.use(require('express-session')({ resave: false, saveUninitialized: false, secret: 'a secret' }));
app.use(steam.middleware({
    realm: 'http://localhost:3000/', 
    verify: 'http://localhost:3000/verify',
    apiKey: 'CD73BD6C725D7D67BE584BE454380C11'}
));
 


/*----------  Define Routes  ----------*/


app.get('/', function(req, res) {
    if( req.user ){
    res.send(req.user).end();
    }else{
    	res.send('<a href="/authenticate">Steam Login</a>').end();
    }
});
 
app.get('/authenticate', steam.authenticate(), function(req, res) {
    res.redirect('/');
});
 
app.get('/verify', steam.verify(), function(req, res) {
    //add user to session
	req.session.user = req.user;
    res.send(req.user).end();
});
app.get('/logout', steam.enforceLogin('/'), function(req, res) {
    req.logout();
    //Double check 
    req.session.user = null;//add try-catch if fails 
    res.redirect('/');
});
 

/*----------  Make App Listen  ----------*/


app.listen(3000);
console.log('listening at port 3000');