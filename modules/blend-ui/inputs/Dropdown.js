"use strict";

/**
 * @function $ui.Dropdown.create
 * @param {Object} [properties]
 * @param {string} [properties.nodeName]
 * @param {*} [properties.inputValue]
 * @returns {$ui.Dropdown}
 */

/**
 * @class $ui.Dropdown
 * @extends $widget.Widget
 * @extends $ui.Inputable
 * @extends $ui.Validatable
 * @extends $ui.SelectableHost
 * @mixes $ui.SingleSelect
 */
$ui.Dropdown = $oop.getClass('$ui.Dropdown')
.blend($widget.Widget)
.blend($oop.getClass('$ui.Inputable'))
.blend($oop.getClass('$ui.Validatable'))
.blend($oop.getClass('$ui.SingleSelect'));
