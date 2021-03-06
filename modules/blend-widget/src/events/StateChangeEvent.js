"use strict";

/**
 * @function $widget.StateChangeEvent.create
 * @returns {$widget.StateChangeEvent}
 */

/**
 * @class $widget.StateChangeEvent
 * @extends {$event.Event}
 */
$widget.StateChangeEvent = $oop.createClass('$widget.StateChangeEvent')
.blend($event.Event)
.build();

/**
 * @member {string} $widget.StateChangeEvent#stateName
 */

/**
 * @member {*} $widget.StateChangeEvent#stateValueBefore
 */

/**
 * @member {*} $widget.StateChangeEvent#stateValueAfter
 */

$event.Event
.forwardBlend($widget.StateChangeEvent, function (properties) {
  return $utils.matchesPrefix(properties.eventName, 'widget.state.change');
});
