"use strict";

/**
 * @function $ui.Application.create
 * @returns {$ui.Application}
 */

/**
 * @class $ui.Application
 * @extends $widget.RootWidget
 * @extends $ui.RouteBound
 */
$ui.Application = $oop.createClass('$ui.Application')
.blend($widget.RootWidget)
.blend($ui.RouteBound)
.define(/** @lends $ui.Application# */{
  /**
   * @member {$router.Route} $ui.Application#activeRoute
   */

  /**
   * @protected
   */
  _syncToActiveRoute: function () {
    var activeRouteBefore = this.activeRoute,
        activeRouteAfter = $router.getActiveRoute();

    if (activeRouteBefore) {
      this
      .setStateValue(activeRouteBefore.__className, false)
      .setStateValue('route-' + activeRouteBefore, false);
    }

    this
    .setStateValue(activeRouteAfter.__className, true)
    .setStateValue('route-' + activeRouteAfter, true);

    this.activeRoute = activeRouteAfter;
  },

  /**
   * @param {$ui.Page} page
   * @returns {$ui.Application}
   */
  setActivePage: function setActivePage(page) {
    var pageBefore = this.getChildNode(page.nodeName);
    if (page !== pageBefore) {
      this.addChildNode(page);
      this.spawnEvent({
        eventName: $ui.EVENT_PAGE_CHANGE,
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
})
.build();
