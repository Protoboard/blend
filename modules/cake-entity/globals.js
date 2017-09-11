"use strict";

var $assert = require('cake-assert'),
    $oop = require('cake-oop'),
    $utils = require('cake-utils'),
    $data = require('cake-data'),
    $event = require('cake-event'),
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
