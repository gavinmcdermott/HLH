
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    everyauth = require('everyauth'),
    api = require('./routes/api');

/**
 * EVERYAUTH AUTHENTICATION
 * -------------------------------------------------------------------------------------------------
 * allows users to log in and register using OAuth services
 **/

everyauth.debug = true;

// Configure Facebook auth
var usersById = {},
    nextUserId = 0,
    usersByFacebookId = {},
    usersByTwitId = {},
    usersByLogin = {
        'user@example.com': addUser({ email: 'user@example.com', password: 'azure'})
    };

everyauth.
    everymodule.
    findUserById(function (id, callback) {
        callback(null, usersById[id]);
    });

everyauth.github
    .appId("7b186c29cae93a88bdcb")
    .appSecret("fe632b0c8ad5edf26cd30f67937c7967e1189ea2")
    .findOrCreateUser( function (sess, accessToken, accessSecret, ghUser) {
      console.log('find user');
    })
    .redirectPath('/');

// add a user to the in memory store of users.  If you were looking to use a persistent store, this
// would be the place to start
function addUser (source, sourceUser) {
    var user;
    if (arguments.length === 1) {
        user = sourceUser = source;
        user.id = ++nextUserId;
        return usersById[nextUserId] = user;
    } else { // non-password-based
        user = usersById[++nextUserId] = {id: nextUserId};
        user[source] = sourceUser;
    }
    return user;
}

var app = module.exports = express();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
    app.engine('.html', require('ejs').renderFile);
    app.set('view engine', 'html');
    app.set('view options', {
        layout: false
    });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'omgnodeworks' }));
  app.use(everyauth.middleware());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

// Routes
app.get('/', routes.index);
app.get('/login', routes.login);
app.get('/partials/:name', routes.partials);

// JSON API

app.get('/api/posts', api.posts);
app.get('/api/post/:id', api.post);

app.post('/api/addPost', api.addPost);
app.post('/api/editPost', api.editPost);
app.post('/api/deletePost', api.deletePost);

appServer = app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", appServer.address().port, app.settings.env);
});
