"use strict";

/**
 * @mixin $ui.HtmlSingleSelect
 * @extends $widget.HtmlWidget
 * @mixes $ui.SingleSelectElementHost
 * @augments $ui.SingleSelect
 */
$ui.HtmlSingleSelect = $oop.createClass('$ui.HtmlSingleSelect')
.blend($widget.HtmlWidget)
.blend($ui.SingleSelectElementHost)
.expect($ui.SingleSelect)
.build();

$ui.SingleSelect
.forwardBlend($ui.HtmlSingleSelect, $widget.isHtml);
