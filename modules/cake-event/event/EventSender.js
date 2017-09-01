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
   * Spawns an `Event` instance
   * @param {string} eventName
   * @returns {$event.Event}
   */
  spawnEvent: function (eventName) {
    return $event.Event.fromEventName(eventName)
    .setSender(this);
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
    return this.spawnEvent(eventName)
    .traverse(this.triggerPaths);
  },

  /**
   * @param {string} eventName
   * @param {boolean} [bubbles=false]
   * @returns {$utils.Promise}
   */
  broadcast: function (eventName, bubbles) {
    var triggerPaths = this.triggerPaths;

    $assert.assert(triggerPaths.length === 1, "Invalid trigger path count.");

    return this.spawnEvent(eventName)
    .broadcast(triggerPaths[0], bubbles);
  }
});
