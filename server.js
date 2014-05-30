var express = require('express'),
    http = require('http'),
    request = require('request'),
    bodyParser = require('body-parser');

var app = express();

app.use(express.static(__dirname + '/client'));
app.use(bodyParser());

app.all('/proxy', function(req, res) {
    var url = req.header('SalesforceProxy-Endpoint');
    
    console.log("proxying:", req.method, url);

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
http.createServer(app).listen(3000);