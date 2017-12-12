"use strict";

/**
 * @function $ui.SingleSelect.create
 * @param {Object} [properties]
 * @param {string} [properties.nodeName]
 * @param {*} [properties.inputValue]
 * @returns {$ui.SingleSelect}
 */

/**
 * @class $ui.SingleSelect
 * @extends $widget.Widget
 * @extends $ui.Inputable
 * @extends $ui.Validatable
 * @extends $ui.SingleChoice
 */
$ui.SingleSelect = $oop.createClass('$ui.SingleSelect')
.blend($widget.Widget)
.blend($ui.Inputable)
.blend($ui.Validatable)
.blend($ui.SingleChoice)
.build();
