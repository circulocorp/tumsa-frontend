var express = require('express');
var router = express.Router();
const request = require('request');
var secrets = require('docker-secrets-nodejs');

var pg_host = process.env.PG_HOST || "localhost";
var pg_user = process.env.PG_USER || "postgres";
var pg_pass = "admin1234";//secrets.get("pg_pass");
var pg_db = process.env.PG_DB || "tumsadev";

const Pool = require('pg').Pool;
const pool = new Pool({
   		user: pg_user,
  		host: pg_host,
  		database: pg_db,
  		password: pg_pass,
  		port: 5432,
});


var sessionChecker = (req, res, next) => {
   //if (req.session && req.session.user) {
        req.session.user = {
              nid: '0f64a66d-476d-4a78-9ca8-b37624527916',
              username: 'admin@gmail.com',
              password: '0192023a7bbd73250516f069df18b500',
              name: 'Administrator',
              email: 'admin@gmail.com',
              created: '2020-07-15T08:23:30.392Z',
              updated: '2020-07-15T08:23:30.392Z',
              lastlogin: null,
              profile: '35579717-b026-4df9-af93-76edc60da84e',
              blocked: '0',
              access: {},
              perfil: 'Admins'
          }
  //}
        next()
    //} else {
     // res.render('login');
    //}    
};

router.get('/', sessionChecker, (req,res) => {
	res.render('index');
});


router.get('/', sessionChecker, (req,res) => {
	  res.render('index');
});

router.get('/users', sessionChecker, (req, res) =>{
  var current = req.session.user;
  if(current.perfil == "Admins"){
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

router.get('/viajes', sessionChecker, (req, res) =>{
  var current = req.session.user;
  res.render('viajes');
});

router.post('/login', (req, res) => {
	var username = req.body.username,password = req.body.password;
	var sql = "select u.*,p.access,p.name as perfil from users u , profiles p where u.profile = p.nid and u.username = '"+username+"' and u.password = md5('"+password+"') and blocked=0 limit 1";
	pool.query(sql,(error, results) => {
    if (error) {
      console.log(error);
    }
    if(results.rows && results.rows.length > 0){
      console.log(results.rows[0]);
    	req.session.user = results.rows[0]
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