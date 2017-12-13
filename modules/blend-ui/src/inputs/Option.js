"use strict";

/**
 * @function $ui.Option.create
 * @param {Object} [properties]
 * @param {string} [properties.nodeName]
 * @param {string|$utils.Stringifiable} [properties.textContent]
 * @param {*} [properties.ownValue]
 * @returns {$ui.Option}
 */

/**
 * @class $ui.Option
 * @extend $widget.Widget
 * @extend $ui.Selectable
 */
$ui.Option = $oop.createClass('$ui.Option')
.blend($ui.Text)
.blend($ui.Selectable)
.build();
