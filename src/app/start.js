let socketio = require('socket.io');
let express = require('express');
let morgan = require('morgan');
let consolidate = require('consolidate');
let Promise = require('rsvp').Promise;
let bundle = require('../jedis-browserify/jedis-browserify');
let Jedis = require('jedis');
let singlepage = require('../jedis-express/jedis-express').singlepage;

let ProtoBanner = require('ProtoBanner');
let ProtoTitle = require('ProtoBanner/ProtoTitle');

let Clock = require('clock/frenchClock');

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

let server, io;

server = app.listen(3000);
io = socketio.listen(server);

let banner = Jedis.createComponent(ProtoBanner, null,
    Jedis.createComponent(ProtoTitle, {
        title: 'Jedis with <3'
    }));
let clock = Jedis.createComponent(Clock);

let clockCtx = clock.context();

let componentTree = Jedis.createComponent(null, null, banner, clock);

let jedis = Jedis.createPage(componentTree, {});

bundle(jedis, {
    workdir: './tmp/'
})
    .then(serveFile => app.use('/script/bundle.js', express.static(serveFile)))
    .then(() => app.use('/', singlepage(jedis, 'index.jade')));

// !! IO tryout !!
io.on('connection', socket => {
    console.log(socket.handshake);
    socket.join('jedis');
});

jedis.on('newState', (context, payload) => io.to('jedis').emit('dispatch', payload));

setInterval(() => clockCtx.handleState(), 1000);

module.exports = {
    jedis: jedis,
    rebundle: function() {
        bundle(jedis, {
            workdir: './tmp/'
        });
    },
    stop: function() {
        return new Promise((resolve, reject) => server.close(err => err ? reject(err) : resolve()));
    }
};