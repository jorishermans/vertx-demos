load('vertx.js');

// Inspired from Sinatra / Express
var rm = new vertx.RouteMatcher();

var eb = vertx.eventBus;

var count = 0;

// Extract the params from the uri
rm.get('/details/:user/:id', function(req) {
   eb.send("rtforce.template", { name : "user", user : req.params()['user'], id : req.params()['id'] }, function(message) {
    console.log("has a route on message " + req.uri);
    req.response.end(message.output);        
   });
});

rm.get('/count.html', function(req) { 
   count++;    
   eb.send("rtforce.template", { name : "count", count : count }, function(message) {
    console.log("has a route on message " + req.uri);
    req.response.end(message.output);        
   });
});

var templateConf = {  
  nameToPath : {
		"*" : "default.html",
		"user" : "user.html",
                "count" : "count.html"
	}
};

vertx.deployModule('com.rtforce.template.mustache-v0.1', templateConf);
vertx.createHttpServer().requestHandler(rm).listen(8080);

console.log("listen to port 8080");
