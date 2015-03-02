import express from 'express';

export function singlepage(app, template, options) {
    options = options || {};

    let root = '/script/',
        base = options.base || process.cwd(),
        router = options.router || express.Router({
            strict: true
        }),
        scripts = [];

    (app.page && app.page.scripts || []).forEach(script => {
        let scriptPath, i = 0;

        // Extract the script path from the specified base if possible or from file name
        if (base && script.indexOf(base) === 0) {
            scriptPath = script.substring(options.base.length);
        } else {
            scriptPath = script.substring(script.lastIndexOf('/') + 1);
        }

        scriptPath = root + scriptPath;

        // If this path already exists, add arbitrary number
        while (scripts.indexOf(scriptPath) > -1) {
            let basename = scriptPath.substring(0, scriptPath.lastIndexOf('.')),
                extension = scriptPath.lastIndexOf('.') > -1 ? scriptPath.substring(scriptPath.lastIndexOf('.')) : '';
            scriptPath = `${basename}.${i}${extension}`;
            i += 1;
        }

        scripts.push(scriptPath);
        router.use(scriptPath, express.static(script));
    });

    let locals = options.locals || {};
    locals.scripts = locals.scripts ? scripts.concat(locals.scripts) : scripts;

    router.use('/', function (req, res) {
        res.render(template, locals);
    });

    return router;
}
