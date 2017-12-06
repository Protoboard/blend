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
$ui.Button = $oop.createClass('$ui.Button')
.blend($widget.Widget)
.blend($ui.Clickable)
.blend($ui.Disableable)
.blend($ui.Focusable)
.build();
