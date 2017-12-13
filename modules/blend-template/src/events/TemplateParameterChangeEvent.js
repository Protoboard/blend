"use strict";

/**
 * @function $template.TemplateParameterChangeEvent.create
 * @returns {$template.TemplateParameterChangeEvent}
 */

/**
 * @class $template.TemplateParameterChangeEvent
 * @extends $event.Event
 */
$template.TemplateParameterChangeEvent = $oop.createClass('$template.TemplateParameterChangeEvent')
.blend($event.Event)
.build();

/**
 * @member {Object} $template.TemplateParameterChangeEvent#parameterValuesBefore
 */

/**
 * @member {Object} $template.TemplateParameterChangeEvent#parameterValuesAfter
 */

$event.Event
.forwardBlend($template.TemplateParameterChangeEvent, function (properties) {
  return $utils.matchesPrefix(properties.eventName, 'template.change.parameter');
});
