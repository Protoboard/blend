"use strict";

/**
 * Describes a class that is able to trigger and broadcast events.
 * @interface $event.EventSource
 */
$event.EventSource = $oop.getClass('$event.EventSource')
  .define(/** @lends $event.EventSource# */{
    /**
     * @returns {$event.EventSource}
     */
    trigger: function () {},

    /**
     * @returns {$event.EventSource}
     */
    broadcast: function () {}
  });
