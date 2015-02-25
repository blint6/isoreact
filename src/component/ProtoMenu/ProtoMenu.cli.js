let React = require('react');
let Nav = require('react-bootstrap/lib/Nav');

module.exports = {

	react: {

		componentDidMount: function() {
			let node = this.getDOMNode(),
				style = node.style;

			style.width = '15%';
		},

		render: function() {
			return (<Nav bsStyle="pills" stacked>{this.props.children}</Nav>);
		}
	}
};