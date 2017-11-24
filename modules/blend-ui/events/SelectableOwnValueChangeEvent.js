"use strict";

/**
 * @class $ui.SelectableOwnValueChangeEvent
 * @extends $event.Event
 */
$ui.SelectableOwnValueChangeEvent = $oop.getClass('$ui.SelectableOwnValueChangeEvent')
.blend($event.Event);

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
