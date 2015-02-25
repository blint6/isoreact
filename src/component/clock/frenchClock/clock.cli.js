let React = require('react');

export default {

    name: 'daFrenchClock',

	react: {
	    render: function () {
	        return <div>
	            <input type="text" />
	            <span>{this.state.dateString}</span>
	        </div>;
	    },
	}
};
