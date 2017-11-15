"use strict";

/**
 * @mixin $widgets.DomLocaleText
 * @extends $widgets.LocaleText
 * @extends $widgets.DomText
 */
$widgets.DomLocaleText = $oop.getClass('$widgets.DomLocaleText')
.blend($oop.getClass('$widgets.LocaleText'))
.blend($oop.getClass('$widgets.DomText'))
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