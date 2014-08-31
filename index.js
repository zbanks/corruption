var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

// Start the server
server.listen(3000, function(){
    console.log("Server listening on port 3000...");    
});

// Routing
app.use(express.static(__dirname + '/static'));

// Real-time
io.on('connection', function(socket){

});
