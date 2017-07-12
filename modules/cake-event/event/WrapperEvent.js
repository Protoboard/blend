"use strict";

/**
 * @function $event.WrapperEvent#create
 * @param {string} eventName
 * @returns {$event.WrapperEvent}
 */

/**
 * Wraps events that are not based on `$event.Event`, eg. DOM events.
 * @class $event.WrapperEvent
 * @extends $event.Event
 * @extends $event.Wrapper
 */
$event.WrapperEvent = $oop.getClass('$event.WrapperEvent')
.mix($oop.getClass('$event.Event'))
.mix($oop.getClass('$event.Wrapper'));
