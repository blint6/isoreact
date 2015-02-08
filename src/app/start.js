import socketio from 'socket.io';
import express from 'express';
import morgan from 'morgan';
import consolidate from 'consolidate';
import bundle from '../jedis-browserify/jedis-browserify';
import App from '../jedis/app';
let singlepage = require('../jedis-express/jedis-express').singlepage;

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

var jedis = new App({
    io: io,
    components: [require.resolve('clock')]
});

bundle(jedis, './tmp/')
    .then(serveFile => app.use('/script/bundle.js', express.static(serveFile)));

app.use('/', singlepage(jedis, 'index.jade'));

export default {
    jedis,
    server,
    io
};
