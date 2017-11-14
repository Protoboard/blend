"use strict";

/**
 * @function $api.ApiEvent.create
 * @param {Object} properties
 * @param {string} properties.eventName
 * @param {$api.Request} properties.request
 * @param {$api.Response} properties.response
 * @returns {$api.ApiEvent}
 */

/**
 * @class $api.ApiEvent
 * @extends $event.Event
 */
$api.ApiEvent = $oop.getClass('$api.ApiEvent')
.blend($event.Event);

/**
 * @member {$api.Request} $api.ApiEvent#request
 */

/**
 * @member {$api.Response} $api.ApiEvent#response
 */

/**
 * @member {$utils.Thenable} $api.ApiEvent#promise
 */

$event.Event
.forwardBlend($api.ApiEvent, function (properties) {
  var eventName = properties && properties.eventName;
  return $utils.matchesPrefix(eventName, 'api');
});
