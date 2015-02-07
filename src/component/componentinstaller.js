let components = ['clock'];

function install() {
    let args = Array.prototype.slice.call(arguments, 0),
        mapping = args.shift();

    components.map(mapping).forEach(name => {
        let component = require(name);

        if (component.install) {
            component.install.apply(undefined, args);
        }
    });
}

module.exports = {
    components, install
};
