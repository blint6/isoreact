let bundle = require('../jedis-browserify/jedis-browserify');
let protoCraft = require('./protoCraft');

export default bundle(protoCraft.app, {
    workdir: './tmp/',
    jedis: {
        mixins: [
            require.resolve('../jedis-react'),
            require.resolve('../ala-react-router')
        ],
    },
});