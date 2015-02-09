export default function install(app) {
    console.log('Installing clock');

    app.io.on('clock', function (data) {
        console.log(data);

        app.io.emit('gotcha', {
            my: 'data'
        });
    });

    app.io.on('gotchi', data => console.log(data));
}

export default {
    onComponentMount: function (node) {

    }
};
