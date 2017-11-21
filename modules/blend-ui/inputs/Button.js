"use strict";

/**
 * @function $ui.Button.create
 * @returns {$ui.Button}
 */

/**
 * @class $ui.Button
 * @extends $widget.Widget
 * @mixes $ui.Clickable
 * @mixes $ui.Disableable
 */
$ui.Button = $oop.getClass('$ui.Button')
.blend($widget.Widget)
.blend($oop.getClass('$ui.Clickable'))
.blend($oop.getClass('$ui.Disableable'))
.blend($oop.getClass('$ui.Focusable'));
