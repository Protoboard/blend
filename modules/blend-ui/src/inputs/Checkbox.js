"use strict";

/**
 * @function $ui.Checkbox.create
 * @param {Object} [properties]
 * @param {string} [properties.nodeName]
 * @param {*} [properties.ownValue]
 * @param {boolean} [properties.state.selected]
 * @returns {$ui.Checkbox}
 */

/**
 * @class $ui.Checkbox
 * @extends $widget.Widget
 * @mixes $ui.Selectable
 */
$ui.Checkbox = $oop.createClass('$ui.Checkbox')
.blend($widget.Widget)
.blend($ui.Selectable)
.build();
