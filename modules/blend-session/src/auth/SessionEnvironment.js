"use strict";

/**
 * @function $session.SessionEnvironment.create
 * @param {Object} [properties]
 * @returns {$session.SessionEnvironment}
 */

/**
 * @class $session.SessionEnvironment
 * @extends $event.EventSender
 * @extends $event.EventListener
 */
$session.SessionEnvironment = $oop.createClass('$session.SessionEnvironment')
.blend($oop.Singleton)
.blend($event.EventSender)
.blend($event.EventListener)
.define(/** @lends $session.SessionEnvironment# */{
  /**
   * @member {$session.Session} $session.SessionEnvironment#activeSession
   */

  /**
   * @ignore
   */
  init: function () {
    this
    .setListeningPath('session')
    .addTriggerPath('session');
  },

  /**
   * @param {$session.Session} activeSession
   * @returns {$session.SessionEnvironment}
   */
  setActiveSession: function setActiveSession(activeSession) {
    var activeSessionBefore = this.activeSession;
    if (activeSession && !activeSession.equals(activeSessionBefore)) {
      this.activeSession = activeSession;
      this.spawnEvent({
        eventName: $session.EVENT_ACTIVE_SESSION_CHANGE,
        activeSessionBefore: activeSessionBefore,
        activeSessionAfter: activeSession
      })
      .trigger();
    }
    setActiveSession.shared.activeSessionBefore = activeSessionBefore;
    return this;
  },

  /**
   * todo Create ActiveSessionChangeEvent
   * @param {$event.Event} event
   * @ignore
   */
  onActiveSessionChange: function (event) {
    var activeSessionBefore = event.activeSessionBefore,
        activeSessionAfter = event.activeSessionAfter,
        activeSessionStateBefore = activeSessionBefore && activeSessionBefore.sessionState,
        activeSessionStateAfter = activeSessionAfter && activeSessionAfter.sessionState;

    if (activeSessionStateAfter !== activeSessionStateBefore) {
      this.spawnEvent({
        eventName: $session.EVENT_ACTIVE_SESSION_STATE_CHANGE,
        sessionStateBefore: activeSessionBefore && activeSessionBefore.sessionState,
        sessionStateAfter: activeSessionAfter && activeSessionAfter.sessionState
      })
      .trigger();
    }
  },

  /**
   * @param {$session.SessionStateChangeEvent} event
   * @ignore
   */
  onSessionStateChange: function (event) {
    var session = event.sender;
    if (session === this.activeSession) {
      this.spawnEvent({
        eventName: $session.EVENT_ACTIVE_SESSION_STATE_CHANGE,
        sessionStateBefore: event.sessionStateBefore,
        sessionStateAfter: event.sessionStateAfter
      })
      .trigger();
    }
  }
})
.build();

$event.EventSpace.create()
.on($session.EVENT_ACTIVE_SESSION_CHANGE,
    'session',
    $session.SessionEnvironment.__className,
    function (event) {
      return $session.SessionEnvironment.create()
      .onActiveSessionChange(event);
    })
.on($session.EVENT_SESSION_STATE_CHANGE,
    'session',
    $session.SessionEnvironment.__className,
    function (event) {
      return $session.SessionEnvironment.create()
      .onSessionStateChange(event);
    });
