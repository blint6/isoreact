import JedisClass from './class';

class Jedis {
    constructor(options) {
        options = options || {};

        this.io = options.io;
        this.bundle = options.bundler;
        this.resolving = {};
        this.page = {
            scripts: (options.page && options.page.scripts) || []
        };

        this.components = {};
        (options.components || []).forEach(req => this.get(req));
    }

    get(name) {
        let component = this.components[name];

        if (!component) {
            if (this.resolving[name]) {
                throw Error(`Circular dependency: ${name} is already being resolved`);
            }

            this.resolving[name] = true;

            component = require(name);
            this.components[name] = component;

            if (typeof component.server === 'string') {
                component.server = require(component.server);
            }
            if (typeof component.server === 'function') {
                component.server = component.server(this);
            } else {
                component.server = undefined;
            }

            if (typeof component.client !== 'string') {
                component.client = undefined;
            }

            delete this.resolving[name];
        }

        return component;
    }
}

Jedis.createClass = function createClass(attrs) {
    return Object.create(JedisClass, attrs);
};

export default Jedis;
