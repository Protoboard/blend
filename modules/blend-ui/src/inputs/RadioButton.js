"use strict";

/**
 * @function $ui.RadioButton.create
 * @param {Object} [properties]
 * @param {string} [properties.nodeName]
 * @param {*} [properties.ownValue]
 * @param {boolean} [properties.state.selected]
 * @returns {$ui.RadioButton}
 */

/**
 * @class $ui.RadioButton
 * @extends $widget.Widget
 * @mixes $ui.Selectable
 */
$ui.RadioButton = $oop.createClass('$ui.RadioButton')
.blend($widget.Widget)
.blend($ui.Selectable)
.build();
