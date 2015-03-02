import fs from 'fs';
import mkdirp from 'mkdirp';
import {
    Promise
}
from 'es6-promise';
import template from 'lodash.template';
import browserify from 'browserify';

module.exports = function browserifyBundler(app, options = {}) {
    let workdir = options.workdir,
        media = options.media || 'default',
        variable = options.variable || 'jedisApp',
        bundleDir = workdir + '/bundle/',
        bundleFile = bundleDir + 'bundle.js',
        serveDir = workdir + '/serve/',
        serveFile = serveDir + 'bundle.js';

    let tRequire = path => 'require(\'' + path.replace(/\\/g, '\\\\').replace(/'/g, '\\\'') + '\')';
    let components = [];

    Object.keys(app.component.index).forEach(id => {
        let clientComponent = app.component.index[id].getClientResource(media);
        if (clientComponent.base)
            components.push({
                id: id,
                base: clientComponent.base,
                mixins: clientComponent.mixins
            });
    });

    mkdirp.sync(bundleDir);
    mkdirp.sync(serveDir);

    let jsBundle = template(fs.readFileSync(__dirname + '/bundle.js.tpt'))({
        tRequire: tRequire,
        jedis: require.resolve('jedis/client.js'),
        jedisOptions: options.jedis || {},
        components: components,
        tree: app.component.root,
        io: {
            ns: '/'
        },
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
};