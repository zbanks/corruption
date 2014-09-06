var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var _ = require('underscore');
var crypto = require('crypto');

var sha1 = function(data){
    var shasum = crypto.createHash('sha1');
    shasum.update(data);
    shasum.update("4thEAST!");
    return shasum.digest('hex');
}

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
    var clientName = (clients++).toString();
    var clientHash = sha1(clientName);
    socket.on("setName", function(data, callback){
        clientName = data;
        clientHash = sha1(clientName);
    });
    socket.on("test:read", function(data, callback){
        callback(null, test.test);
    });
    socket.on("sections:read", function(data, callback){
        callback(null, test.sections);
    });
    socket.on("questions:read", function(data, callback){
        var questions = _.clone(test.questions);
        _.each(questions, function(val, key){
            questions[key].myAnswer = questions[key].answers[clientHash] || null;
        });
        callback(null, questions);
    });
    socket.on("question:update", function(data, callback){
        var number = data.number;
        var answer = data.myAnswer;
        var q = _(test.questions).findWhere({number: number});
        if(q){ 
            q.answers[clientHash] = answer;
        }
        data.answers[clientHash] = answer;

        socket.emit("question/" + number + ":update", data);
        socket.broadcast.emit("question/" + number + ":update", data);
        callback(null, data);
    });
});
