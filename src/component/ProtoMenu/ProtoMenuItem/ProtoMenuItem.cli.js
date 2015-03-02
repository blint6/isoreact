let React = require('react');
let NavItemLink = require('react-router-bootstrap/lib/NavItemLink');

module.exports = {
	react: {
		render: function() {
			return (<NavItemLink to={this.props.to}>{this.props.label}</NavItemLink>);
		}
	}
};