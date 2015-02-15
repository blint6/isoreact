import socketio from 'socket.io';
import express from 'express';
import morgan from 'morgan';
import consolidate from 'consolidate';
import bundle from '../jedis-browserify/jedis-browserify';
import Jedis from 'jedis';
let singlepage = require('../jedis-express/jedis-express').singlepage;

import Clock from 'clock';

let app = express();

// Only use logger for development environment
if (true || process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.engine('jade', consolidate.jade);
app.set('view engine', 'html');
app.set('views', __dirname + '/template');
app.enable('jsonp callback');

let server, io;

server = app.listen(3000);
io = socketio.listen(server);

let clock = Jedis.createComponent(Clock),
    clockCtx = clock.context();

let componentTree = clock;

var jedis = Jedis.createPage(componentTree, {});

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

setInterval(() => clockCtx.setState(), 1000);

export
default {
    jedis,
    server,
    io
};