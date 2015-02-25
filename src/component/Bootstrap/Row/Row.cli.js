let React = require('react');
let Row = require('react-bootstrap/lib/Row');

module.exports = {
	react: {
		render: function() {
			return (<Row>{this.props.children}</Row>);
		}
	}
};