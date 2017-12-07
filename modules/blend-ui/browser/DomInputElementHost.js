"use strict";

/**
 * @mixin $ui.DomInputElementHost
 * @extends $widget.DomWidget
 * @extends $ui.InputElementHost
 * @extends $ui.DomInputEventBound
 */
$ui.DomInputElementHost = $oop.createClass('$ui.DomInputElementHost')
.blend($widget.DomWidget)
.blend($ui.InputElementHost)
.blend($ui.DomInputEventBound)
.build();

$ui.InputElementHost
.forwardBlend($ui.DomInputElementHost, $utils.isBrowser);
