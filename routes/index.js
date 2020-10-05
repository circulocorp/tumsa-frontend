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
      /*req.session.user = {
          description: 'API TUMSA',
          firstName: 'API',
          id: '53a90630-9897-4cd5-922b-3556ab293e39',
          isUserGroupAdmin: true,
          language_Code: 'ES-ES',
          surname: 'TUMSA',
          timeZoneId: 11,
          token: {
            access_token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IkVGMUUxMkVFOTQ1NTdBNDg5MzlCMUJBNjJFQUUxQzFBN0ZDNTY2MkQiLCJ0eXAiOiJKV1QiLCJ4NXQiOiI3eDRTN3BSVmVraVRteHVtTHE0Y0duX0ZaaTAifQ.eyJuYmYiOjE2MDE4NTc2ODIsImV4cCI6MTYwMTg2MTI4MiwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5tem9uZXdlYi5uZXQiLCJhdWQiOlsiaHR0cHM6Ly9sb2dpbi5tem9uZXdlYi5uZXQvcmVzb3VyY2VzIiwibXo2LWFwaSJdLCJjbGllbnRfaWQiOiJtei1hM3RlayIsInN1YiI6IjUzYTkwNjMwLTk4OTctNGNkNS05MjJiLTM1NTZhYjI5M2UzOSIsImF1dGhfdGltZSI6MTYwMTg1NzY4MiwiaWRwIjoibG9jYWwiLCJtel91c2VybmFtZSI6IlRVTVNBLUFQSSIsIm16X3VzZXJncm91cF9pZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCIsIm16X3NoYXJkX2NvZGUiOiJBM1RFSyIsInNjb3BlIjpbIm16X3VzZXJuYW1lIiwib3BlbmlkIiwibXo2LWFwaS5hbGwiXSwiYW1yIjpbInB3ZCJdfQ.CKu8mF7-SwKQ7Vrtgo5yFpZ1VuOtV6rVBTnjaLcKHbB3Qk34Sczs2PKsnYbFZQHe6ZrX30YRjKlCzM1QTuB7TizN78NLZGdEOOI8EyjnuA6NwT5BKihN3BVu8_I_kO1_ye3l4hj2iCagUXBa2VJKF0sIyyjjNWSZab7Xu0U7KcPe0IoIOiqca0O1rzCcj5IFNo1tYU0crgzJ7jk4a-l0iON77OXFpkmAFJAOOPWza-ZLSJsE68vyBe0jZpZYBeC2Mu2uTG6foH4-FyouDzP0Mzt0wSPBs1IiUXEW3aTQz_K-bwTgZ-F0qdH1JtnGXZKlbSRxMZM_RxBfyyvgScsyIl5-Ak7j1zqEA1M3ocOSEevDQmDtBpxQUKplxQYOvmwQS9cJYISvnVvOSBiUfVDT0GmyxhzgBqQvX6n4aurviHONIYEZkgrOYgRRpYUFgjjjmuVk4mkPzl9hvOCoAEi41dkAcHkPK5c9OjE_9jaCZCB5dfg6tgR6v2sq-bshn_XXo0rGXZxzKptaGsgVYiVMc8V-Owjo9V5oBklNDzsMsv95ezBNMlp6JJ2BU42bujELY2VRSkxDj0lESrJLKQPgj6Pi1XlrcLUuYsovkZwlWrs2ZQSniCdTrXLglTz5Lyqjk6D-DxrfhguD7EWDxEIYDKl8-2fLfqGuyu_gp-DDNYo',
            expires_in: 3600,
            token_type: 'Bearer',
            valid_until: '2020-08-27 21:08:42.380052'
          },
          unitOfMeasureDistance_Id: 'a54104b8-2a37-471f-92db-3f98c60b966d',
          unitOfMeasureFluid_Id: '01f4a7f9-55b1-4b6d-a65a-eb85f48fdfb8',
          userGroup_Id: '3d3f4f50-6966-49f9-8760-1889837d2417',
          username: 'TUMSA-API',
          utcDaylightSavingEnd: '2020-10-25T07:00:00Z',
          utcDaylightSavingOffset: -300,
          utcDaylightSavingStart: '2020-04-05T08:00:00Z',
          utcLastModified: '2020-08-22T15:25:34.693Z',
          utcOffset: -360,
          utcTermsAndConditionsAcceptDate: '2020-08-23T14:56:17.69Z'
          }*/
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
  res.render('form_ruta', { route: req.query.id });
});

router.get('/form_viaje', sessionChecker, (req, res) =>{
  var current = req.session.user;
  res.render('form_viaje', { viaje: req.query.id });
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