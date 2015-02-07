import socketio from 'socket.io';
import express from 'express';
import consolidate from 'consolidate';
import {
    components, install
}
from '../component/componentinstaller';
import jedis from './app';

let app = express();

// Only use logger for development environment
if (process.env.NODE_ENV === 'development') {
    app.use(express.logger('dev'));
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

jedis(io, 'tmp/', [require.resolve('../component/clock')]);
