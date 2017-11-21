"use strict";

/**
 * @function $widgets.Button.create
 * @returns {$widgets.Button}
 */

/**
 * @class $widgets.Button
 * @extends $widget.Widget
 * @mixes $widgets.Clickable
 * @mixes $widgets.Disableable
 */
$widgets.Button = $oop.getClass('$widgets.Button')
.blend($widget.Widget)
.blend($oop.getClass('$widgets.Clickable'))
.blend($oop.getClass('$widgets.Disableable'))
.blend($oop.getClass('$widgets.Focusable'));
