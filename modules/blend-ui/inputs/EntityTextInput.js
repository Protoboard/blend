"use strict";

/**
 * @function $ui.EntityTextInput.create
 * @returns {$ui.EntityTextInput}
 */

/**
 * @class $ui.EntityTextInput
 * @extends $ui.TextInput
 * @mixes $ui.EntityInputValueHost
 */
$ui.EntityTextInput = $oop.createClass('$ui.EntityTextInput')
.blend($ui.TextInput)
.blend($ui.EntityInputValueHost)
.build();
