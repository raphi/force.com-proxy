var express = require('express'),
    fs = require('fs'),
    https = require('https'),
    request = require('request'),
    bodyParser = require('body-parser');

var options = {
    key: fs.readFileSync('./ssl/server.key'),
    cert: fs.readFileSync('./ssl/server.crt')
};

var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "SalesforceProxy-Endpoint,X-User-Agent,Content-Type,X-Authorization");
  next();
});

app.use(express.static(__dirname + '/client'));
app.use(bodyParser());

app.post('/proxy', function(req, res) {
    var url = req.header('SalesforceProxy-Endpoint');
    
    console.log("proxying:", req.method, url);
    console.log("body:", req.body);

    request({ 
    	url: url,
    	method: req.method,
     	body: JSON.stringify(req.body),
     	headers: {
     		'Authorization': req.header('X-Authorization'),
 			'Content-Type': 'application/json',
 			'X-User-Agent': req.header('x-user-agent')
 		}
   	}).pipe(res);
});

console.log('Listening on port 3000...');
https.createServer(options, app).listen(3000);
