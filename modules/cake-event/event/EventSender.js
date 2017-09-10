"use strict";

/**
 * @function $event.EventSender.create
 * @returns {$event.EventSender}
 */

/**
 * Associates instance with a list of paths on which each triggered event
 * will be invoked.
 * @class $event.EventSender
 */
$event.EventSender = $oop.getClass('$event.EventSender')
.define(/** @lends $event.EventSender# */{
  /**
   * @member {Array.<$data.Path>} $event.EventSender#triggerPaths
   */

  /** @ignore */
  spread: function () {
    this.triggerPaths = this.triggerPaths || [];
  },

  /**
   * Spawns an `Event` instance that is specific to the current
   * `EventSender` instance. Sets `sender` and `targetPaths` properties on
   * event. (Both overridable.)
   * @param {Object} properties
   * @returns {$event.Event}
   */
  spawnEvent: function (properties) {
    properties.sender = properties.sender || this;
    properties.targetPaths = properties.targetPaths || this.triggerPaths;
    return $event.Event.create(properties);
  },

  /**
   * @param {$data.Path} triggerPath
   * @returns {$event.EventSender}
   */
  addTriggerPath: function (triggerPath) {
    this.triggerPaths.push(triggerPath);
    return this;
  },

  /**
   * @param {Array.<$data.Path>} triggerPaths
   * @returns {$event.EventSender}
   */
  addTriggerPaths: function (triggerPaths) {
    this.triggerPaths = this.triggerPaths.concat(triggerPaths);
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
