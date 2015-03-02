let Jedis = require('jedis');
let cc = Jedis.createComponent;
let DefaultRoute = require('../ala-react-router/lib/DefaultRoute');
let RouteHandler = require('../ala-react-router/lib/RouteHandler');

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
let banner = (
    cc(ProtoBanner, null,
        cc(ProtoTitle, {
            title: 'Jedis with <3'
        })
    ));
let clock = (
    cc(Clock, {
        route: {
            name: 'clock'
        }
    }));

// Menu
let menu = (
    cc(ProtoMenu, null,
        cc(ProtoMenuItem, {
            to: 'clock',
            label: 'Chat'
        }),
        cc(ProtoMenuItem, {
            to: 'clock',
            label: 'Statistics'
        })
    ));

// Layout
let layout = (
    cc(Grid, {
            route: {
                path: '/'
            }
        },
        cc(Row, null,
            cc(Col, {
                    md: 12
                },
                banner
            )
        ),
        cc(Row, null,
            cc(Col, {
                    md: 3
                },
                menu
            ),
            cc(Col, {
                    md: 9
                },
                clock,
                cc(RouteHandler)
            )
        )
    ));

module.exports.app = Jedis.createPage(layout, {});

module.exports.run = function() {
    // Use contexts
    let clockCtx = clock.context();
    setInterval(() => clockCtx.handleState(), 1000);
};