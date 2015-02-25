let React = require('react');

module.exports = {

	react: {

		layChildrenOut: function() {
			let children = this.getDOMNode().children;

			if (children.length) {
				for (let i = 0; i < children.length; i += 1) {
					children[i].style.float = 'left';
				}
			}
		},

		componentDidMount: function() {
			let node = this.getDOMNode(),
				style = node.style;

			style.height = 80;

			return this.layChildrenOut();
		},

		componentDidUpdate: function() {
			return this.layChildrenOut();
		},

		render: function() {
			return (<div id="protoBanner">{this.props.children}</div>);
		}
	}
};