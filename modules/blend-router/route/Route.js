"use strict";

/**
 * @function $router.Route.create
 * @param {Object} properties
 * @param {string[]} properties.components Identifiable 'steps' along the path.
 * @returns {$router.Route}
 */

/**
 * @class $router.Route
 * @extends $data.Path
 * @extends $event.EventSender
 * @extends $event.EventListener
 */
$router.Route = $oop.getClass('$router.Route')
.blend($data.Path)
.blend($event.EventSender)
.blend($event.EventListener)
.define(/** @lends $router.Route# */{
  /**
   * @memberOf $router.Route
   * @param {string} urlPath
   * @returns {$router.Route}
   */
  fromUrlPath: function (urlPath) {
    var components = urlPath.split('/')
    .map(decodeURIComponent);
    return this.create({components: components});
  },

  /** @ignore */
  init: function () {
    var listeningPath = $data.Path.fromComponentsToString(
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
   * @returns {string}
   */
  toUrlPath: function () {
    return this.components
    .map(encodeURIComponent)
    .join('/');
  }
});

$oop.copyProperties(String.prototype, /** @lends String# */{
  /**
   * @returns {$router.Route}
   */
  toRoute: function () {
    return $router.Route.fromUrlPath(this.valueOf());
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
