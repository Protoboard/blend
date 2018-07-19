"use strict";

/**
 * @function $session.Session.create
 * @param {Object} properties
 * @param {string} properties.sessionId
 * @param {string} [properties.sessionState]
 * @returns {$session.Session}
 */

/**
 * Tracks session state. Allows opening and closing sessions.
 * Subclasses are expected to control deferred objects in `open` & `close`.
 * @class $session.Session
 * @extends $utils.Equatable
 * @extends $event.EventSender
 * @extends $event.EventListener
 */
$session.Session = $oop.createClass('$session.Session')
.blend($utils.Equatable)
.blend($event.EventSender)
.blend($event.EventListener)
.define(/** @lends $session.Session# */{
  /**
   * Identifies session.
   * @member {string} $session.Session#sessionId
   */

  /**
   * Current state of the session.
   * @member {string} [$session.Session#sessionState]
   */

  /**
   * @memberOf $session.Session
   * @param {string} sessionId
   * @param {Object} properties
   * @returns {$session.Session}
   */
  fromSessionId: function (sessionId, properties) {
    return this.create({
      sessionId: sessionId
    }, properties);
  },

  /** @ignore */
  init: function () {
    $assert.isString(this.sessionId, "Invalid session ID");

    this.elevateMethods(
        'onSessionOpenSuccess',
        'onSessionOpenFailure',
        'onSessionCloseSuccess',
        'onSessionCloseFailure');

    var listeningPath = 'session.' + $data.escapeTreePathComponent(this.sessionId);

    this
    .setListeningPath(listeningPath)
    .addTriggerPath(listeningPath)
    .addTriggerPath('session');
  },

  /**
   * @param {string} sessionStateBefore
   * @param {string} sessionStateAfter
   * @param {$utils.Promise} [promise]
   * @private
   */
  _triggerSessionStateChangeEvent: function (sessionStateBefore,
      sessionStateAfter, promise
  ) {
    var eventProperties = {
      eventName: $session.EVENT_SESSION_STATE_CHANGE,
      sessionStateBefore: sessionStateBefore,
      sessionStateAfter: sessionStateAfter
    };

    if (promise) {
      eventProperties.promise = promise;
    }

    this.spawnEvent(eventProperties).trigger();
  },

  /**
   * @param {$session.Session} session
   * @returns {boolean}
   */
  equals: function equals(session) {
    return equals.returned && this.sessionId === session.sessionId;
  },

  /**
   * Opens session. Initiates authentication against remote API.
   * Subclasses are expected to resolve or reject the shared deferred.
   * @returns {$utils.Thenable}
   */
  open: function open() {
    var SESSION_STATES = $session.SESSION_STATES,
        sessionStateBefore = this.sessionState,
        sessionStateAfter = SESSION_STATES.OPENING,
        deferred, promise;

    switch (sessionStateBefore) {
    case SESSION_STATES.OPENING:
      // already opening, fetch & return promise from index
      promise = $session.TransientSessionIndex.create()
      .getPromiseForSession(this);
      break;

    case SESSION_STATES.OPEN:
      // already open, nothing to do
      deferred = $utils.Deferred.create();
      promise = deferred.promise;
      deferred.resolve();
      break;

    case SESSION_STATES.CLOSED:
    case undefined:
      // legitimate cases
      deferred = $utils.Deferred.create();
      promise = deferred.promise;
      promise.then(this.onSessionOpenSuccess, this.onSessionOpenFailure);
      this.sessionState = sessionStateAfter;
      this._triggerSessionStateChangeEvent(sessionStateBefore, sessionStateAfter, promise);
      break;

    case SESSION_STATES.CLOSING:
      // can't initiate open while closing
      // todo Maybe schedule re-opening?
      deferred = $utils.Deferred.create();
      promise = deferred.promise;
      deferred.reject();
      break;
    }

    open.shared.sessionStateBefore = sessionStateBefore;
    open.shared.deferred = deferred;
    return promise;
  },

  /**
   * Closes session. Initiates session invalidation through remote API.
   * Subclasses are expected to resolve or reject the shared deferred.
   * @returns {$utils.Thenable}
   */
  close: function close() {
    var SESSION_STATES = $session.SESSION_STATES,
        sessionStateBefore = this.sessionState,
        sessionStateAfter = SESSION_STATES.CLOSING,
        deferred, promise;

    switch (sessionStateBefore) {
    case SESSION_STATES.OPENING:
      // can't initiate closing while opening
      // todo Maybe schedule closing?
      deferred = $utils.Deferred.create();
      promise = deferred.promise;
      deferred.reject();
      break;

    case SESSION_STATES.OPEN:
    case undefined:
      // legitimate case
      deferred = $utils.Deferred.create();
      promise = deferred.promise;
      promise.then(this.onSessionCloseSuccess, this.onSessionCloseFailure);
      this.sessionState = sessionStateAfter;
      this._triggerSessionStateChangeEvent(sessionStateBefore, sessionStateAfter, promise);
      break;

    case SESSION_STATES.CLOSING:
      // already closing, fetch & return promise from index
      promise = $session.TransientSessionIndex.create()
      .getPromiseForSession(this);
      break;

    case SESSION_STATES.CLOSED:
      // already closed
      deferred = $utils.Deferred.create();
      promise = deferred.promise;
      deferred.resolve();
      break;
    }

    close.shared.sessionStateBefore = sessionStateBefore;
    close.shared.deferred = deferred;
    return promise;
  },

  /** @ignore */
  onSessionOpenSuccess: function onSessionOpenSuccess() {
    var sessionStateBefore = this.sessionState,
        sessionStateAfter = $session.SESSION_STATES.OPEN;

    this.sessionState = sessionStateAfter;
    this._triggerSessionStateChangeEvent(sessionStateBefore, sessionStateAfter);

    onSessionOpenSuccess.shared.sessionStateBefore = sessionStateBefore;
  },

  /** @ignore */
  onSessionOpenFailure: function onSessionOpenFailure() {
    var sessionStateBefore = this.sessionState;

    this.sessionState = undefined;
    this._triggerSessionStateChangeEvent(sessionStateBefore, undefined);

    onSessionOpenFailure.shared.sessionStateBefore = sessionStateBefore;
  },

  /** @ignore */
  onSessionCloseSuccess: function onSessionCloseSuccess() {
    var sessionStateBefore = this.sessionState,
        sessionStateAfter = $session.SESSION_STATES.CLOSED;

    this.sessionState = sessionStateAfter;
    this._triggerSessionStateChangeEvent(sessionStateBefore, sessionStateAfter);

    onSessionCloseSuccess.shared.sessionStateBefore = sessionStateBefore;
  },

  /** @ignore */
  onSessionCloseFailure: function onSessionCloseFailure() {
    var sessionStateBefore = this.sessionState;

    this.sessionState = undefined;
    this._triggerSessionStateChangeEvent(sessionStateBefore, undefined);

    onSessionCloseFailure.shared.sessionStateBefore = sessionStateBefore;
  }
})
.build();
