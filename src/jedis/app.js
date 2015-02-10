let Promise = require('rsvp').Promise;
let JedisComponent = require('./component');
let JedisElement = require('./element');

function applyTree(app, node) {
    let path = '/';
    app.index[path] = node;

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

    push(payload) {
        let context = payload.context,
            component = this.index[payload.path];

        // TODO handle middlewares

        if (component) {
            return Promise.resolve(component.props.stateResolver.resolveState(context))
                .then(state => {
                    if (state === undefined)
                        return component.class.getInitialState() || {};
                    else
                        return state;
                })
                .then(state => component._handleState(state))
                .then(newState => {
                    if (newState !== undefined)
                        return Promise.resolve(component.props.stateResolver.setState(context, newState))
                            .then(() => ({
                                path: payload.path,
                                context: context,
                                state: newState
                            }));
                });
        } else {
            console.log('WARN', `App has no component at path ${payload.path}`);
            throw Error('No component found matching payload');
        }
    }
}

Jedis.createPage = function createPage(tree, options) {
    return new Jedis(tree, options);
};

Jedis.createComponent = function createComponent(componentClass, props, ...children) {
    return new JedisComponent(componentClass, props, children);
};

Jedis.element = function j(element, attrs, ...children) {
    return new JedisElement(element, attrs, children);
};

export default Jedis;
