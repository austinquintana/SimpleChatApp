var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

var dburl = 'DATABASE PLACEHOLDER'

var Message = mongoose.model('Message',{ name: String, message : String})


app.get('/messages', (req, res) => {
    Message.find({}, (err, messages)=> {
        res.send(messages);
    })
})

app.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save((err) =>{
        if(err)
          sendStatus(500);
        res.sendStatus(200);
    })
})

app.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save((err) => {
        if(err)
          sendStatus(500);
        io.emit('message', req.body);
        res.sendStatus(200);
    })
})

io.on('connection', () =>{
    console.log('a user is connected')
})

var server = app.listen(3000, () => {
    console.log('server is running on port', server.address().port);
});

mongoose.connect(dburl , (err) => {
    console.log('mongodb connected',err);
})