let getDate = (() => (new Date()).toLocaleDateString());

export default {

    getInitialState: function (app) {
        console.log('Installing clock');
        return {
            dateString: getDate()
        };
    },

    handleState: function (state) {
        console.log('Clock received', JSON.stringify(state));
        return {
            dateString: getDate()
        };
    },

    resource: {
        js: require.resolve('./clock.cli.js')
    }
};
