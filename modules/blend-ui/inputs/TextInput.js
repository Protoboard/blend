"use strict";

/**
 * @function $ui.TextInput.create
 * @param {Object} [properties]
 * @param {string} [properties.nodeName]
 * @param {*} [properties.inputValue]
 * @param {boolean} [properties.state.focused]
 * @returns {$ui.TextInput}
 */

/**
 * @class $ui.TextInput
 * @extends $widget.Widget
 * @extends $ui.Inputable
 * @extends $ui.Validatable
 */
$ui.TextInput = $oop.createClass('$ui.TextInput')
.blend($widget.Widget)
.blend($ui.Inputable)
.blend($ui.Validatable)
.build();

/**
 * Determines whether TextInput is multi-line.
 * @member {boolean} $ui.TextInput#isMultiline
 */
