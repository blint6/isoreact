export default function install(socket) {
    socket.on('clock', function (data) {
        console.log(data);

        socket.emit('gotcha', {
            my: 'data'
        });
    });

    socket.on('gotchi', data => console.log(data));
}
