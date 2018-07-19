"use strict";

/**
 * @function $session.ActiveSessionChangeEvent.create
 * @param {Object} [properties]
 * @param {string} properties.eventName
 * @param {string} properties.activeSessionBefore
 * @param {string} properties.activeSessionAfter
 * @returns {$session.ActiveSessionChangeEvent}
 */

/**
 * @class $session.ActiveSessionChangeEvent
 * @extends $event.Event
 */
$session.ActiveSessionChangeEvent = $oop.createClass('$session.ActiveSessionChangeEvent')
.blend($event.Event)
.build();

/**
 * @member {string} $session.ActiveSessionChangeEvent#activeSessionBefore
 */

/**
 * @member {string} $session.ActiveSessionChangeEvent#activeSessionAfter
 */

/**
 * @member {$utils.Promise} $session.ActiveSessionChangeEvent#promise
 */

$event.Event
.forwardBlend($session.ActiveSessionChangeEvent, function (properties) {
  var eventName = properties.eventName;
  return $utils.matchesPrefix(eventName, 'session.change.active-session');
});
