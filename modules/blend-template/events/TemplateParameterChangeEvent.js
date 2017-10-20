"use strict";

/**
 * @function $template.TemplateParameterChangeEvent.create
 * @returns {$template.TemplateParameterChangeEvent}
 */

/**
 * @class $template.TemplateParameterChangeEvent
 * @extends $event.Event
 */
$template.TemplateParameterChangeEvent = $oop.getClass('$template.TemplateParameterChangeEvent')
.blend($event.Event);

/**
 * @member {Object} $template.TemplateParameterChangeEvent#parameterValuesBefore
 */

/**
 * @member {Object} $template.TemplateParameterChangeEvent#parameterValuesAfter
 */

$oop.getClass('$event.Event')
.forwardBlend($template.TemplateParameterChangeEvent, function (properties) {
  return $utils.matchesPrefix(properties.eventName, 'template.change.parameter');
});