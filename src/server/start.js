import socketio from 'socket.io';
import express from 'express';
import {
    components, install
}
from '../component/componentinstaller';

let app = express();

app.get('/', function (req, res) {
    res.send('Hello World!')
});

let router = express.router();
let io;

app.use('/component', router);
app.listen(3000);
io = socketio.listen(app);

install((name => '../component/' + name), router.route('/' + name), io);
