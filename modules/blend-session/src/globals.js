/* jshint strict:false */

var $assert = require('blend-assert'),
    $oop = require('blend-oop'),
    $utils = require('blend-utils'),
    $data = require('blend-data'),
    $event = require('blend-event'),
    $session = exports,
    hOP = Object.prototype.hasOwnProperty;

/**
 * @namespace $session
 */
$oop.copyProperties($session, /** @lends $session */{
  /**
   * @enum {string}
   */
  SESSION_STATES: {
    CLOSED: 'closed',
    OPENING: 'opening',
    OPEN: 'open',
    CLOSING: 'closing'
  },

  /**
   * Signals that a session's state changed.
   * @constant
   */
  EVENT_SESSION_STATE_CHANGE: 'session.change.session-state',

  /**
   * Signals that the active session has changed.
   * @constant
   */
  EVENT_ACTIVE_SESSION_CHANGE: 'session.change.active-session',

  /**
   * Signals that the active session's state changed.
   * @constant
   */
  EVENT_ACTIVE_SESSION_STATE_CHANGE: 'session.change.session-state.active'
});
