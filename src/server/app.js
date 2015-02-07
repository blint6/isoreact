import fs from 'fs';
import yl from 'vinyl-fs';
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

    let jsBundle = template(fs.readFileSync(__dirname + '/template/bundle.js.tpt'))({
        components: scripts
    });

    fs.writeFileSync(bundleFile, jsBundle);

    return new Promise((resolve, reject) => {
        browserify(bundleFile, {
                debug: true
            })
            .bundle()
            .pipe(fs.createWriteStream(serveFile))
            .on('end', err => err ? resolve(serveFile) : reject(err));
    });


    /*
        return new Promise((resolve, reject) => {
                fs.src()
                    .pipe(through.obj(function (file, enc, cb) {

                        file.path = 'bundle.js';

                        if (file.isBuffer()) {
                            let jsBundle = template(file.contents.toString())({
                                components: scripts
                            });

                            file.contents = new Stream.Readable();
                            file.contents.push(jsBundle);
                            file.contents.push(null);
                            cb(null, file);
                        } else {
                            cb(new Error('Template js bundle should be passed as a buffer'));
                        }
                    }))
                    .pipe(fs.dest(workdir + '/bundle'))
                    .on('end', err => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
            })
            .then(() => {
                browserify(bundleFile, {
                        debug: true
                    })
                    .bundle()
                    .pipe(fs.dest(workdir + '/serve'));
            });
    */
}
