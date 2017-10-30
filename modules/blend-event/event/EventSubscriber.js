"use strict";

/**
 * Describes a class that subscribes to events.
 * Host is responsible for implementing property spread and lifecycle
 * methods. (When necessary)
 * @mixin $event.EventSubscriber
 * @implements $utils.Destructible
 */
$event.EventSubscriber = $oop.getClass('$event.EventSubscriber')
.implement($utils.Destructible)
.define(/** @lends $event.EventSubscriber# */{
  /**
   * Identifies instance in the context of event subscriptions.
   * @member {string} $event.EventSubscriber#subscriberId
   */

  /** @ignore */
  init: function () {
    $assert.isDefined(this.subscriberId, "Invalid subscriber ID");
    this._elevateEventHandlers();
  },

  /** @ignore */
  destroy: function () {
    this.off();
    return this;
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
   * the path associated with `eventListener`.
   * @param {string} eventName
   * @param {$event.EventListener} eventListener
   * @param {function} callback
   * @returns {$event.EventSubscriber}
   */
  on: function (eventName, eventListener, callback) {
    var eventSpace = $event.EventSpace.create(),
        listeningPath = eventListener.listeningPath;
    eventSpace.on(eventName, listeningPath, this.subscriberId, callback);
    return this;
  },

  /**
   * Unsubscribes the callback delegated by the current subscriber from the
   * event `eventName` on the path associated with `eventListener`.
   * @param {string} [eventName]
   * @param {$event.EventListener} [eventListener]
   * @returns {$event.EventSubscriber}
   */
  off: function (eventName, eventListener) {
    var eventSpace = $event.EventSpace.create(),
        listeningPath = eventListener && eventListener.listeningPath;
    eventSpace.off(eventName, listeningPath, this.subscriberId);
    return this;
  }
});
