import Jedis from '../../jedis/app';

export default Jedis.createClass({
    server: function () {
        console.log('Installing clock');

        this.io.on('connection', socket => {
            console.log(socket.handshake);
            socket.join('clock');
        });

        setInterval(() => this.io.to('clock').emit('clock', (new Date()).toLocaleDateString()), 1000);
    },

    client: require.resolve('./clock.cli.js')
});
