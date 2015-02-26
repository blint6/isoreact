let React = require('react');
let Nav = require('react-bootstrap/lib/Nav');

module.exports = {

	react: {

		render: function() {
			return (<Nav bsStyle="pills" stacked>{this.props.children}</Nav>);
		}
	}
};