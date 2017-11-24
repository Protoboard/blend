"use strict";

/**
 * @mixin $ui.HtmlSingleSelect
 * @extends $widget.HtmlWidget
 * @mixes $ui.SingleSelectElementHost
 * @augments $ui.SingleSelect
 */
$ui.HtmlSingleSelect = $oop.getClass('$ui.HtmlSingleSelect')
.blend($widget.HtmlWidget)
.blend($oop.getClass('$ui.SingleSelectElementHost'))
.expect($oop.getClass('$ui.SingleSelect'));

$oop.getClass('$ui.SingleSelect')
.forwardBlend($ui.HtmlSingleSelect, $widget.isHtml);
