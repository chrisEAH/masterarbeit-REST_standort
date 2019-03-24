var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var config = {
	"host":"localhost",
	"dbPort":"27017",
	"restPort":"67676",
	"db":"container"
}

if(process.env.host!=undefined)config.host=process.env.host;
if(process.env.db_port!=undefined)config.dbPort=process.env.db_port;
if(process.env.rest_port!=undefined)config.restPort=process.env.rest_port;
if(process.env.db!=undefined)config.db=process.env.db;


var app = express();
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json({
        limit: '5mb'
    }));

    app.use(function(req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.setHeader('Access-Control-Allow-Credentials', true);
        next();
    });
    
	
	app.listen(config.restPort, function() {
        console.log('REST-Service listening on port ' + config.restPort + '!');
	});
	
	app.get("/api/getNodeIdByMac/", function(req, response) {
       let results=new Array();
        
        let mac=req.query.mac;
        console.log("request: /api/getNodeIdByMac?mac=" + mac);


        if(mac!=null)
        {
            MongoClient.connect("mongodb://"+config.host+":"+config.port,  { useNewUrlParser: true }, function(err, db){  
            if(err){ console.log( err); }  
            else{
                var dbObject=db.db(config.db);
                dbObject.collection("mac").find({mac:mac}).toArray(function(err,data){
                    if(data.length>0)
                    {
                        console.log(data);
                        response.send(data);
                    }                
                });
            }  
            }); 
        }
        else
        {
            response.send("error");
        }

    });