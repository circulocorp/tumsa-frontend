var express = require('express');
var router = express.Router();
const request = require('request');
var secrets = require('docker-secrets-nodejs');

var pg_host = process.env.PG_HOST || "localhost";
var pg_user = process.env.PG_USER || "postgres";
var pg_pass = secrets.get("tumsa_dbpass");
var pg_db = process.env.PG_DB || "tumsadev";
var API_URL = process.env.API_URL || "http://127.0.0.1:8888/api"

const Pool = require('pg').Pool;
const pool = new Pool({
   		user: pg_user,
  		host: pg_host,
  		database: pg_db,
  		password: pg_pass,
  		port: 5432,
});


var sessionChecker = (req, res, next) => {
 if (req.session && req.session.user) {
         next();
  } else {
      res.render('login');
  }
};

router.get('/', sessionChecker, (req,res) => {
	res.render('viajes');
});

/*
router.get('/', sessionChecker, (req,res) => {
	  res.render('index');
});
*/


router.get('/users', sessionChecker, (req, res) =>{
  var current = req.session.user;
  if(current.perfil == "admin"){
    res.render('users');
  }else{
    res.render('404');
  }
});

router.get('/controls', sessionChecker, (req, res) =>{
  var current = req.session.user;
  res.render('controls');
});

router.get('/rutas', sessionChecker, (req, res) =>{
  var current = req.session.user;
  res.render('rutas');
});

router.get('/roles', sessionChecker, (req, res)=>{
  var current = req.session.user;
    res.render('roles');
});

router.get('/reportes', sessionChecker, (req, res)=>{
  var current = req.session.user;
  res.render('reportes');
})

router.get('/form_ruta', sessionChecker, (req, res) =>{
  var current = req.session.user;
  if(current.perfil == "admin"){
  res.render('form_ruta', { route: req.query.id });
  }else{
    res.render('404');
  }
});

router.get('/form_viaje', sessionChecker, (req, res) =>{
  var current = req.session.user;
  if(current.perfil != "read"){
    res.render('form_viaje', { viaje: req.query.id });
  }else{
    res.render('404');
  }
});


router.get('/viajes', sessionChecker, (req, res) =>{
  var current = req.session.user;
  res.render('viajes');
});

router.get('/vehicles', sessionChecker, (req, res) =>{
  var current = req.session.user;
  res.render('vehicles');
});


router.post('/login', (req, res) => {
  var url = API_URL+'/login';
  var options = {
      uri: url,
      json: true,
      method: 'POST',
      form: req.body
  };
  console.log(url);
  request(options, (err, re, body) => {
     console.log(body);
    if("username" in body){
      req.session.user = body;
    }else{
      req.session.error = "Acceso Denegado";
    }
    res.redirect('/');
  });
});

router.get('/logout', (req, res)=>{
  req.session.destroy(function(err){
     if(err){
        console.log(err);
     }else{
         res.redirect('/');
     }
  });
});




module.exports = router;