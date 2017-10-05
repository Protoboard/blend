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
.mix($event.Event);

/**
 * @member {Object} $template.TemplateParameterChangeEvent#parameterValuesBefore
 */

/**
 * @member {Object} $template.TemplateParameterChangeEvent#parameterValuesAfter
 */

$oop.getClass('$event.Event')
.forwardTo($template.TemplateParameterChangeEvent, function (properties) {
  return $utils.matchesPrefix(properties.eventName, 'template.change.parameter');
});
