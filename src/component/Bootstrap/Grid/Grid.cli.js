let React = require('react');
let Grid = require('react-bootstrap/lib/Grid');

module.exports = {
	react: {
		render: function() {
			return (<Grid>{this.props.children}</Grid>);
		}
	}
};