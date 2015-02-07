import socketio from 'socket.io';
import express from 'express';
import morgan from 'morgan';
import consolidate from 'consolidate';
import jedis from './jedis/app';

let app = express();

// Only use logger for development environment
if (true || process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.engine('jade', consolidate.jade);
app.set('view engine', 'html');
app.set('views', __dirname + '/template');
app.enable('jsonp callback');

app.get('/', function (req, res) {
    res.render('index.jade', {
        scripts: []
    });
});

let router = express.Router();
let server, io;

app.use('/component', router);

server = app.listen(3000);
io = socketio.listen(server);

jedis(io, './tmp/', [require.resolve('../component/clock')])
    .then(serveFile => app.use('/script/bundle.js', express.static(serveFile)));
