"use strict";

/**
 * @function $widgets.Page.create
 * @returns {$widgets.Page}
 */

/**
 * Encapsulates the largest functional unit of the application.
 * @class $widgets.Page
 * @extends $widget.Widget
 * @mixes $widgets.Disableable
 */
$widgets.Page = $oop.getClass('$widgets.Page')
.blend($widget.Widget)
.blend($oop.Singleton)
.blend($oop.getClass('$widgets.Disableable'))
.define(/** @lends $widgets.Page# */{
  /** @ignore */
  defaults: function () {
    this.nodeName = this.nodeName || 'page';
  },

  /**
   * @returns {$widgets.Page}
   */
  setAsActivePage: function () {
    $widgets.Application.create().setActivePage(this);
    return this;
  }
});
