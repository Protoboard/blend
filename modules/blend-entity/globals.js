"use strict";

var $assert = require('blend-assert'),
    $oop = require('blend-oop'),
    $utils = require('blend-utils'),
    $data = require('blend-data'),
    $event = require('blend-event'),
    $entity = exports,
    hOP = Object.prototype.hasOwnProperty;

/**
 * @namespace $entity
 */

/**
 * @external Array
 */

/**
 * @external String
 */

$oop.copyProperties($entity, /** @lends $entity */{
  /**
   * Signals a failed attempt to access the entity in the entity store.
   * (Node was not there.)
   * @constant
   */
  EVENT_ENTITY_ABSENT: 'entity.absent',

  /**
   * Signals a change to the entity node.
   * @constant
   */
  EVENT_ENTITY_CHANGE: 'entity.change'
});
