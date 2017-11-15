"use strict";

/**
 * @mixin $widgets.DomLocaleText
 * @extends $widgets.DomText
 * @augments $widgets.LocaleText
 * @augments $widgets.XmlText
 */
$widgets.DomLocaleText = $oop.getClass('$widgets.DomLocaleText')
.blend($oop.getClass('$widgets.DomText'))
.expect($oop.getClass('$widgets.LocaleText'))
.expect($oop.getClass('$widgets.XmlText'))
.define(/** @lends $widgets.DomLocaleText# */{
  /** @ignore */
  syncToActiveLocale: function () {
    // `Translatable` content will render (stringify) to translation in
    // active locale
    this.reRenderContents();
  }
});

$oop.getClass('$widgets.LocaleText')
.forwardBlend($widgets.DomLocaleText, $utils.isBrowser);