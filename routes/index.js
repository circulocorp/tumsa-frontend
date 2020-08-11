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
   if (req.session && req.session.user) {
        next()
    } else {
        res.render('login');
    }    
};

router.get('/', sessionChecker, (req,res) => {
	res.render('index');
});


router.get('/', sessionChecker, (req,res) => {
	  res.render('index');
});

router.get('/users', sessionChecker, (req, res) =>{
  res.render('users');
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