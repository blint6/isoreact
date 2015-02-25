let socketio = require('socket.io');
let express = require('express');
let morgan = require('morgan');
let consolidate = require('consolidate');
let Promise = require('rsvp').Promise;
let bundle = require('../jedis-browserify/jedis-browserify');
let singlepage = require('../jedis-express/jedis-express').singlepage;
let protoCraft = require('./protoCraft');

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

let appReadyResolve,
    appReadyReject,
    appReady = new Promise((resolve, reject) => {
        appReadyResolve = resolve;
        appReadyReject = reject;
    });

bundle(protoCraft, {
    workdir: './tmp/'
})
    .then(serveFile => app.use('/script/bundle.js', express.static(serveFile)))
    .then(() => app.use('/', singlepage(protoCraft, 'index.jade')))
    .then(err => err && appReadyReject(err) || appReadyResolve());

// !! IO tryout !! //

let server = app.listen(3000),
    io = socketio.listen(server);

io.on('connection', socket => {
    console.log(socket.handshake);
    socket.join('protoCraft');
});

protoCraft.on('newState', (context, payload) => io.to('protoCraft').emit('dispatch', payload));

module.exports = {
    jedis: protoCraft,

    ready: appReady,

    rebundle: function() {
        return bundle(protoCraft, {
            workdir: './tmp/'
        });
    },

    stop: function() {
        return new Promise((resolve, reject) => server.close(err => err ? reject(err) : resolve()));
    }
};