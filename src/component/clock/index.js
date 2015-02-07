export default {
    server: function (app) {
        console.log('Installing clock');

        app.io.on('connection', socket => {
            console.log(socket.handshake);
            socket.join('clock');
        });

        setInterval(() => app.io.to('clock').emit('clock', (new Date()).toLocaleDateString()), 1000);
    },

    client: require.resolve('./clock.cli.js')
};
