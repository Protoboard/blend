"use strict";

/**
 * Associates instance with a path where events are listened to. Facilitates
 * subscribing and unsubscribing `$event.EventSubscriber` instances to
 * events triggered on `listenerPath`.
 * @mixin $event.EventListener
 */
$event.EventListener = $oop.createClass('$event.EventListener')
.define(/** @lends $event.EventListener# */{
  /**
   * Path associated with instance where events will be listened to.
   * @member {string} $event.EventListener#listeningPath
   */

  /**
   * @param {string} listeningPath
   * @returns {$event.EventListener}
   */
  setListeningPath: function (listeningPath) {
    this.listeningPath = listeningPath;
    return this;
  }
})
.build();
