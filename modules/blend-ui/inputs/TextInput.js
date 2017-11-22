"use strict";

/**
 * @function $ui.TextInput.create
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
 * @member {boolean} $ui.TextInput#isMultiline
 */
