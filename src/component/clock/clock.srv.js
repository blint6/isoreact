let getDate = (() => (new Date()).toLocaleString());

module.exports = {

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
    }
};