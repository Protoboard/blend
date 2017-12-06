"use strict";

/**
 * @function $ui.PageChangeEvent.create
 * @returns {$ui.PageChangeEvent}
 */

/**
 * @class $ui.PageChangeEvent
 * @extends $event.Event
 */
$ui.PageChangeEvent = $oop.createClass('$ui.PageChangeEvent')
.blend($event.Event)
.build();

/**
 * @member {$ui.Page} $ui.PageChangeEvent#pageBefore
 */

/**
 * @member {$ui.Page} $ui.PageChangeEvent#pageAfter
 */

$event.Event
.forwardBlend($ui.PageChangeEvent, function (properties) {
  return $utils.matchesPrefix(properties.eventName, 'ui.page.change');
});
