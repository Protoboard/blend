"use strict";

/**
 * @function $ui.EntityOption.create
 * @returns {$ui.EntityOption}
 */

/**
 * @class $ui.EntityOption
 * @extends $ui.EntityText
 * @extends $ui.Option
 * @extends $ui.EntitySelectable
 */
$ui.EntityOption = $oop.getClass('$ui.EntityOption')
.blend($oop.getClass('$ui.Option'))
.blend($oop.getClass('$ui.EntityText'))
.blend($oop.getClass('$ui.EntitySelectable'));
