import fs from 'fs';
import mkdirp from 'mkdirp';
import {
    Promise
}
from 'es6-promise';
import template from 'lodash.template';
import browserify from 'browserify';

function browserifyBundler() {
    let workdir = this.bundlerOptions,
        bundleDir = workdir + '/bundle/',
        bundleFile = bundleDir + 'bundle.js',
        serveDir = workdir + '/serve/',
        serveFile = serveDir + 'bundle.js';

    mkdirp.sync(bundleDir);
    mkdirp.sync(serveDir);

    let jsBundle = template(fs.readFileSync(__dirname + '/bundle.js.tpt'))({
        components: this.scripts,
        io: {
            ns: this.io.name === undefined ? '/' : this.io.name
        }
    });

    fs.writeFileSync(bundleFile, jsBundle);

    return new Promise((resolve, reject) => {
        let writeStream = fs.createWriteStream(serveFile);
        browserify(bundleFile, {
                debug: true
            })
            .bundle()
            .pipe(writeStream);
        writeStream.on('finish', () => resolve(serveFile));
        writeStream.on('error', err => reject(err));
    });
}

class Jedis {
    constructor(io, compnts, options) {
        let required = compnts.map(req => require(req));

        this.io = io;
        this.bundlerOptions = options;
        this.bundle = browserifyBundler;
        this.scripts = [];

        this.components = required.map((component) => {
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
