"use strict";

/**
 * @function $ui.RadioButton.create
 * @param {Object} [properties]
 * @param {string} [properties.nodeName]
 * @param {*} [properties.ownValue]
 * @param {boolean} [properties.isSelected]
 * @returns {$ui.RadioButton}
 */

/**
 * @class $ui.RadioButton
 * @extends $widget.Widget
 * @mixes $ui.Selectable
 */
$ui.RadioButton = $oop.getClass('$ui.RadioButton')
.blend($widget.Widget)
.blend($oop.getClass('$ui.Selectable'));
