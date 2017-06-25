"use strict";

/**
 * Describes a class that is able to spawn events.
 * @interface $event.EventSpawner
 */
$event.EventSpawner = $oop.getClass('$event.EventSpawner')
.define(/** @lends $event.EventSpawner# */{
  /**
   * @param {string} eventName
   * @returns {$event.Event}
   */
  spawnEvent: function (eventName) {}
});
