"use strict";

/**
 * @function $ui.EntityTextInput.create
 * @returns {$ui.EntityTextInput}
 */

/**
 * @class $ui.EntityTextInput
 * @extends $ui.TextInput
 * @mixes $ui.EntityInputable
 */
$ui.EntityTextInput = $oop.createClass('$ui.EntityTextInput')
.blend($ui.TextInput)
.blend($ui.EntityInputable)
.build();
