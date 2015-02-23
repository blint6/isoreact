let defaultRender = function(React) {
    return React.createElement('div', null, this.props.children);
};

module.exports = {

    _render: function() {

        let children = this.children.map(child => child._render());

        if (!this.react)
            this.react = {};

        if (!this.react.render)
            this.react.render = defaultRender;

        if (!this.react._class) {
            let render = this.react.render,
                initialState = this.state,
                setComposite = (reactComposite => this.react._composite = reactComposite);

            this.react.getInitialState = this.react.getInitialState || function() {
                return initialState;
            };
            this.react.render = function() {
                setComposite(this);
                return render.call(this, React);
            };

            this.react._class = React.createClass(this.react);
        }

        this.react._element = React.createElement(this.react._class, this.props, children);

        return this.react._element;
    },

    _setState: function(state) {
        if (this.react && this.react._composite)
            this.react._composite.setState(state);
    }
};