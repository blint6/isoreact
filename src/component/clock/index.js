export default {
    server: function (io) {
        io.on('connection', socket => {
            console.log(socket);
            socket.join('clock');
        });

        setInterval(() => io.sockets.in('clock').send((new Date()).toLocaleDateString()), 1000);
    },

    client: require.resolve('./clock.cli.js')
};
