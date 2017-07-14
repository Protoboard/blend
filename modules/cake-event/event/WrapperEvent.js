"use strict";

/**
 * @function $event.WrapperEvent#create
 * @param {string} eventName
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
 *   var clickWrapper = $event.WrapperEvent.create('clickWrapper').wrap(event);
 *   $event.OriginalEventChain.create().push(clickWrapper);
 * });
 */
$event.WrapperEvent = $oop.getClass('$event.WrapperEvent')
.mix($oop.getClass('$event.Event'))
.mix($oop.getClass('$event.Wrapper'));
