"use strict";

/**
 * @function $widgets.LocaleText.create
 * @returns {$widgets.LocaleText}
 */

/**
 * @class $widgets.LocaleText
 * @extends $widgets.Text
 * @mixes $widgets.LocaleBound
 */
$widgets.LocaleText = $oop.getClass('$widgets.LocaleText')
.blend($oop.getClass('$widgets.Text'))
.blend($oop.getClass('$widgets.LocaleBound'));
