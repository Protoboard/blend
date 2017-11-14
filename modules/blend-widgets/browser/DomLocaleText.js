"use strict";

/**
 * @mixin $widgets.DomLocaleText
 */
$widgets.DomLocaleText = $oop.getClass('$widgets.DomLocaleText')
.blend($oop.getClass('$widgets.DomText'))
.expect($oop.getClass('$widgets.LocaleText'))
.expect($oop.getClass('$widgets.XmlText'))
.define(/** @lends $widgets.DomLocaleText# */{
  syncToActiveLocale: function () {
    // `Translatable` content will render (stringify) to translation in
    // active locale
    this.reRenderContents();
  }
});

$oop.getClass('$widgets.LocaleText')
.forwardBlend($widgets.DomLocaleText, $utils.isBrowser);