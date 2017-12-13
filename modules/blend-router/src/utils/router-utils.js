"use strict";

$oop.copyProperties($router, /** @lends $router */{
  /**
   * @returns {$router.Route}
   */
  getActiveRoute: function () {
    return $router.Router.create().getActiveRoute();
  }
});
