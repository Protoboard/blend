"use strict";

/**
 * @class $ui.SelectableOwnValueChangeEvent
 * @extends $event.Event
 */
$ui.SelectableOwnValueChangeEvent = $oop.createClass('$ui.SelectableOwnValueChangeEvent')
.blend($event.Event)
.build();

/**
 * @member {$ui.Page} $ui.SelectableOwnValueChangeEvent#ownValueBefore
 */

/**
 * @member {$ui.Page} $ui.SelectableOwnValueChangeEvent#ownValueAfter
 */

$event.Event
.forwardBlend($ui.SelectableOwnValueChangeEvent, function (properties) {
  return $utils.matchesPrefix(properties.eventName, 'ui.selectable.ownValue.change');
});
