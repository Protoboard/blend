"use strict";

/**
 * @function $widget.RootWidget.create
 * @returns {$widget.RootWidget}
 */

/**
 * @class $widget.RootWidget
 * @extends $widget.Widget
 */
$widget.RootWidget = $oop.getClass('$widget.RootWidget')
.blend($oop.getClass('$widget.Widget'))
.blend($oop.Singleton);
