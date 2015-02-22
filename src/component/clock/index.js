module.exports = {

    name: 'clock',

    service: require('./clock.srv.js'),

    client: {
        default: require.resolve('./clock.cli.js')
    },
};