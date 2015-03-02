let React = require('react');
let extend = require('extend');

let defaultRender = function() {
    return React.createElement('div', null, this.props.children);
};

let checkReactProps = function(obj) {
    if (!obj.hasOwnProperty('_react')) {
        obj._react = {
            // React tree may differ from components tree a little
            children: obj.children.slice()
        };

        let reactDef = obj.react || {};
        obj.react = {
            render: defaultRender,
        };
        extend(true, obj.react, reactDef);
    }
};

let createClassRecursive = function(obj) {
    obj._mixinCall('ala-react', '_createReactClass');
    obj.children.forEach(child => createClassRecursive(child));
};

module.exports = {

    name: 'ala-react',

    component: {
        render: function(options) {
            checkReactProps(this);

            if (!this._react.managerClass) {
                createClassRecursive(this);
            }

            this._react.element = React.createElement(this._react.managerClass);
            React.render(this._react.element, document.body);

            return this._react.element;
        },

        setState: function(state) {
            if (this._react && this._react.composite)
                this._react.composite.setState(state);
        },

        _createReactClass: function() {
            checkReactProps(this);

            let render = this.react.render,
                initialState = this.state,
                cptForRender = this,
                setComposite = (reactComposite => this._react.composite = reactComposite),
                childrenElements = (() => this._react.children.map(child => React.createElement(child._react.managerClass)));

            // Decorate component defined react properties
            this.react.getInitialState = this.react.getInitialState || function() {
                return initialState;
            };

            this.react.render = function() {
                setComposite(this);
                return render.call(this, cptForRender);
            };

            // Define inner _react properties
            this._react.userClass = React.createClass(this.react);
            this._react.managerClass = React.createClass({
                render: () => React.createElement.apply(React, [
                    this._react.userClass, this.props
                ].concat(childrenElements()))
            });

            return this.react.managerClass;
        },
    }
};