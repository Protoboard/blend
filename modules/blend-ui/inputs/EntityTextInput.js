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
$ui.EntityTextInput = $oop.getClass('$ui.EntityTextInput')
.blend($oop.getClass('$ui.TextInput'))
.blend($oop.getClass('$ui.EntityInputable'));
