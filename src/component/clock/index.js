let getDate = (() => (new Date()).toLocaleString());

module.exports = {

    name: 'clock',

    getInitialState: function(context) {
        console.log('Installing clock');
        return {
            dateString: getDate()
        };
    },

    handleState: function(state) {
        //console.log('Clock received', JSON.stringify(state));
        this.setState({
            dateString: getDate()
        });
    },

    client: {
        default: require.resolve('./clock.cli.js')
    },
};