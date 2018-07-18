"use strict";

/**
 * @function $session.SessionStateChangeEvent.create
 * @param {Object} [properties]
 * @param {string} properties.eventName
 * @param {string} properties.sessionStateBefore
 * @param {string} properties.sessionStateAfter
 * @param {$utils.Promise} [properties.promise]
 * @returns {$session.SessionStateChangeEvent}
 */

/**
 * @class $session.SessionStateChangeEvent
 * @extends $event.Event
 */
$session.SessionStateChangeEvent = $oop.createClass('$session.SessionStateChangeEvent')
.blend($event.Event)
.build();

/**
 * @member {string} $session.SessionStateChangeEvent#sessionStateBefore
 */

/**
 * @member {string} $session.SessionStateChangeEvent#sessionStateAfter
 */

/**
 * @member {$utils.Promise} $session.SessionStateChangeEvent#promise
 */

$event.Event
.forwardBlend($session.SessionStateChangeEvent, function (properties) {
  var eventName = properties.eventName;
  return $utils.matchesPrefix(eventName, 'session.change.session-state');
});
