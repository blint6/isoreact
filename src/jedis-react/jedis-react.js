let Symbol = require('es6-symbol');
let React = require('react');

let sReact = Symbol('react'),
    sAla = Symbol('ala');
let defaultRender = function() {
    return React.createElement('div', null, this.props.children);
};

module.exports = {

    render: function() {

        let children = this.children.map(child => child.render());

        if (!this.react)
            this.react = {};

        if (!this.react.render)
            this.react.render = defaultRender;

        if (!this.react[sReact]) {
            let render = this.react.render,
                initialState = this.state,
                cptForRender = this,
                setComposite = (reactComposite => this.react[sReact].composite = reactComposite);

            this.react.getInitialState = this.react.getInitialState || function() {
                return initialState;
            };
            this.react.render = function() {
                setComposite(this);
                return render.call(this, cptForRender);
            };

            this.react[sReact] = {
                class: React.createClass(this.react)
            };
        }

        this.react[sReact].element = React.createElement(this.react[sReact].class, this.props, children);

        return this.react[sReact].element;
    },

    setState: function(state) {
        if (this.react && this.react[sReact] && this.react[sReact].composite)
            this.react[sReact].composite.setState(state);
    }
};