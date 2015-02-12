function JedisComponent(componentClass, props) {
    this.class = componentClass;
    this.props = props || {};
    this.props.children = [];
}

JedisComponent.prototype._handleState = function (state) {
    if (typeof this.class.handleState === 'function')
        return this.class.handleState.call(this, state);
}

let comparePaths = function (a, b) {
    let aSplit = a.split(/\//g),
        bSplit = b.split(/\//g);

    while (aSplit.length > 0 && bSplit.length > 0) {
        let i = aSplit.shift(),
            j = bSplit.shift();

        if (i < j) return -1;
        if (i > j) return 1;
    }

    if (aSplit.length) return -1;
    if (bSplit.length) return 1;
};

function Jedis(index) {
    this.component = {
        index: index,
        path: {}
    };

    let orderedKeys = Object.keys(index).sort(comparePaths);
    this.component.tree = index[orderedKeys.shift()];

    orderedKeys.forEach(path => {
        let pSplit = path.split(/\//g);
        if (pSplit.length < 3) return;

        pSplit.shift();
        pSplit.shift();
        let p = parseInt(pSplit.shift()),
            node = this.component.tree;

        // Walk the tree to the appropriate leaf (corresponding to path)
        while (pSplit.length > 1) {
            node = node.children[p];
            p = parseInt(pSplit.shift());

            if (!node) throw Error('Invalid index: found holes in the tree');
        }

        node.children.push(index[path]);
        this.component.path[index[path]] = path;
    });
}

Jedis.prototype.render = function () {
    let j = function (name, props, children) {
        let el = document.createElement(name);
        (children || []).forEach(child => el.appendChild(child));
        return el;
    };

    return this.component.tree.class.render(j);
}


module.exports = {
    createApp: function (index) {
        return new Jedis(index);
    },

    createComponent: function createComponent(componentClass, props) {
        return new JedisComponent(componentClass, props);
    }
};
