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
            access_token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IkVGMUUxMkVFOTQ1NTdBNDg5MzlCMUJBNjJFQUUxQzFBN0ZDNTY2MkQiLCJ0eXAiOiJKV1QiLCJ4NXQiOiI3eDRTN3BSVmVraVRteHVtTHE0Y0duX0ZaaTAifQ.eyJuYmYiOjE2MDA3NDc2NTYsImV4cCI6MTYwMDc1MTI1NiwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5tem9uZXdlYi5uZXQiLCJhdWQiOlsiaHR0cHM6Ly9sb2dpbi5tem9uZXdlYi5uZXQvcmVzb3VyY2VzIiwibXo2LWFwaSJdLCJjbGllbnRfaWQiOiJtei1hM3RlayIsInN1YiI6IjUzYTkwNjMwLTk4OTctNGNkNS05MjJiLTM1NTZhYjI5M2UzOSIsImF1dGhfdGltZSI6MTYwMDc0NzY1NiwiaWRwIjoibG9jYWwiLCJtel91c2VybmFtZSI6IlRVTVNBLUFQSSIsIm16X3VzZXJncm91cF9pZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCIsIm16X3NoYXJkX2NvZGUiOiJBM1RFSyIsInNjb3BlIjpbIm16X3VzZXJuYW1lIiwib3BlbmlkIiwibXo2LWFwaS5hbGwiXSwiYW1yIjpbInB3ZCJdfQ.eSdW7eq2r4EDFMrwdqs5FmMGtkEdvcWF0gHkuEigKuT9pWE94890FtFLnYfXY-2Nt0iFUncZ0On1EClObxe2EVy7dYvOxktJBgQsB-x-O2oyH6N2MimWJSt2vnmZ4XOKU4vN3SVQ6Rtis7c3DajsmoXrHaXDSqihWNTkSEnNI850om7S_PpsdP1H9uqQn9jZJbusjfjhTgfxwLNXEP5VnUIIL4o7LOm6iYvL-DOKJvB2xtw2hZI1EK5hqjuiirg7R-8-6MYit9WgTRAgx_tOYSpOWnY_AWlB_LrWdrRDShCs1cqATo0WmREMIwkBuHRuuHIuAQ76HA13u7l-et3_y4mC1OsoX_JN70fBPiHuRAwBQtMVaSl-uGRt1mKw0Ds0UlR7Dvsnw5RaPk6d7oFzJvYU6vxpA3U60BUu4FknOz5PfRDoDizpbJOS3QWUV34NGPfN7k-DxZc4TySATXKUDH4SmcG8JLcW7GLdPiRplLvYg9FhF_LNDNEJs5vOahyzNh0UftXYZh9bRbXsq_83Scdiag5RXPFhpLgbV94TmkuWVffG8HaqVcKyGJbLyebJgwYSPbj_1YRMo-g1XaxhGI4SjisJxvndjOHiklJuxTVjXdtYIJ2BueSc46OaHcKOp1mqk_92qiyg7jDW9t1aNDWUrVaRZocGGdOgz2cGZkA',
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
          }   */
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
  request(options, (err, re, body) => {
    if("username" in body){
       console.log(body);
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