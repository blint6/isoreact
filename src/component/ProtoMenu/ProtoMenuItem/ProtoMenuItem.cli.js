let React = require('react');
let NavItem = require('react-bootstrap/lib/NavItem');

module.exports = {
	react: {
		render: function() {
			return (<NavItem key={this.props.href} href={this.props.href}>{this.props.label}</NavItem>);
		}
	}
};