"use strict";

/**
 * @function $widgets.PageChangeEvent.create
 * @returns {$widgets.PageChangeEvent}
 */

/**
 * @class $widgets.PageChangeEvent
 * @extends $event.Event
 */
$widgets.PageChangeEvent = $oop.getClass('$widgets.PageChangeEvent')
.blend($event.Event);

/**
 * @member {$widgets.Page} $widgets.PageChangeEvent#pageBefore
 */

/**
 * @member {$widgets.Page} $widgets.PageChangeEvent#pageAfter
 */

$event.Event
.forwardBlend($widgets.PageChangeEvent, function (properties) {
  return $utils.matchesPrefix(properties.eventName, 'widgets.page.change');
});
