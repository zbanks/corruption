var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

// Start the server
server.listen(3000, function(){
    console.log("Server listening on port 3000...");    
});

// Load test
var load_test = function(){
    // return require('test.js');
    return {
        "title" : "Test Test",
        "description": "Descriptions",
        "sections": [
            { 
                "id": "a",
                "number": 1,
                "title": "Section A",
                "description": "<em>A</em>",
            },
            { 
                "id": "b",
                "number": 2,
                "title": "Section B",
                "description": "<em>B</em>",
            },
        ],
        "questions": [
            {
                "number": 1,
                "section": "a",
                "title": "Question 1"
            },
            {
                "number": 2,
                "section": "a",
                "title": "Question 2"
            },
            {
                "number": 3,
                "section": "b",
                "title": "Question 3"
            },
        ],
    };
}
var test = load_test();

// Routing
app.use(express.static(__dirname + '/static'));

// Real-time
io.on('connection', function(socket){

});
