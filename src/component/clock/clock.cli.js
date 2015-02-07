export default function install(socket) {
    console.log('Installing clock');

    socket.on('clock', function (data) {
        console.log(data);

        socket.emit('gotcha', {
            my: 'data'
        });
    });

    socket.on('gotchi', data => console.log(data));
}
