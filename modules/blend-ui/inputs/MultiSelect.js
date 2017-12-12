"use strict";

/**
 * @function $ui.MultiSelect.create
 * @param {Object} [properties]
 * @param {string} [properties.nodeName]
 * @param {Object} [properties.inputValues]
 * @returns {$ui.MultiSelect}
 */

/**
 * @class $ui.MultiSelect
 * @extends $widget.Widget
 * @extends $ui.InputValueHost
 * @extends $ui.Validatable
 * @extends $ui.SingleChoice
 */
$ui.MultiSelect = $oop.createClass('$ui.MultiSelect')
.blend($widget.Widget)
.blend($ui.InputValuesHost)
.blend($ui.Validatable)
.blend($ui.MultipleChoice)
.build();
