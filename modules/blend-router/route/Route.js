"use strict";

/**
 * @function $router.Route.create
 * @param {Object} properties
 * @param {string[]} properties.components Identifiable 'steps' along the path.
 * @returns {$router.Route}
 */

/**
 * @class $router.Route
 * @extends $utils.UriPath
 * @extends $event.EventSender
 * @extends $event.EventListener
 */
$router.Route = $oop.getClass('$router.Route')
.blend($utils.UriPath)
.blend($event.EventSender)
.blend($event.EventListener)
.define(/** @lends $router.Route# */{
  /** @ignore */
  init: function () {
    var listeningPath = $data.TreePath.fromComponentsToString(
        ['route'].concat(this.components));

    this
    .setListeningPath(listeningPath)
    .addTriggerPath(listeningPath)
    .addTriggerPath('route');
  },

  /**
   * @returns {$router.Route}
   */
  navigateTo: function () {
    $router.Router.create().navigateToRoute(this);
    return this;
  },

  /**
   * @returns {$utils.Promise}
   */
  navigateToDebounced: function () {
    return $router.Router.create().navigateToRouteDebounced(this);
  }
});

$oop.copyProperties(String.prototype, /** @lends String# */{
  /**
   * @returns {$router.Route}
   */
  toRoute: function () {
    return $router.Route.fromString(this.valueOf());
  }
});

$oop.copyProperties(Array.prototype, /** @lends Array# */{
  /**
   * @returns {$router.Route}
   */
  toRoute: function () {
    return $router.Route.create({components: this});
  }
});
