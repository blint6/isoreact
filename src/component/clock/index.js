let getDate = (() => (new Date()).toLocaleString());

export default {

    getInitialState: function (app) {
        console.log('Installing clock');
        return {
            dateString: getDate()
        };
    },

    handleState: function (state) {
        // console.log('Clock received', JSON.stringify(state));
        return {
            dateString: getDate()
        };
    },

    client: {
        default: require.resolve('./clock.cli.js')
    },
};
