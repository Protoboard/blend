"use strict";

/**
 * Describes a class that subscribes to events.
 * @mixin $event.Subscriber
 * @extends $utils.Destructible
 */
$event.Subscriber = $oop.getClass('$event.Subscriber')
.mix($utils.Destructible)
.define(/** @lends $event.Subscriber# */{
  /**
   * Identifies instance in the context of event subscriptions.
   * @member {string} $event.Subscriber#subscriberId
   */

  /** @ignore */
  init: function () {
    $assert.isDefined(this.subscriberId, "Invalid subscriber ID");
    this._elevateEventHandlers();
  },

  /**
   * Elevates methods that conform to naming convention.
   * @private
   */
  _elevateEventHandlers: function () {
    // obtaining event handlers
    var methodNames = Object.keys(this.__methodMatrix),
        eventHandlerNames = methodNames.filter(function (methodName) {
          return methodName.length > 2 && methodName.substr(0, 2) === 'on';
        });

    this.elevateMethods.apply(this, eventHandlerNames);
  },

  /**
   * @returns {$event.Subscriber}
   */
  destroy: function () {
    this.unsubscribeFrom();
    return this;
  },

  /**
   * Subscribes specified callback to the event `eventName` being triggered on
   * the path associated with the current instance.
   * @param {$event.Evented} evented
   * @param {string} eventName
   * @param {string} callback
   * @returns {$event.Subscriber}
   */
  subscribeTo: function (evented, eventName, callback) {
    var eventSpace = $event.EventSpace.create();
    eventSpace.on(eventName, evented.eventPath, this.subscriberId, callback);
    return this;
  },

  /**
   * Unsubscribes the specified subscriber from the event `eventName` on the
   * path associated with the current instance.
   * @param {$event.Evented} [evented]
   * @param {string} [eventName]
   * @returns {$event.Subscriber}
   */
  unsubscribeFrom: function (evented, eventName) {
    var eventSpace = $event.EventSpace.create(),
        eventPath = evented && evented.eventPath;
    eventSpace.off(eventName, eventPath, this.subscriberId);
    return this;
  }
});
