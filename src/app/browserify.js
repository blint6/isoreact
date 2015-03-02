let bundle = require('../ala-browserify/ala-browserify');
let protoCraft = require('./protoCraft');

export default bundle(protoCraft.app, {
    workdir: './tmp/',
    jedis: {
        mixins: [
            require.resolve('../ala-react'),
            require.resolve('../ala-react-router')
        ],
    },
});