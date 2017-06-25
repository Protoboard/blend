"use strict";

/**
 * Describes a class that is able to trigger and broadcast events.
 * @interface $event.EventSource
 */
$event.EventSource = $oop.getClass('$event.EventSource')
  .define(/** @lends $event.EventSource# */{
    /**
     * @returns {$utils.Thenable}
     */
    trigger: function () {},

    /**
     * @returns {$utils.Thenable}
     */
    broadcast: function () {}
  });
