let React = require('react');
let Router = require('react-router');
let Route = Router.Route;
let DefaultRoute = Router.DefaultRoute;
let extend = require('extend');

function routesOf(comp) {
    comp._mixinCall('ala-react', '_createReactClass');
    let routeDef = comp.props.route;
    let childRoutes = [];

    // Deep first tree generation
    comp.children.forEach(child => childRoutes = childRoutes.concat(routesOf(child)));

    if (routeDef) {
        // Wrap react class in a one that bundles props and children directly (because of react-router structure)
        let routeType = routeDef.type || 'Route',
            routeClass = Router[routeType],
            childClasses = [];

        comp.children.forEach(child => {
            let childRoute = child.props.route;
            if (!childRoute || (childRoute.type !== 'Route' && childRoute.type !== 'DefaultRoute'))
                childClasses.push(child);
        });

        // Remove from the React-tree children that are routed
        comp._react.children = childClasses;

        let props = extend({
            handler: comp._react.managerClass
        }, routeDef);

        console.debug('Setting route type', routeType, 'to', comp.id, ':', props);
        return [React.createElement.apply(React, [routeClass, props].concat(childRoutes))];
    }

    return childRoutes;
}

module.exports = {

    name: 'ala-react-router',

    app: {
        render: function() {
            let routes = routesOf(this.component.root);

            if (!routes.length) {
                throw Error('No routes found in component tree');
            }
            if (routes.length > 1) {
                console.log('WARN', 'Multiple root routes found, only considering first found');
            }

            return Router.run(routes[0], function(Handler) {
                React.render(React.createElement(Handler), document.body);
            });
        }
    },
};