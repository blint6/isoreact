let React = require('react');
let Col = require('react-bootstrap/lib/Col');

module.exports = {
	react: {
		render: function(cpt) {
			return React.createElement(Col, cpt.props, this.props.children);
		}
	}
};