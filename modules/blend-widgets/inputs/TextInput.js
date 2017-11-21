"use strict";

/**
 * @function $widgets.TextInput.create
 * @returns {$widgets.TextInput}
 */

/**
 * @class $widgets.TextInput
 * @extends $widget.Widget
 * @extends $widgets.Inputable
 * @extends $widgets.Disableable
 * @extends $widgets.Focusable
 */
$widgets.TextInput = $oop.getClass('$widgets.TextInput')
.blend($widget.Widget)
.blend($oop.getClass('$widgets.Inputable'))
.blend($oop.getClass('$widgets.Disableable'))
.blend($oop.getClass('$widgets.Focusable'));
