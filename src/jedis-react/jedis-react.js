module.exports = {

    _render: function() {

        if (!this.react) {
            let render = this.class.render,
                setComposite = (reactComposite => this.react.composite = reactComposite);

            this.react = {
                class: React.createClass({
                    getInitialState: function() {
                        return {};
                    },
                    render: function() {
                        setComposite(this);
                        return render.call(this, React.createElement);
                    }
                })
            };
        }

        let children = this.props.children.map(child => child.render());
        this.react.element = React.createElement(this.react.class, this.props, children);

        return this.react.element;
    },

    _setState: function(state) {
        if (this.react && this.react.composite)
            this.react.composite.setState(state);
    }
};