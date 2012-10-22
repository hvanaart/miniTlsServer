var tls = require('tls');
var fs = require('fs');

var options = {
key: fs.readFileSync('./CA/key.pem'),
cert: fs.readFileSync('./CA/cert.pem'),
requestCert: true,
ca: [ fs.readFileSync('./CA/cert.pem') ]
},
portNumber = 5678;

tls.createServer(options, secureConnect).listen(portNumber, function() {console.log("server started");});

function secureConnect(cleartextStream) {
    console.log("server connected",
                cleartextStream.authorized ? "authorized" : "unauthorized");
    if (cleartextStream.authorizationError) {
        console.log(cleartextStream.authorizationError);
    }
    
    // send a 'welcome' to the client
    cleartextStream.write("welcome!\n");
    cleartextStream.setEncoding('utf8');
    cleartextStream.pipe(cleartextStream);
    
    // log the client ip and port number
    console.log("client address & port",cleartextStream.remoteAddress+':'+cleartextStream.remotePort);
    
    cleartextStream
    .on('data',function(data) {
        // Display the incoming string data
        console.log("cleartextStream data",data);
        })
    .on('end', function (){
        console.log("data input ended");
        })
    .on('close', function (){
        console.log("connection closed");
        })
    .on('error', function (excep){
        console.log("stream error", excep);
        });
}