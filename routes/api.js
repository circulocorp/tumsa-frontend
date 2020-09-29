var express = require('express');
var request = require('request');
var secrets = require('docker-secrets-nodejs');
var router = express.Router();;


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


/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('API section');
});

router.get('/getsession', function(req, res, next) {
  res.status(200).json(req.session.user);
});

function sessionChecker(req) {
  if (req.session && req.session.user) {
    /*
    var url = API_URL+'/validatetoken' 
    var options = {
        uri: url,
        json: true,
        form: req.session.user.token,
        method: 'POST'
    };
    request(options, (err, re, body) => {
      res.send(body);
    });*/
    return true;
  }else{
    return false;
  }
}

router.get('/profiles', function(req,res,next){
  var sql = "SELECT * FROM profiles";
  pool.query(sql, (error, results) => {
    if (error) {
      console.log(error);
    }
    if("rows" in results){
      res.status(200).json(results.rows);
    }else{
      res.status(200).json([]);
    }
  });
});

router.get('/points', function(req, res, next){
  var url = API_URL+'/places' 
  var options = {
      uri: url,
      json: true,
      form: req.session.user.token,
      method: 'POST'
  };
  request(options, (err, re, body) => {
    res.send(body);
  });
});

router.get('/vehicles', function(req,res,next){
  if(sessionChecker(req)){
  var url = API_URL+'/allvehicles' 
  var options = {
      uri: url,
      json: {"token": req.session.user.token},
      method: 'POST'
  };
  request(options, (err, re, body) => {
    res.send(body);
  });
 }else{
  res.send({"error": "Token Error"});
 }
});

router.get('/vehicles/position/:vehicle', function(req,res,next){
  var vehicle = req.params.vehicle;
  var url = API_URL+'/lastposition';
  var options = {
      uri: url,
      json: {"token": req.session.user.token, "vehicle":vehicle},
      method: 'POST'
  };
  request(options, (err, re, body) => {
    res.send(body);
  });
});


router.get('/vehicles/search/:name', function(req,res,next){
  var search = req.params.name;
  var url = API_URL+'/vehicles?search='+search;
  var options = {
      uri: url,
      json: {"token": req.session.user.token, "search":search},
      method: 'POST'
  };
  request(options, (err, re, body) => {
    res.send(body);
  });
});

router.post('/downloadReport', function(req, res, next){
  var data = req.body;
  var url = API_URL+'/tripreport';
  var options = {
      uri: url,
      json: {"token": req.session.user.token, "viaje":data.viaje},
      method: 'POST'
  };
  request(options, (err, re, body) => {
    res.send(body);
  });
});

router.post('/papeletas', function(req, res, next){
  var data = req.body;
  var url = API_URL+'/createtrips';
  var options = {
      uri: url,
      json: {"token": req.session.user.token, "day":data.day, "camiones":data.camiones, "ruta":data.ruta},
      method: 'POST'
  };
  request(options, (err, re, body) => {
    res.send(body);
  });

});

router.post('/uploadTrips', function(req, res, next){
  var data = req.files;
  console.log(data);
});

router.get('/downloadReport/:viaje', function(req, res, next){
  if(sessionChecker(req)){
  var viaje = req.params.viaje;
  var url = API_URL+'/tripreport';
  var options = {
      uri: url,
      json: {"token": req.session.user.token, "viaje":viaje},
      method: 'POST'
  };
   request(options).pipe(res);
  }
});

router.get('/dailyReport', function(req,res, next){
  var url = API_URL+'/dailyreport';
  var options = {
      uri: url,
      json: {"token": req.session.user.token},
      method: 'POST'
  };
  request(options).pipe(res);
});

router.post('/calc_trip', function(req, res, next){
  var url = API_URL+'/calc_trip';
  var data = req.body;
  var options = {
      uri: url,
      json: {"viaje": data.viaje, "role": data.role},
      method: 'POST'
  };
  request(options, (err, re, body) => {
    res.send(body);
  });
});





