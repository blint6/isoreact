let j = require('jedis').element;

export default {

    onComponentMount: function (app) {
        console.log('Installing clock');
        setInterval(() => this.setState({
            dateString: (new Date()).toLocaleDateString()
        }), 1000);
    },

    handlePayload: function (payload) {
        console.log('Clock received', JSON.stringify(payload));
    },

    render: function () {
        // Render based on a given a special state: this.variables actually reference a field mapped to the client(s)
        // Check usefulness: do we need to see divs and attributes here?
        // Maybe not divs but another abstraction?
        // Do we want to make a web page or an API? Web page probably!
        return
        j('div', null,
            this.dateString
        );
    },

    resource: {
        js: require.resolve('./clock.cli.js')
    }
};
