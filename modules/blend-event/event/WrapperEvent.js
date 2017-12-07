"use strict";

/**
 * @function $event.WrapperEvent#create
 * @param {Object} properties
 * @param {string} properties.eventName
 * @returns {$event.WrapperEvent}
 */

/**
 * Wraps events that are not based on `$event.Event`, eg. DOM events. The
 * primary purpose of wrapping such events is to include them on the causal
 * trail of events without contaminating native event objects with
 * undocumented properties.
 * @class $event.WrapperEvent
 * @extends $event.Event
 * @extends $event.Wrapper
 * @example
 * window.addEventListener('click', function (event) {
 *   var clickWrapper = $event.WrapperEvent.fromEventName('clickWrapper')
 *   .wrap(event);
 *   $event.EventTrail.create().push(clickWrapper);
 * });
 */
$event.WrapperEvent = $oop.createClass('$event.WrapperEvent')
.blend($event.Event)
.blend($event.Wrapper)
.build();

/**
 * @function $event.WrapperEvent.fromEventName
 * @param {string} eventName
 * @returns {$event.WrapperEvent}
 */