router.get('/routes', function(req, res, next){
  var sql = "SELECT * FROM routes order by name asc";
  pool.query(sql, (error, results) => {
    if (error) {
      console.log(error);
    }
    data = [];
    if("rows" in results){
    for(var i=0;i<results.rows.length;i++){
      var route = results.rows[i];
      if(route["points"] && route["points"]["places"]){
        var time = 0;
        for(var j=0;j<route["points"]["places"].length;j++){
          time += parseInt(route["points"]["places"][j]["time"]);
        }
        route["total_time"] = time;
      }else{
        route["total_time"] = 0;
      }
      if(route["status"] == 1){
        route["activo"] = "Si";
      }else{
        route["activo"] = "No";
      }
      data.push(route);
    }
    }
    res.status(200).json(data);
  });
});

router.get('/routes/:nid', function(req, res, next){
  var sql = "SELECT * FROM routes where nid=$1";
  pool.query(sql, [req.params.nid], (error, results) => {
    if (error) {
      console.log(error);
    }
    data = [];
    if("rows" in results){
    for(var i=0;i<results.rows.length;i++){
      var route = results.rows[i];
      if(route["points"] && route["points"]["places"]){
        var time = 0;
        for(var j=0;j<route["points"]["places"].length;j++){
          time += parseInt(route["points"]["places"][j]["time"]);
        }
        route["total_time"] = time;
      }else{
        route["total_time"] = 0;
      }
      if(route["status"] == 1){
        route["activo"] = "Si";
      }else{
        route["activo"] = "No";
      }
      data.push(route);
    }
   }
    res.status(200).json(data);
  });
});

router.get('/routes/name/:name', function(req, res, next){
  var name = req.params.name;
  var sql = "SELECT * FROM routes where name ilike '%"+name+"%'";
  pool.query(sql, (error, results) => {
    if (error) {
      console.log(error);
    }
    data = [];
    if("rows" in results){
    for(var i=0;i<results.rows.length;i++){
      var route = results.rows[i];
      if(route["points"] && route["points"]["places"]){
        var time = 0;
        for(var j=0;j<route["points"]["places"].length;j++){
          time += parseInt(route["points"]["places"][j]["time"]);
        }
        route["total_time"] = time;
      }else{
        route["total_time"] = 0;
      }
      if(route["status"] == 1){
        route["activo"] = "Si";
      }else{
        route["activo"] = "No";
      }
      data.push(route);
    }
   } 
    res.status(200).json(data);
  });
});

router.post('/routes', function(req,res,next){
  var data = req.body;
  var points = {"places": data.points};
  var sql = "INSERT INTO routes (nid, name,created_by,created,status,time_rounds,points) values(uuid_generate_v4(),$1,NULL,NOW(),1,$2,$3)";
  pool.query(sql, [data.name,data.time_rounds,points],(error,results)=> {
    if(error){
      console.log(error);
      res.status(500).json({"Status": "ERROR"});
    }
    console.log({"Status": "OK"});
    res.status(200).json({"Status": "OK"});
  });
});

router.patch('/routes/:nid',function(req,res,next){
  var data = req.body;
  var points = {"places": data.points};
  var sql = "update routes set name=$2,points=$3,time_rounds=$4,status=$5 where nid=$1";
  pool.query(sql, [req.params.nid,data.name,points,data.time_rounds,data.status],(error,results)=> {
    if(error){
      console.log(error);
    }
    res.status(200).json({"Status": "OK"});
  });
});

router.get('/departures', function(req,res,next){
  var sql = "SELECT * FROM departures order by created desc";
  pool.query(sql, (error, results) => {
    if (error) {
      console.log(error);
    }
    var data = [];
    for(var i=0;i<results.rows.length;i++){
      d = results.rows[i];
      d["ruta"] = d["route"]["name"];
      d["eco"] = d["vehicle"]["description"];
      data.push(d);
    }
    res.status(200).json(data);
  });
});

