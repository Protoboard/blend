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
$router.Route = $oop.createClass('$router.Route')
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
})
.build();

$oop.copyProperties(String.prototype, /** @lends String# */{
  /**
   * @param {Object} [properties]
   * @returns {$router.Route}
   */
  toRoute: function (properties) {
    return $router.Route.fromString(this.valueOf(), properties);
  }
});

$oop.copyProperties(Array.prototype, /** @lends Array# */{
  /**
   * @param {Object} [properties]
   * @returns {$router.Route}
   */
  toRoute: function (properties) {
    return $router.Route.create({components: this}, properties);
  }
});
