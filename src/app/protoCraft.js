let Jedis = require('jedis');
let Grid = require('Bootstrap/Grid');
let Row = require('Bootstrap/Row');
let Col = require('Bootstrap/Col');
let ProtoBanner = require('ProtoBanner');
let ProtoTitle = require('ProtoBanner/ProtoTitle');
let ProtoMenu = require('ProtoMenu');
let ProtoMenuItem = require('ProtoMenu/ProtoMenuItem');
let Clock = require('clock/frenchClock');

// -- Create component tree --

// Banner
let banner = Jedis.createComponent(ProtoBanner, null,
    Jedis.createComponent(ProtoTitle, {
        title: 'Jedis with <3'
    }));
let clock = Jedis.createComponent(Clock);

// Menu
let menu = Jedis.createComponent(ProtoMenu, null,
    Jedis.createComponent(ProtoMenuItem, {
        href: 'chat',
        label: 'Chat'
    }),
    Jedis.createComponent(ProtoMenuItem, {
        href: 'stats',
        label: 'Statistics'
    })
);

// Layout
let layout = Jedis.createComponent(Grid, null,
    Jedis.createComponent(Row, null,
        Jedis.createComponent(Col, {
            md: 12
        }, banner)),
    Jedis.createComponent(Row, null,
        Jedis.createComponent(Col, {
            md: 3
        }, menu),
        Jedis.createComponent(Col, {
            md: 9
        }, clock))
);

// Use contexts
let clockCtx = clock.context();
setInterval(() => clockCtx.handleState(), 1000);

module.exports = Jedis.createPage(layout, {});