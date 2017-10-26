"use strict";

/**
 * @function $event.EventSender.create
 * @returns {$event.EventSender}
 */

/**
 * Associates instance with a list of paths on which each triggered event
 * will be invoked.
 * @class $event.EventSender
 * @todo Add path removal methods
 */
$event.EventSender = $oop.getClass('$event.EventSender')
.define(/** @lends $event.EventSender# */{
  /**
   * @member {$oop.QuickList} $event.EventSender#triggerPaths
   */

  /** @ignore */
  init: function () {
    this.triggerPaths = this.triggerPaths || {list: [], lookup: {}};
  },

  /**
   * Spawns an `Event` instance that is specific to the current
   * `EventSender` instance. Sets `sender` and `targetPaths` properties on
   * event. (Both overridable.)
   * @param {Object} properties
   * @param {string} properties.eventName
   * @returns {$event.Event}
   */
  spawnEvent: function (properties) {
    properties.sender = properties.sender || this;
    properties.targetPaths = properties.targetPaths || this.triggerPaths.list;
    return $event.Event.create(properties);
  },

  /**
   * @param {string} triggerPath
   * @returns {$event.EventSender}
   */
  addTriggerPath: function (triggerPath) {
    var triggerPaths = this.triggerPaths,
        triggerPathLookup = triggerPaths.lookup;

    if (!triggerPathLookup[triggerPath]) {
      triggerPaths.list.push(triggerPath);
      triggerPathLookup[triggerPath] = 1;
    }

    return this;
  },

  /**
   * @param {Array.<string>} triggerPaths
   * @returns {$event.EventSender}
   */
  addTriggerPaths: function (triggerPaths) {
    var that = this;
    triggerPaths.forEach(function (triggerPath) {
      that.addTriggerPath(triggerPath);
    });
    return this;
  },

  /**
   * @param {string} eventName
   * @returns {$utils.Promise}
   */
  trigger: function (eventName) {
    return this.spawnEvent({
      eventName: eventName
    })
    .trigger();
  }
});
