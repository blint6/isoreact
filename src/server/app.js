import fs from 'vinyl-fs';
import Stream from 'stream';
import through from 'through2';
import template from 'lodash.template';
import browserify from 'browserify';

export default function (io, workdir, compnts) {
    let ns = io.of('/com'),
        required = compnts.map(req => require(req)),
        clientComponents = [];

    components = required.map((component, i) => {
        let server = component.server,
            client = component.client;

        if (typeof server === 'string') {
            component.server = require(server);
        }
        if (typeof server === 'function') {
            server(io.of('c' + i));
        } else {
            server = undefined;
        }

        if (typeof client !== 'string') {
            client = undefined;
        }

        return {
            server, client
        };
    });

    fs.src(__dirname + '/template/bundle.js.tpt')
        .pipe(through.obj(function (file, enc, cb) {

            file.path = 'bundle.js';
            let buf = new Stream.Buffer(4000);

            if (file.isBuffer()) {
                cb('dun want no buffer!');
            }
            if (file.isStream()) {
                file.contents.on('data', chunk => buf.write(chunk));
                file.contents.on('end', () => {
                    file.contents = new Buffer(template(buf.toString()));
                    cb(null, file);
                });
                file.contents.on('error', cb);
            } else {
                cb(new Error('Template js bundle should be passed as a stream'));
            }
        }))
        .pipe(fs.dest(workdir + '/bundle'));

    browserify(workdir + '/bundle/bundle.js', {
            debug: true
        })
        .bundle()
        .pipe(fs.dest(workdir + '/serve'));
}
