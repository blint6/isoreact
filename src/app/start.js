let socketio = require('socket.io');
let express = require('express');
let morgan = require('morgan');
let consolidate = require('consolidate');
let singlepage = require('../jedis-express/jedis-express').singlepage;
let protoCraft = require('./protoCraft');

console.info('Isoreact test start');

let app = express();

// Only use logger for development environment
if (true || process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.engine('jade', consolidate.jade);
app.set('view engine', 'html');
app.set('views', __dirname + '/template');
app.enable('jsonp callback');

app.use('/vendor', express.static(process.cwd() + '/bower_components'));
app.use('/script/bundle.js', express.static(process.cwd() + '/tmp/serve/bundle.js'));
app.use('/', singlepage(protoCraft.app, 'index.jade'));

// !! IO tryout !! //

let server = app.listen(3000),
    io = socketio.listen(server);

io.on('connection', socket => {
    console.info('Got a handshake');
    socket.join('protoCraft');
});

protoCraft.app.on('newState', (context, payload) => io.to('protoCraft').emit('dispatch', payload));
protoCraft.run();

module.exports.jedis = protoCraft.app;

module.exports.stop = function() {
    console.info('Isoreact test stop');
    return new Promise((resolve, reject) => server.close(err => err ? reject(err) : resolve()));
};