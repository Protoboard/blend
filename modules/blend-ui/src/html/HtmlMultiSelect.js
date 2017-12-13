"use strict";

/**
 * @mixin $ui.HtmlMultiSelect
 * @extends $widget.HtmlWidget
 * @mixes $ui.MultiSelectElementHost
 * @augments $ui.MultiSelect
 */
$ui.HtmlMultiSelect = $oop.createClass('$ui.HtmlMultiSelect')
.blend($widget.HtmlWidget)
.blend($ui.MultiSelectElementHost)
.expect($ui.MultiSelect)
.build();

$ui.MultiSelect
.forwardBlend($ui.HtmlMultiSelect, $widget.isHtml);
