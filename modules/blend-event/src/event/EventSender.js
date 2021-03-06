"use strict";

/**
 * Associates instance with a list of paths on which each triggered event
 * will be invoked.
 * @mixin $event.EventSender
 */
$event.EventSender = $oop.createClass('$event.EventSender')
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

    if (!hOP.call(triggerPathLookup, triggerPath)) {
      triggerPaths.list.push(triggerPath);
      triggerPathLookup[triggerPath] = 1;
    }

    return this;
  },

  /**
   * Adds `triggerPath` before specified `nextTriggerPath`.
   * @param {string} triggerPath
   * @param {string} nextTriggerPath
   * @returns {$event.EventSender}
   */
  addTriggerPathBefore: function (triggerPath, nextTriggerPath) {
    var triggerPaths = this.triggerPaths,
        triggerPathList,
        triggerPathLookup = triggerPaths.lookup,
        nextTriggerPathIndex;

    if (!hOP.call(triggerPathLookup, triggerPath)) {
      triggerPathList = triggerPaths.list;
      nextTriggerPathIndex = triggerPathList.indexOf(nextTriggerPath);
      if (nextTriggerPathIndex > -1) {
        triggerPathList.splice(nextTriggerPathIndex, 0, triggerPath);
      } else {
        triggerPathList.push(triggerPath);
      }
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
   * @param {string} triggerPath
   * @returns {$event.EventSender}
   */
  removeTriggerPath: function (triggerPath) {
    var triggerPaths = this.triggerPaths,
        triggerPathList = triggerPaths.list,
        triggerPathLookup = triggerPaths.lookup,
        triggerPathIndex;

    if (hOP.call(triggerPathLookup, triggerPath)) {
      triggerPathIndex = triggerPathList.indexOf(triggerPath);
      triggerPathList.splice(triggerPathIndex, 1);
      delete triggerPathLookup[triggerPath];
    }

    return this;
  },

  /**
   * @param {Array.<string>} triggerPaths
   * @returns {$event.EventSender}
   */
  removeTriggerPaths: function (triggerPaths) {
    var that = this;
    triggerPaths.forEach(function (triggerPath) {
      that.removeTriggerPath(triggerPath);
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
})
.build();
