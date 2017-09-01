"use strict";

/**
 * @function $event.EventListener.create
 * @returns {$event.EventListener}
 */

/**
 * Associates instance with a path where events are listened to. Facilitates
 * subscribing and unsubscribing `$event.EventSubscriber` instances to
 * events triggered on `listenerPath`.
 * @class $event.EventListener
 */
$event.EventListener = $oop.getClass('$event.EventListener')
.define(/** @lends $event.EventListener# */{
  /**
   * @todo Make mandatory?
   * @member {$data.Path} $event.EventListener#listeningPath
   */

  /**
   * @param {$data.Path} listeningPath
   * @returns {$event.EventListener}
   */
  setListeningPath: function (listeningPath) {
    this.listeningPath = listeningPath;
    return this;
  },

  /**
   * @param {$event.EventSubscriber} subscriber
   * @param {string} eventName
   * @param {function} callback
   * @returns {$event.EventListener}
   */
  subscribe: function (subscriber, eventName, callback) {
    var eventSpace = $event.EventSpace.create();
    eventSpace.on(eventName, this.listeningPath, subscriber.subscriberId, callback);
    return this;
  },

  /**
   * @param {$event.EventSubscriber} subscriber
   * @param {string} eventName
   * @returns {$event.EventListener}
   */
  unsubscribe: function (subscriber, eventName) {
    var eventSpace = $event.EventSpace.create();
    eventSpace.off(eventName, this.listeningPath, subscriber.subscriberId);
    return this;
  }
});
