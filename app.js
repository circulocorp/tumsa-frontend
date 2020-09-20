var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var ejs = require('ejs'); 
var logger = require('morgan');
var bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var session = require('express-session');
var api = require('./routes/api');
var app = express();

app.set("view options", {layout: true}); 
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(cookieParser());


app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('tumsa_sid');        
    }
    next();
});


app.use(session({
    key: 'tumsa_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3700000
    }
}));


app.use(function(req, res, next){
	var err = new Error('Not Found');
	err.status = 404;
	next();
});



app.use('/', indexRouter);
app.use('/api', api);

app.get('*', function(req, res){
  res.render('404');
});
module.exports = app;