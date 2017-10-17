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
   * Path associated with instance where events will be listened to.
   * @member {$data.Path} $event.EventListener#listeningPath
   */

  /**
   * @param {$data.Path} listeningPath
   * @returns {$event.EventListener}
   */
  setListeningPath: function (listeningPath) {
    this.listeningPath = listeningPath;
    return this;
  }
});
