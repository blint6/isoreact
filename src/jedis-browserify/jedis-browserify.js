import fs from 'fs';
import mkdirp from 'mkdirp';
import {
    Promise
}
from 'es6-promise';
import template from 'lodash.template';
import browserify from 'browserify';

export default function browserifyBundler(app, options = {}) {
    let workdir = options.workdir,
        media = options.media || 'default',
        variable = options.variable || 'jedisApp',
        bundleDir = workdir + '/bundle/',
        bundleFile = bundleDir + 'bundle.js',
        serveDir = workdir + '/serve/',
        serveFile = serveDir + 'bundle.js';

    mkdirp.sync(bundleDir);
    mkdirp.sync(serveDir);

    let jsBundle = template(fs.readFileSync(__dirname + '/bundle.js.tpt'))({
        jedis: require.resolve('jedis/client.js'),
        media: media,
        components: app.component.index,
        io: {
            ns: '/'
        }
    });

    fs.writeFileSync(bundleFile, jsBundle);

    return new Promise((resolve, reject) => {
        let writeStream = fs.createWriteStream(serveFile);
        browserify(bundleFile, {
                debug: true,
                standalone: variable
            })
            .bundle()
            .pipe(writeStream);
        writeStream.on('finish', () => resolve(serveFile));
        writeStream.on('error', err => reject(err));
    });
}
