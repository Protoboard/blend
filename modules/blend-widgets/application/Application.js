"use strict";

/**
 * @function $widgets.Application.create
 * @returns {$widgets.Application}
 */

/**
 * @class $widgets.Application
 * @extends $widget.RootWidget
 * @extends $widgets.RouteBound
 */
$widgets.Application = $oop.getClass('$widgets.Application')
.blend($widget.RootWidget)
.blend($oop.getClass('$widgets.RouteBound'));
