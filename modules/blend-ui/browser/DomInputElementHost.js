"use strict";

/**
 * @mixin $ui.DomInputElementHost
 * @extends $widget.DomWidget
 * @extends $ui.InputElementHost
 * @extends $ui.DomInputEventBound
 */
$ui.DomInputElementHost = $oop.getClass('$ui.DomInputElementHost')
.blend($widget.DomWidget)
.blend($oop.getClass('$ui.InputElementHost'))
.blend($oop.getClass('$ui.DomInputEventBound'));

$oop.getClass('$ui.InputElementHost')
.forwardBlend($ui.DomInputElementHost, function () {
  return $utils.isBrowser();
});
