"use strict";

/**
 * @function $ui.Option.create
 * @param {Object} [properties]
 * @param {string} [properties.nodeName]
 * @param {string|$utils.Stringifiable} [properties.textContent]
 * @member {*} [properties.ownValue]
 * @returns {$ui.Option}
 */

/**
 * @class $ui.Option
 * @extend $widget.Widget
 * @extend $ui.Selectable
 */
$ui.Option = $oop.getClass('$ui.Option')
.blend($oop.getClass('$ui.Text'))
.blend($oop.getClass('$ui.Selectable'));
