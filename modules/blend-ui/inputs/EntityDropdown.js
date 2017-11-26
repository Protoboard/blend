"use strict";

/**
 * @function $ui.EntityDropdown.create
 * @returns {$ui.EntityDropdown}
 */

/**
 * @class $ui.EntityDropdown
 * @extends $ui.Dropdown
 * @extends $ui.EntityInputable
 */
$ui.EntityDropdown = $oop.getClass('$ui.EntityDropdown')
.blend($oop.getClass('$ui.Dropdown'))
.blend($oop.getClass('$ui.EntityInputable'));
