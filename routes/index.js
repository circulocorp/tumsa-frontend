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
            access_token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IkVGMUUxMkVFOTQ1NTdBNDg5MzlCMUJBNjJFQUUxQzFBN0ZDNTY2MkQiLCJ0eXAiOiJKV1QiLCJ4NXQiOiI3eDRTN3BSVmVraVRteHVtTHE0Y0duX0ZaaTAifQ.eyJuYmYiOjE2MDE1OTk1OTgsImV4cCI6MTYwMTYwMzE5OCwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5tem9uZXdlYi5uZXQiLCJhdWQiOlsiaHR0cHM6Ly9sb2dpbi5tem9uZXdlYi5uZXQvcmVzb3VyY2VzIiwibXo2LWFwaSJdLCJjbGllbnRfaWQiOiJtei1hM3RlayIsInN1YiI6IjUzYTkwNjMwLTk4OTctNGNkNS05MjJiLTM1NTZhYjI5M2UzOSIsImF1dGhfdGltZSI6MTYwMTU5OTU5OCwiaWRwIjoibG9jYWwiLCJtel91c2VybmFtZSI6IlRVTVNBLUFQSSIsIm16X3VzZXJncm91cF9pZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCIsIm16X3NoYXJkX2NvZGUiOiJBM1RFSyIsInNjb3BlIjpbIm16X3VzZXJuYW1lIiwib3BlbmlkIiwibXo2LWFwaS5hbGwiXSwiYW1yIjpbInB3ZCJdfQ.zrbhlRHkwMUl5qp5kt3q6Ts-Q9nmtI0njyH3Dd14uTtszcmvbMhDHn5A4SD9wsffEfwcxgRNs-uftE_O1oVWzJYGYOzgoZOZRA8d5F3P4u5WysGwouc73tEPsOnvEW1sa1Ts44vWx3UD0o7rJwFzVsNlZGEE2ZKbwRqTA_ssvmFWns_B375un_w-SA3iMeDH9YtIyTD0FN_jl2kKH0XtBtPtPas14UJ6J3RylIWomO6T7isWfCqsY4AbShI4FFv4i-OrXDlaE0_A7D09dtDLb0buMQdgOX0WmAKmxlMCJdPbS6jh6dLvggCnMSJtrQf9qH_jFV4HST2PNBT-SrFdGvPOZO4I53uccuGQbrwEjMV1fqAYRdoDLWGVGJxT35ZCCpfUA4Q2yJUYTG9-RrnrUcqRZjHzEAYReNY3tau4DXIxehUogoEKhCw59ipr26GANAWgAmztrw7LlVfDd9gztdj-XgLJ2uwC5mrJYDdlEDiNzcoEId4ywP4U_wCcr1JxB-SpeG-P6bUcIGnDzViTCf8nZaDHmgbWGsIedBdKH2IMlAg2J7aDPscs5uhPRM4XuHAwXhJNooh62tHdQs9kOSg7dSOzlNv7sh00tPXafjm4lEAT_nF-laSKkba-3I_N10DNmDMbbvr5XT0s-vhp2OYYsoV1MJdld5UMKQPy59E',
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