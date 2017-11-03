"use strict";

/**
 * @function $router.RouteChangeEvent.create
 * @param {Object} properties
 * @param {string} properties.eventName
 * @returns {$router.RouteChangeEvent}
 */

/**
 * @class $router.RouteChangeEvent
 * @extends {$event.Event}
 */
$router.RouteChangeEvent = $oop.getClass('$router.RouteChangeEvent')
.blend($event.Event);

/**
 * @member {$router.Route} $router.RouteChangeEvent#routeBefore
 */

/**
 * @member {$router.Route} $router.RouteChangeEvent#routeAfter
 */

$event.Event
.forwardBlend($router.RouteChangeEvent, function (properties) {
  return properties &&
      $utils.matchesPrefix(properties.eventName, 'router.change.route');
});