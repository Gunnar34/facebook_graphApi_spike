var express = require( 'express' );
var app = express();
var path = require( 'path' );
var bodyParser = require( 'body-parser' );
var pg = require( 'pg' );
var port = process.env.PORT || 4555;
var FB = require('fb');
var forever = require('forever-monitor');
var credentials = require('config.js');

var child = new(forever.Monitor)('node_modules/facebook-events-by-location/index.js', {
    max: 3,
    silent: true,
    options: []
});

child.on('exit', function() {
    console.log('FB.js has exited after 3 restarts');
});

child.start();

var app_id = credentials.app_id;
var app_secret = credentials.app_secret;
var accessToken;

FB.api('oauth/access_token', {
    client_id: app_id,
    client_secret: app_secret,
    grant_type: 'client_credentials'
}, function (res) {
    if(!res || res.error) {
        console.log(!res ? 'error occurred' : res.error);
        return;
    }

    accessToken = res.access_token;
    console.log(accessToken);
});

app.use( express.static( 'public' ) );
app.use( bodyParser.urlencoded( { extended: true } ) );

app.listen( port, function(){
  console.log('server 4555');
});

app.get('/', function(req, res){
  console.log('URL hit');
  res.sendFile( path.resolve( 'view/index.html' ) );
});

app.get('/access', function(req, res){
  console.log('access', accessToken);
  res.send(accessToken);
});
