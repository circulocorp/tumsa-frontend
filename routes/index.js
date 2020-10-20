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
    /* req.session.user = {
          description: "Josue Virgen",
          firstName: "Josue",
          id: "53a90630-9897-4cd5-922b-3556ab293e39",
          isUserGroupAdmin: true,
          language_Code: "ES-ES",
          phoneHome: "{\"perfil\":\"read\"}",
          perfil: "read",
          surname: "Virgen",
          timeZoneId: 11,
        token: {
          access_token: "eyJhbGciOiJSUzI1NiIsImtpZCI6IkVGMUUxMkVFOTQ1NTdBNDg5MzlCMUJBNjJFQUUxQzFBN0ZDNTY2MkQiLCJ0eXAiOiJKV1QiLCJ4NXQiOiI3eDRTN3BSVmVraVRteHVtTHE0Y0duX0ZaaTAifQ.eyJuYmYiOjE2MDMyMzI4MzIsImV4cCI6MTYwMzIzNjQzMiwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5tem9uZXdlYi5uZXQiLCJhdWQiOlsiaHR0cHM6Ly9sb2dpbi5tem9uZXdlYi5uZXQvcmVzb3VyY2VzIiwibXo2LWFwaSJdLCJjbGllbnRfaWQiOiJtei1hM3RlayIsInN1YiI6Ijg3ZWM3MjIyLTVkMzItNGE3My04ZmE0LTdlNTI4MDBmZGM2NyIsImF1dGhfdGltZSI6MTYwMzIzMjgzMiwiaWRwIjoibG9jYWwiLCJtel91c2VybmFtZSI6IlRVQ0EganZpcmdlbiIsIm16X3VzZXJncm91cF9pZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCIsIm16X3NoYXJkX2NvZGUiOiJBM1RFSyIsInNjb3BlIjpbIm16X3VzZXJuYW1lIiwib3BlbmlkIiwibXo2LWFwaS5hbGwiXSwiYW1yIjpbInB3ZCJdfQ.YHY2TG0PZoDBfet7HHf_jRK-01ir7W8vsToHsn1sc1mSnEFAk6FWQ3cz8yts-HkEJXo2sBkl4zfjoYb3qw6tBMlD0D6dEMdk54l5z3GjoXqqIAHmTe-ThRZVN5BhhE9nLfIY7lg_5FQTPyLS--VeH8GpmLPstzxPTkMxz-kVttR-lSOIwzMLRN-__MpgqOeblhp1XaBL50tICr_k1wJGi88kIIfRMP4BrwEVJs0QeGKDiOMiDMqZUTxuxEcMrZBKkP2q-pHhqo8PAXImRH8FiqzRc6DGa77MPyWCgGdVPlnB1BIXGzQxWHuCZW4iS1OVdqXKar08jxgUY11YdIID0_6RXu68C3fiiFMEkCEor87xdpDt5BdGIdNn-C4dg4JA1JW1dp6E3vn-fYeEQLAbKBKNx0huI6N2tGAjJne0jAJnwKGdCtYhzfp5TG59X8xS3KFC2jPDbUo46_12jfGWdZTgmkxdf0H4nObxfBv960rM_wkPVNaDZGCUdBt8PPDU_5PI5cJ6-PX2QUzAtGvW6YrIMWtddPAae8rpG1L897HQ_0wJLVBHwhRCD_1Fx9Dnkr9UFdld1aC5X1cdzkoYEbBd_4WQGz2BRuegwPEZU-a4HfBeSzkBgLxRw8oxe3esU2MBlbgBqHws8y45bi8oHscHJYYa8cftc-Pyc1o-ftY",
          expires_in: 3600,
          token_type: "Bearer",
          valid_until: "2020-10-20 18:13:44.629918"
  },
  unitOfMeasureDistance_Id: "a54104b8-2a37-471f-92db-3f98c60b966d",
  unitOfMeasureFluid_Id: "01f4a7f9-55b1-4b6d-a65a-eb85f48fdfb8",
  userGroup_Id: "3d3f4f50-6966-49f9-8760-1889837d2417",
  username: "Semovi",
  utcDaylightSavingEnd: "2020-10-25T07:00:00Z",
  utcDaylightSavingOffset: -300,
  utcDaylightSavingStart: "2020-04-05T08:00:00Z",
  utcLastModified: "2020-10-20T01:11:16.043Z",
  utcOffset: -360,
  utcTermsAndConditionsAcceptDate: "2020-08-23T14:56:17.69Z"
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