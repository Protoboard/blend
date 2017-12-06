"use strict";

/**
 * @function $ui.Page.create
 * @returns {$ui.Page}
 */

/**
 * Encapsulates the largest functional unit of the application.
 * @class $ui.Page
 * @extends $widget.Widget
 * @mixes $ui.Disableable
 */
$ui.Page = $oop.createClass('$ui.Page')
.blend($widget.Widget)
.blend($oop.Singleton)
.blend($ui.Disableable)
.define(/** @lends $ui.Page# */{
  /** @ignore */
  defaults: function () {
    this.nodeName = this.nodeName || 'page';
  },

  /**
   * @returns {$ui.Page}
   */
  setAsActivePage: function () {
    $ui.Application.create().setActivePage(this);
    return this;
  }
})
.build();