router.get('/departures/:nid', function(req,res,next){
  var sql = "SELECT * FROM departures where nid=$1 order by created desc LIMIT 100";
  pool.query(sql, [req.params.nid],(error, results) => {
    if (error) {
      console.log(error);
    }
    if("rows" in results){
      res.status(200).json(results.rows);
    }else{
      res.status(200).json([]);
    }
  });
});

router.post('/departures', function(req,res,next){
  var data = req.body;
  start_date = new Date(data.start_date);
  start_date.setHours(start_date.getHours(), start_date.getMinutes(), start_date.getSeconds(),0);
  var sql = "INSERT INTO departures(nid,trip,vehicle,created,start_date,end_date,rounds,start_point,end_point,total_time,route,comments) values(uuid_generate_v4(),$1,$2,NOW(),$3,$4,$5,$6,$7,$8,$9,$10)";
  pool.query(sql, [data.trip,data.vehicle,start_date,data.end_date,data.rounds,data.start_point,data.end_point,data.total_time,data.route,data.comments],(error,results)=> {
    if(error){
      console.log(error);
    }
    res.status(200).json({"Status":"OK"});
  });
});

router.patch('/departures/:id', function(req, res, next){
  var data = req.body;
  var sql = "update departures set trip=$2,vehicle=$3,start_date=$4,end_date=$5,rounds=$6,total_time=$7,start_point=$8,end_point=$9 where id=$1";
  pool.query(sql, [req.params.id,data.route,data.vehicle,data.start_date,data.end_date,data.rounds,data.start_point,data.end_point],(error,results)=> {
    if(error){
      console.log(error);
    }
    res.status(200).json({"Status":"OK"});
  });
});

router.get('/roles', function(req,res,next){
  var sql = "SELECT r.*,ru.name as ruta FROM roles r,routes ru where ru.nid=r.route order by ru.name,r.hour asc";
  pool.query(sql, (error, results) => {
    if (error) {
      console.log(error);
    }
    if("rows" in results){
      res.status(200).json(results.rows);
    }else{
      res.status(200).json([]);
    }
  });
});

router.get('/roles/:nid', function(req,res,next){
  var sql = "SELECT r.*,ru.name as ruta FROM roles r,routes ru where ru.nid=r.route and r.nid=$1 order by ru.name,r.hour asc";
  pool.query(sql, [req.params.nid], (error, results) => {
    if (error) {
      console.log(error);
    }
    if("rows" in results){
      res.status(200).json(results.rows);
    }else{
      res.status(200).json([]);
    }
  });
});

router.get('/roles/route/:route', function(req,res,next){
  var sql = "SELECT r.*,ru.name as ruta FROM roles r,routes ru where ru.nid=r.route and ru.nid=$1";
  pool.query(sql, [req.params.route], (error, results) => {
    if (error) {
      console.log(error);
    }
    if("rows" in results){
      res.status(200).json(results.rows);
    }else{
      res.status(200).json([]);
    }
  });
});

router.post('/roles', function(req,res,next){
  var data = req.body;
  var sql = "INSERT INTO roles(nid,hour,rounds,route,start_point,end_point,comments) \
            values(uuid_generate_v4(),$1,$2,$3,$4,$5,$6)";
  pool.query(sql, [data.hour, data.rounds, data.route,data.start_point,data.end_point,data.comments],(error,results)=> {
    if(error){
      console.log(error);
    }
    res.status(200).json({"Status":"OK"});
  });
});

router.patch('/roles/:id', function(req, res, next){
  var data = req.body;
  console.log(data);
  var sql = "update roles set hour=$2,rounds=$3,route=$4,start_point=$5,end_point=$6,comments=$7 where nid=$1";
  pool.query(sql, [req.params.id,data.hour,data.rounds,data.route,data.start_point,data.end_point,data.comments],(error,results)=> {
    if(error){
      console.log(error);
    }
    res.status(200).json({"Status":"OK"});
  });
});



module.exports = router;