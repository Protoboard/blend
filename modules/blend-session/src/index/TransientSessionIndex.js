"use strict";

/**
 * @function $session.TransientSessionIndex.create
 * @returns {$session.TransientSessionIndex}
 */

/**
 * @class $session.TransientSessionIndex
 */
$session.TransientSessionIndex = $oop.createClass('$session.TransientSessionIndex')
.blend($oop.Singleton)
.define(/** @lends $session.TransientSessionIndex# */{
  /**
   * Associates promise with session.
   * @param {$session.Session} session
   * @param {$utils.Promise} promise
   * @returns {$session.TransientSessionIndex}
   */
  addPromiseForSession: function (session, promise) {
    var indexPath = $data.TreePath.fromComponents([
      '_session', session.sessionId]);
    $session.index.setNode(indexPath, promise);
    return this;
  },

  /**
   * Disassociates promise from session.
   * @param {$session.Session} session
   * @returns {$session.TransientSessionIndex}
   */
  removePromiseForSession: function (session) {
    var indexPath = $data.TreePath.fromComponents([
        '_session', session.sessionId]);
    $session.index.deleteNode(indexPath);
    return this;
  },

  /**
   * Retrieves promise associated with specified `session`.
   * @param {$session.Session} session
   * @returns {$utils.Thenable}
   */
  getPromiseForSession: function (session) {
    var indexPath = $data.TreePath.fromComponents([
        '_session', session.sessionId]);
    return $session.index.getNode(indexPath);
  },

  /**
   * @param {$session.SessionStateChangeEvent} event
   * @ignore
   */
  onSessionStateChange: function (event) {
    var session = event.sender,
        sessionStateBefore = event.sessionStateBefore,
        sessionStateAfter = event.sessionStateAfter,
        promise = event.promise,
        SESSION_STATES = $session.SESSION_STATES;

    if (promise && (
        sessionStateBefore !== SESSION_STATES.OPENING &&
        sessionStateAfter === SESSION_STATES.OPENING ||
        sessionStateBefore !== SESSION_STATES.CLOSING &&
        sessionStateAfter === SESSION_STATES.CLOSING)
    ) {
      // Session enters transient state: OPENING or CLOSING
      // Adding promise to registry
      this.addPromiseForSession(session, promise);
    }
    else if (
        sessionStateBefore === SESSION_STATES.OPENING &&
        (sessionStateAfter === SESSION_STATES.OPEN ||
            sessionStateAfter === SESSION_STATES.UNKNOWN) ||
        sessionStateBefore === SESSION_STATES.CLOSING &&
        (sessionStateAfter === SESSION_STATES.CLOSED ||
            sessionStateAfter === SESSION_STATES.UNKNOWN)
    ) {
      // Session enters permanent state (OPEN, CLOSED, or UNKNOWN)
      // Removing promise from registry
      this.removePromiseForSession(session);
    }
  }
})
.build();

$event.EventSpace.create()
.on($session.EVENT_SESSION_STATE_CHANGE,
    'session',
    $session.TransientSessionIndex.__className,
    function (event) {
      return $session.TransientSessionIndex.create()
      .onSessionStateChange(event);
    });