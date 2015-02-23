export default {

    name: 'daFrenchClock',

	react: {
	    render: function (React) {
	        return <div>
	            <input type="text" />
	            <span>{this.state.dateString}</span>
	        </div>;
	    },
	}
};
