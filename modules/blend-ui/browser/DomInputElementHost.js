"use strict";

/**
 * @mixin $ui.DomInputElementHost
 * @extends $widget.DomWidget
 * @extends $ui.InputElementHost
 * @extends $ui.DomInputEventHost
 */
$ui.DomInputElementHost = $oop.getClass('$ui.DomInputElementHost')
.blend($widget.DomWidget)
.blend($oop.getClass('$ui.InputElementHost'))
.blend($oop.getClass('$ui.DomInputEventHost'));

$oop.getClass('$ui.InputElementHost')
.forwardBlend($ui.DomInputElementHost, function () {
  return $utils.isBrowser();
});
