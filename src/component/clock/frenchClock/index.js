module.exports = {

    name: 'frenchClock',

    mixins: [require('..')],

    client: {
        default: require.resolve('./clock.cli.js')
    },
};