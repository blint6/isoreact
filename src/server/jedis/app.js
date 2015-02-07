import fs from 'fs';
import mkdirp from 'mkdirp';
import {
    Promise
}
from 'es6-promise';
import template from 'lodash.template';
import browserify from 'browserify';

export default function (io, workdir, compnts) {
    let ns = io.of('/com'),
        required = compnts.map(req => require(req)),
        scripts = [];

    let components = required.map((component) => {
        let server = component.server,
            client = component.client;

        if (typeof server === 'string') {
            component.server = require(server);
        }
        if (typeof server === 'function') {
            server(ns);
        } else {
            server = undefined;
        }

        if (typeof client === 'string') {
            scripts.push(client);
        } else {
            client = undefined;
        }

        return {
            server, client
        };
    });

    let bundleDir = workdir + '/bundle/',
        bundleFile = bundleDir + 'bundle.js',
        serveDir = workdir + '/serve/',
        serveFile = serveDir + 'bundle.js';

    mkdirp.sync(bundleDir);
    mkdirp.sync(serveDir);

    let jsBundle = template(fs.readFileSync(__dirname + '/bundle.js.tpt'))({
        components: scripts
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
