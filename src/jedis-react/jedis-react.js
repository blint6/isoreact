let defaultRender = function(React) {
    return React.createElement('div', null, this.props.children);
};

module.exports = {

    _render: function() {

        let children = this.children.map(child => child._render());

        if (!this.render)
            this.render = defaultRender;

        if (!this.react) {
            let render = this.render,
                setComposite = (reactComposite => this.react.composite = reactComposite);

            this.react = {
                class: React.createClass({
                    getInitialState: function() {
                        return {};
                    },
                    render: function() {
                        setComposite(this);
                        return render.call(this, React);
                    }
                })
            };
        }

        this.react.element = React.createElement(this.react.class, this.props, children);

        return this.react.element;
    },

    _setState: function(state) {
        if (this.react && this.react.composite)
            this.react.composite.setState(state);
    }
};