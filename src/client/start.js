import io from 'socket.io';
import {
    components, install
}
from '../component/componentinstaller';

let socket = io('http://localhost');

install((name => `../component/${name}/${name}.cli.js`), socket);
