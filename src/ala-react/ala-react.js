let React = require('react');
let extend = require('extend');

let defaultRender = function() {
    return React.createElement('div', null, this.props.children);
};

let checkReactProps = function(component) {
    if (!component.hasOwnProperty('_react')) {
        component._react = {
            // React tree may differ from components tree a little
            children: component.children.slice()
        };

        let reactDef = component.react || {};
        component.react = {
            render: defaultRender,
        };
        extend(true, component.react, reactDef);

        component._react.userRender = component.react.render;
    }
};

let createClassRecursive = function(component) {
    component._mixinCall('ala-react', '_createReactClass');
    component.children.forEach(child => createClassRecursive(child));
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

            let component = this,
                childrenElements = (() => this._react.children.map(child => React.createElement(child._react.managerClass)));

            // Decorate component defined react properties
            this.react.getInitialState = this.react.getInitialState || function() {
                return component.state;
            };

            this.react.render = function() {
                component._react.composite = this;
                return component._react.userRender.call(this, component);
            };

            // Define inner _react properties
            this._react.userClass = React.createClass(this.react);
            this._react.managerClass = React.createClass({
                render: () => {
                    let elementArgs = [this._react.userClass, this.props].concat(childrenElements());
                    return React.createElement.apply(React, elementArgs);
                }
            });

            return this.react.managerClass;
        },
    }
};