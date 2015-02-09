import JedisClass from './class';
import JedisComponent from './component';
import JedisSocketIo from './io/socket.io';

function applyTree(app, node) {
    node.io = app.io[app.defaultIo];

    if (node.server) {
        node.server();
    }

    node.props.children.forEach(child => applyTree(app, child));
    return node;
}

class Jedis {
    constructor(tree, options) {
        options = options || {};

        this.bundle = options.bundler;
        this.page = {
            scripts: (options.page && options.page.scripts) || []
        };
        this.io = {};

        let ioEngines = options.io || {};
        for (let name in ioEngines) {
            this.io[name] = ioEngines[name](this);
        }

        this.defaultIo = options.defaultIo || Object.keys(ioEngines)[0];
        this.tree = applyTree(this, tree);
    }
}

Jedis.createPage = function createPage(tree, options) {
    return new Jedis(tree, options);
};

Jedis.createClass = function createClass(attrs) {
    return new JedisClass(attrs);
};

Jedis.createElement = function createElement(component, props, ...children) {
    let element = new JedisComponent(component);
    element.props = props || {};
    element.props.children = children || [];
    return element;
};

Jedis.engine = {
    io: JedisSocketIo
};

export default Jedis;
