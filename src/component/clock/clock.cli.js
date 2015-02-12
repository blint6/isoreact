export default {

    getInitialState: function () {
        return {
            dateString: ''
        };
    },

    componentDidMount: function () {
        console.log('Installing clock');
    },

    render: function (j) {
        // Render based on a given a special state: this.variables actually reference a field mapped to the client(s)
        // Check usefulness: do we need to see divs and attributes here?
        // Maybe not divs but another abstraction?
        // Do we want to make a web page or an API? Web page probably!
        return j('div', null,
            this./*state.*/dateString
        );
    },
};
