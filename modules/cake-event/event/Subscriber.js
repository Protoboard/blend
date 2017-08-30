"use strict";

/**
 * Describes a class that subscribes to events.
 * Host is responsible for implementing property spread and lifecycle
 * methods. (When necessary)
 * @mixin $event.Subscriber
 */
$event.Subscriber = $oop.getClass('$event.Subscriber')
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
   * Subscribes specified callback to the event `eventName` being triggered on
   * `eventPath`.
   * @param {string} eventName
   * @param {$data.Path} eventPath
   * @param {function} callback
   * @returns {$event.Subscriber}
   */
  subscribeTo: function (eventName, eventPath, callback) {
    var eventSpace = $event.EventSpace.create();
    eventSpace.on(eventName, eventPath, this.subscriberId, callback);
    return this;
  },

  /**
   * Unsubscribes the callback delegated by the current subscriber from the
   * event `eventName` on the path `eventPath`.
   * @param {string} [eventName]
   * @param {$data.Path} [eventPath]
   * @returns {$event.Subscriber}
   */
  unsubscribeFrom: function (eventName, eventPath) {
    var eventSpace = $event.EventSpace.create();
    eventSpace.off(eventName, eventPath, this.subscriberId);
    return this;
  }
});
