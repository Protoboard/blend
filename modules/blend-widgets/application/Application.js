"use strict";

/**
 * @function $widgets.Application.create
 * @returns {$widgets.Application}
 */

/**
 * @class $widgets.Application
 * @extends $widget.RootWidget
 * @extends $widgets.RouteBound
 */
$widgets.Application = $oop.getClass('$widgets.Application')
.blend($widget.RootWidget)
.blend($oop.getClass('$widgets.RouteBound'))
.define(/** @lends $widgets.Application# */{
  /**
   * @member {$router.Route} $widgets.Application#activeRoute
   */

  /**
   * @protected
   */
  _syncToActiveRoute: function () {
    var activeRouteBefore = this.activeRoute,
        activeRouteAfter = $router.getActiveRoute();

    if (activeRouteBefore) {
      this
      .setStateValue(activeRouteBefore.__classId, false)
      .setStateValue('route-' + activeRouteBefore, false);
    }

    this
    .setStateValue(activeRouteAfter.__classId, true)
    .setStateValue('route-' + activeRouteAfter, true);

    this.activeRoute = activeRouteAfter;
  },

  /**
   * @param {$widgets.Page} page
   * @returns {$widgets.Application}
   */
  setActivePage: function setActivePage(page) {
    var pageBefore = this.getChildNode(page.nodeName);
    if (page !== pageBefore) {
      this.addChildNode(page);
      this.spawnEvent({
        eventName: $widgets.EVENT_PAGE_CHANGE,
        pageBefore: pageBefore,
        pageAfter: page
      })
      .trigger();
    }
    setActivePage.shared.activePageBefore = pageBefore;
    return this;
  },

  /** @ignore */
  onAttach: function () {
    this._syncToActiveRoute();
  },

  /** @ignore */
  onRouteChange: function () {
    this._syncToActiveRoute();
  }
});
