export default {
    server: function (io) {
        console.log('Installing clock');

        io.on('connection', socket => {
            console.log(socket.handshake);
            socket.join('clock');
        });

        setInterval(() => io.to('clock').emit('clock', (new Date()).toLocaleDateString()), 1000);
    },

    client: require.resolve('./clock.cli.js')
};
