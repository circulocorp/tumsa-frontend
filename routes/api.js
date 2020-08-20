var express = require('express');
var request = require('request');
var secrets = require('docker-secrets-nodejs');
var router = express.Router();;


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


/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('API section');
});

router.get('/getsession', function(req, res, next) {
  res.status(200).json(req.session.user);
});

router.get('/profiles', function(req,res,next){
  var sql = "SELECT * FROM profiles";
  pool.query(sql, (error, results) => {
    if (error) {
      console.log(error);
    }
    res.status(200).json(results.rows);
  });
});

router.get('/users', function(req,res, next){
	var sql = "SELECT us.*,pro.name as perfil FROM users us,profiles pro where pro.nid = us.profile";
	pool.query(sql, (error, results) => {
    if (error) {
      console.log(error);
    }
    res.status(200).json(results.rows);
	});
});

router.post('/users', function(req, res, next){
  var data = req.body;
  var sql = 'INSERT INTO users (nid,username, password, name, email, profile, blocked, created, updated) \
        values(uuid_generate_v4(),$1,$2,$3,$1,$4,0,NOW(),NOW()) RETURNING nid';
  pool.query(sql, [data.username, data.password, data.name, data.profile], 
    (error, results) => {
    if (error) {
          console.log(error);
      }
      res.status(200).json({"status": "ok"});
  });
});

router.patch('/users/:nid', function(req, res, next){
  var data = req.body;
  var sql = 'UPDATE users set password=$2,name=$3,profile=$4,blocked=$5,updated=NOW() where nid=$1';
  pool.query(sql, [req.params.nid,data.password,data.name,data.profile,data.blocked], 
    (error, results) => {
    if (error) {
          console.log(error);
      }
      res.status(200).json({"status": "ok"});
  });
});

router.get('/points', function(req, res, next){
  var sql = "SELECT * FROM controlpoints";
  pool.query(sql, (error, results) => {
    if (error) {
      console.log(error);
    }
    var points = [];
    for(var i=0;i<results.rows.length;i++){
      var point = results.rows[i];
      point["checked"] = point.blocked == 0 ? "checked": "";
      points.push(point);
    }
    console.log(points);
    res.status(200).json(points);
  });
});

router.post('/points', function(req, res, next){
  var data = req.body;
  var sql = "INSERT INTO controlpoints (name,blocked,created) values($1,0,NOW())";
  pool.query(sql, [data.name],(error,results)=> {
    if(error){
      console.log(error);
    }
    res.status(200).json(data);
  });
});

router.patch('/points/:id', function(req, res, next){
  var data = req.body;
  var sql = "update controlpoints set name=$2,blocked=$3 where id=$1";
  pool.query(sql, [req.params.id,data.name,data.alias],(error,results)=> {
    if(error){
      console.log(error);
    }
    res.status(200).json(data);
  });
});

router.get('/routes', function(req, res, next){
  var sql = "SELECT * FROM routes";
  pool.query(sql, (error, results) => {
    if (error) {
      console.log(error);
    }
    res.status(200).json(results.rows);
  });
});

router.post('/routes', function(req,res,next){
  var data = req.body;
  var sql = "INSERT INTO routes (name,rounds,created_by,created,status,points) values($1,$2,$3,NOW(),1,$4)";
  pool.query(sql, [data.name,data.rounds,data.created_by,data.points],(error,results)=> {
    if(error){
      console.log(error);
    }
    res.status(200).json(data);
  });
});

router.patch('/routes/:id',function(req,res,next){
  var data = req.body;
  var sql = "update routes set name=$2,rounds=$3,points=$4,status=$5 where id=$1";
  pool.query(sql, [req.params.id,data.name,data.rounds,data.points,data.status],(error,results)=> {
    if(error){
      console.log(error);
    }
    res.status(200).json(results.rows);
  });
});

router.get('/depertures', function(req,res,next){
  var sql = "SELECT * FROM depertures";
  pool.query(sql, (error, results) => {
    if (error) {
      console.log(error);
    }
    res.status(200).json(results.rows);
  });
});

router.post('/depertures', function(req,res,next){
  var data = req.body;
  var sql = "INSERT INTO depertures(name,route,operator,unit,created,start_date,end_date) \
            values($1,$2,$3,NOW(),$4,NULL)";
  pool.query(sql, [data.name,data.route,data.operator,data.unit,data.created,data.start_date],(error,results)=> {
    if(error){
      console.log(error);
    }
    res.status(200).json(results.rows);
  });
});

router.patch('/depertures/:id', function(req, res, next){
  var data = req.body;
  var sql = "update depertures set name=$2,route=$3,operator=$4,unit=$5,end_date=$6 where id=$1";
  pool.query(sql, [req.params.id,data.name,data.route,data.operator,data.unit,data.end_date],(error,results)=> {
    if(error){
      console.log(error);
    }
    res.status(200).json(results.rows);
  });
});


module.exports = router;