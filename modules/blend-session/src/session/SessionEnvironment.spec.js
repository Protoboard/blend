"use strict";

var $oop = window['blend-oop'],
    $session = window['blend-session'];

describe("$session", function () {
  describe("SessionEnvironment", function () {
    var SessionEnvironment,
        sessionEnvironment;

    beforeAll(function () {
      SessionEnvironment = $oop.createClass('test.$session.SessionEnvironment.SessionEnvironment')
      .blend($session.SessionEnvironment)
      .build();
      SessionEnvironment.__builder.forwards = {list: [], lookup: {}};
    });

    beforeEach(function () {
      SessionEnvironment.__builder.instances = {};
    });

    it("should be singleton", function () {
      expect(SessionEnvironment.create()).toBe(SessionEnvironment.create());
    });

    describe(".create()", function () {
      it("should set listeningPath", function () {
        sessionEnvironment = SessionEnvironment.create();
        expect(sessionEnvironment.listeningPath).toBe('session');
      });

      it("should set targetPaths", function () {
        sessionEnvironment = SessionEnvironment.create();
        expect(sessionEnvironment.triggerPaths.list).toContain('session');
      });
    });

    describe("#setActiveSession()", function () {
      var session;

      beforeEach(function () {
        sessionEnvironment = SessionEnvironment.create();
        session = $session.Session.fromSessionId('foo');
      });

      it("should return self", function () {
        var result = sessionEnvironment.setActiveSession(session);
        expect(result).toBe(sessionEnvironment);
      });

      it("should set activeSession property", function () {
        sessionEnvironment.setActiveSession(session);
        expect(sessionEnvironment.activeSession).toBe(session);
      });

      it("should trigger EVENT_ACTIVE_SESSION_CHANGE", function () {
        spyOn($event.Event, 'trigger');
        sessionEnvironment.setActiveSession(session);
        var event = $event.Event.trigger.calls.all()
        .map(function (spyCall) {
          return spyCall.object;
        })
        .filter(function (event) {
          return event.eventName === $session.EVENT_ACTIVE_SESSION_CHANGE;
        })[0];

        expect(event.eventName).toBe($session.EVENT_ACTIVE_SESSION_CHANGE);
        expect(event.activeSessionBefore).toBeUndefined();
        expect(event.activeSessionAfter).toBe(session);
      });
    });

    describe("#onActiveSessionChange()", function () {
      var session,
          activeSessionChangeEvent;

      beforeEach(function () {
        sessionEnvironment = SessionEnvironment.create();
        session = $session.Session.fromSessionId('foo');
        session.sessionState = $session.SESSION_STATES.OPEN;
      });

      it("should be invoked on EVENT_ACTIVE_SESSION_CHANGE", function () {
        spyOn($session.SessionEnvironment, 'onActiveSessionChange');
        activeSessionChangeEvent = sessionEnvironment.spawnEvent({
          eventName: $session.EVENT_ACTIVE_SESSION_CHANGE,
          activeSessionAfter: session
        });
        activeSessionChangeEvent.trigger();

        expect($session.SessionEnvironment.onActiveSessionChange)
        .toHaveBeenCalledWith(activeSessionChangeEvent);
      });

      describe("going from undefined to a session", function () {
        var event;

        beforeEach(function () {
          event = sessionEnvironment.spawnEvent({
            eventName: $session.EVENT_ACTIVE_SESSION_CHANGE,
            activeSessionBefore: undefined,
            activeSessionAfter: session
          });
        });

        it("should trigger EVENT_ACTIVE_SESSION_STATE_CHANGE", function () {
          spyOn($event.Event, 'trigger').and.callThrough();
          event.trigger();
          var triggeredEvent = $event.Event.trigger.calls.all()
          .map(function (spyCall) {
            return spyCall.object;
          })
          .filter(function (event) {
            return event.eventName === $session.EVENT_ACTIVE_SESSION_STATE_CHANGE;
          })[0];

          expect(triggeredEvent.eventName)
          .toBe($session.EVENT_ACTIVE_SESSION_STATE_CHANGE);
          expect(triggeredEvent.sessionStateBefore).toBeUndefined();
          expect(triggeredEvent.sessionStateAfter).toBe(session.sessionState);
        });
      });

      describe("going from a session to undefined", function () {
        var event;

        beforeEach(function () {
          event = sessionEnvironment.spawnEvent({
            eventName: $session.EVENT_ACTIVE_SESSION_CHANGE,
            activeSessionBefore: session,
            activeSessionAfter: undefined
          });
        });

        it("should trigger EVENT_ACTIVE_SESSION_STATE_CHANGE", function () {
          spyOn($session.SessionStateChangeEvent, 'trigger');
          event.trigger();
          var triggeredEvent = $session.SessionStateChangeEvent.trigger.calls.all()
          .map(function (spyCall) {
            return spyCall.object;
          })
          .filter(function (event) {
            return event.eventName === $session.EVENT_ACTIVE_SESSION_STATE_CHANGE;
          })[0];

          expect(triggeredEvent.eventName)
          .toBe($session.EVENT_ACTIVE_SESSION_STATE_CHANGE);
          expect(triggeredEvent.sessionStateBefore).toBe(session.sessionState);
          expect(triggeredEvent.sessionStateAfter).toBeUndefined();
        });
      });

      describe("going from session to another session", function () {
        var session2,
            event;

        beforeEach(function () {
          session2 = $session.Session.fromSessionId('bar');
          session2.sessionState = $session.SESSION_STATES.OPENING;
          event = sessionEnvironment.spawnEvent({
            eventName: $session.EVENT_ACTIVE_SESSION_CHANGE,
            activeSessionBefore: session,
            activeSessionAfter: session2
          });
        });

        it("should trigger EVENT_ACTIVE_SESSION_STATE_CHANGE", function () {
          spyOn($session.SessionStateChangeEvent, 'trigger');
          event.trigger();
          var triggeredEvent = $session.SessionStateChangeEvent.trigger.calls.all()
          .map(function (spyCall) {
            return spyCall.object;
          })
          .filter(function (event) {
            return event.eventName === $session.EVENT_ACTIVE_SESSION_STATE_CHANGE;
          })[0];

          expect(triggeredEvent.eventName)
          .toBe($session.EVENT_ACTIVE_SESSION_STATE_CHANGE);
          expect(triggeredEvent.sessionStateBefore).toBe(session.sessionState);
          expect(triggeredEvent.sessionStateAfter).toBe(session2.sessionState);
        });
      });
    });

    describe("#onSessionStateChange()", function () {
      var session;

      beforeEach(function () {
        session = $session.Session.fromSessionId('foo');
      });

      it("should be invoked on EVENT_SESSION_STATE_CHANGE", function () {
        spyOn($session.SessionEnvironment, 'onSessionStateChange');
        var event = session.spawnEvent({
          eventName: $session.EVENT_SESSION_STATE_CHANGE,
          sessionStateBefore: undefined,
          sessionStateAfter: $session.SESSION_STATES.OPENING
        });
        event.trigger();

        expect($session.SessionEnvironment.onSessionStateChange)
        .toHaveBeenCalledWith(event);
      });

      describe("when affected session is activeSession", function () {
        beforeEach(function () {
          sessionEnvironment = $session.SessionEnvironment.create();
          sessionEnvironment.activeSession = session;
        });

        it("should trigger EVENT_ACTIVE_SESSION_STATE_CHANGE", function () {
          spyOn($event.Event, 'trigger').and.callThrough();
          var event = session.spawnEvent({
            eventName: $session.EVENT_SESSION_STATE_CHANGE,
            sessionStateBefore: undefined,
            sessionStateAfter: $session.SESSION_STATES.OPEN
          });
          event.trigger();
          var triggeredEvent = $event.Event.trigger.calls.all()
          .map(function (spyCall) {
            return spyCall.object;
          })
          .filter(function (event) {
            return event.eventName === $session.EVENT_ACTIVE_SESSION_STATE_CHANGE;
          })[0];

          expect(triggeredEvent.eventName)
          .toBe($session.EVENT_ACTIVE_SESSION_STATE_CHANGE);
          expect(triggeredEvent.sessionStateBefore).toBeUndefined();
          expect(triggeredEvent.sessionStateAfter)
          .toBe($session.SESSION_STATES.OPEN);
        });
      });
    });
  });
});
