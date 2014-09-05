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
        "test": {
            "title" : "Test Test",
            "description": "Descriptions",
        },
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
                "title": "Question 1",
                "answers": {},
            },
            {
                "number": 2,
                "section": "a",
                "title": "Question 2",
                "answers": {},
            },
            {
                "number": 3,
                "section": "b",
                "title": "Question 3",
                "answers": {},
            },
        ],
    };
}
var test = load_test();

// Routing
app.use(express.static(__dirname + '/static'));

// Real-time
var clients = 1;
io.on('connection', function(socket){
    var clientName = clients++;
    socket.on("test:read", function(data, callback){
        callback(null, test.test);
    });
    socket.on("sections:read", function(data, callback){
        callback(null, test.sections);
    });
    socket.on("questions:read", function(data, callback){
        callback(null, test.questions);
    });
    socket.on("question:update", function(data, callback){
        console.log(data);
        var number = data.number;
        var answer = data.myAnswer;
        _(test.question).findWhere({number: number}).answers[clientName] = answer;

        socket.emit("question/" + number + ":update");
        socket.broadcast.emit("question/" + number + ":update");
        callback(null, test.questions);
    });
});
