import fs from 'fs';
import mkdirp from 'mkdirp';
import {
    Promise
}
from 'es6-promise';
import template from 'lodash.template';
import browserify from 'browserify';

export default function browserifyBundler(app, options) {
    let workdir = options,
        bundleDir = workdir + '/bundle/',
        bundleFile = bundleDir + 'bundle.js',
        serveDir = workdir + '/serve/',
        serveFile = serveDir + 'bundle.js';

    // Include bundle in page's scripts
    if (app.page.scripts.indexOf(serveFile) < 0) {;
        app.page.scripts.push(serveFile);
    }

    mkdirp.sync(bundleDir);
    mkdirp.sync(serveDir);

    let clientScripts = Object.keys(app.components).map(c => app.components[c].client),
        jsBundle = template(fs.readFileSync(__dirname + '/bundle.js.tpt'))({
            components: clientScripts,
            io: {
                ns: app.io.name === undefined ? '/' : app.io.name
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
