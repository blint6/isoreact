import Promise from 'es6-promise';
import JedisClass from './class';
import JedisComponent from './component';
import JedisElement from './element';

function applyTree(app, node) {
    node.io = app.io[app.defaultIo];

    if (node.server && typeof node.server === 'function') {
        node.server(app);
    }

    // Rregister resources
    if (node.resource) {
        for (let res in node.resource) {
            app.page[res] = (app.page[res] || []).concat(node.resource[res]);
        }
    }

    node.props.children.forEach(child => applyTree(app, child));
    return node;
}

class Jedis {
    constructor(tree, options) {
        options = options || {};

        this.page = {
            scripts: (options.page && options.page.scripts) || []
        };
        this.index = {};
        this.tree = applyTree(this, tree); // TODO MAKE THIS ONE CREATE COMPONENTS PATH
    }

    handlePayload(payload) {
        let path = payload.path,
            context = payload.context,
            component = this.index[path];

        if (component) {
            if (typeof component.handlePayload === 'function') {
                // Handle state to set it for the current context
                // context could have a .state, .clientId, .room ...
                return Promise.resolve(component.handleUpdate(context));
                // If component.handleUpdate calls a this.setState(newState),
                // this shall trigger its bound io(s) (if any) to update its related views
            }
        } else {
            console.log('WARN', `App has no component at path ${path}`);
        }
    }
}

Jedis.createPage = function createPage(tree, options) {
    return new Jedis(tree, options);
};

Jedis.createComponent = function createComponent(componentClass, props, ...children) {
    let component = new JedisComponent(componentClass);
    component.props = props || {};
    component.props.children = children || [];

    return component;
};

Jedis.element = function j(element, attrs, ...children) {
    return new JedisElement(element, attrs, children);
};

export default Jedis;
