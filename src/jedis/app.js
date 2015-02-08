class Jedis {
    constructor(options) {
        options = options || {};

        this.io = options.io;
        this.bundle = options.bundler;
        this.scripts = [];
        this.page = {
            scripts: (options.page && options.page.scripts) || []
        };

        this.components = (options.components || [])
            .map(req => require(req))
            .map((component) => {
                let server = component.server,
                    client = component.client;

                if (typeof server === 'string') {
                    component.server = require(server);
                }
                if (typeof server === 'function') {
                    server(this);
                } else {
                    server = undefined;
                }

                if (typeof client === 'string') {
                    this.scripts.push(client);
                } else {
                    client = undefined;
                }

                return {
                    server, client
                };
            });
    }
}

export default Jedis;
