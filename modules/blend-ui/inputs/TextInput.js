"use strict";

/**
 * @function $ui.TextInput.create
 * @param {Object} [properties]
 * @param {string} [properties.nodeName]
 * @param {*} [properties.inputValue]
 * @param {boolean} [properties.isFocused]
 * @returns {$ui.TextInput}
 */

/**
 * @class $ui.TextInput
 * @extends $widget.Widget
 * @extends $ui.Inputable
 * @extends $ui.Disableable
 * @extends $ui.Focusable
 */
$ui.TextInput = $oop.getClass('$ui.TextInput')
.blend($widget.Widget)
.blend($oop.getClass('$ui.Inputable'))
.blend($oop.getClass('$ui.Disableable'))
.blend($oop.getClass('$ui.Focusable'));

/**
 * Determines whether TextInput is multi-line.
 * @member {boolean} $ui.TextInput#isMultiline
 */
