"use strict";

var $oop = window['blend-oop'],
    $utils = window['blend-utils'],
    $event = window['blend-event'],
    $session = window['blend-session'];

describe("$session", function () {
  describe("Session", function () {
    var Session,
        session;

    beforeAll(function () {
      Session = $oop.createClass('test.$session.Session.Session')
      .blend($session.Session)
      .build();
      Session.__builder.forwards = {list: [], lookup: {}};
    });

    describe(".create()", function () {
      it("should initialize sessionId property", function () {
        session = Session.create({
          sessionId: 'foo'
        });
        expect(session.sessionId).toBe('foo');
      });

      describe("on missing sessionId", function () {
        it("should throw", function () {
          expect(function () {
            Session.create();
          }).toThrow();
        });
      });

      it("should set listeningPath", function () {
        session = Session.create({
          sessionId: 'foo'
        });
        expect(session.listeningPath).toBe('session.foo');
      });

      it("should add triggerPaths", function () {
        session = Session.create({
          sessionId: 'foo'
        });
        expect(session.triggerPaths.list).toContain('session.foo', 'session');
      });
    });

    describe(".fromSessionId()", function () {
      it("should initialize sessionId", function () {
        session = Session.fromSessionId('bar');
        expect(session.sessionId).toBe('bar');
      });
    });

    describe("#equals()", function () {
      var session2, session3;

      beforeEach(function () {
        session = Session.fromSessionId('foo');
        session2 = Session.fromSessionId('bar');
        session3 = Session.fromSessionId('foo');
      });

      describe("on matching session IDs", function () {
        it("should return truthy", function () {
          expect(session.equals(session)).toBeTruthy();
          expect(session.equals(session3)).toBeTruthy();
          expect(session3.equals(session)).toBeTruthy();
        });
      });

      describe("on different session IDs", function () {
        it("should return falsy", function () {
          expect(session.equals(session2)).toBeFalsy();
          expect(session.equals(undefined)).toBeFalsy();
          expect(session2.equals(session)).toBeFalsy();
        });
      });
    });

    describe("#open()", function () {
      beforeEach(function () {
        session = Session.fromSessionId('foo');
      });

      it("should return promise", function () {
        var result = session.open();
        expect($utils.Promise.mixedBy(result)).toBeTruthy();
      });

      it("should expose deferred on shared", function () {
        var promise = session.open();
        expect($utils.Deferred.mixedBy(session.open.shared.deferred))
        .toBeTruthy();
        expect(session.open.shared.deferred.promise).toBe(promise);
      });

      it("should expose sessionStateBefore on shared", function () {
        session.open();
        expect(session.open.shared.sessionStateBefore).toBeUndefined();
      });

      describe("when session state is undefined", function () {
        beforeEach(function () {
          session.sessionState = undefined;
        });

        it("should set sessionState property to OPENING", function () {
          session.open();
          expect(session.sessionState).toBe($session.SESSION_STATES.OPENING);
        });

        it("should trigger EVENT_SESSION_STATE_CHANGE", function () {
          spyOn($event.Event, 'trigger');
          session.open();
          var event = $event.Event.trigger.calls.mostRecent().object;
          expect(event.sender).toBe(session);
          expect(event.eventName).toBe($session.EVENT_SESSION_STATE_CHANGE);
          expect(event.sessionStateBefore).toBeUndefined();
          expect(event.sessionStateAfter).toBe($session.SESSION_STATES.OPENING);
          expect(event.promise).toBe(session.open.shared.deferred.promise);
        });
      });

      describe("when session state is CLOSED", function () {
        beforeEach(function () {
          session.sessionState = $session.SESSION_STATES.CLOSED;
        });

        it("should set sessionState property to OPENING", function () {
          session.open();
          expect(session.sessionState).toBe($session.SESSION_STATES.OPENING);
        });

        it("should trigger EVENT_SESSION_STATE_CHANGE", function () {
          spyOn($event.Event, 'trigger');
          session.open();
          var event = $event.Event.trigger.calls.mostRecent().object;
          expect(event.sender).toBe(session);
          expect(event.eventName).toBe($session.EVENT_SESSION_STATE_CHANGE);
          expect(event.sessionStateBefore).toBe($session.SESSION_STATES.CLOSED);
          expect(event.sessionStateAfter).toBe($session.SESSION_STATES.OPENING);
          expect(event.promise).toBe(session.open.shared.deferred.promise);
        });
      });

      describe("when session state is OPENING", function () {
        var promise;

        beforeEach(function () {
          session.sessionState = $session.SESSION_STATES.OPENING;
          promise = {};
        });

        it("should fetch & return promise from index", function () {
          spyOn($session.TransientSessionIndex, 'getPromiseForSession').and
          .returnValue(promise);
          var result = session.open();
          expect(result).toBe(promise);
        });
      });

      describe("when session state is OPEN", function () {
        beforeEach(function () {
          session.sessionState = $session.SESSION_STATES.OPEN;
        });

        it("should return resolved promise", function () {
          var result = session.open();
          expect(result.promiseState).toBe($utils.PROMISE_STATE_FULFILLED);
        });
      });

      describe("when session state is CLOSING", function () {
        beforeEach(function () {
          session.sessionState = $session.SESSION_STATES.CLOSING;
        });

        it("should return rejected promise", function () {
          var result = session.open();
          expect(result.promiseState).toBe($utils.PROMISE_STATE_REJECTED);
        });
      });

      describe("on resolving promise", function () {
        var deferred;
        beforeEach(function () {
          session.open();
          deferred = session.open.shared.deferred;
        });

        it("should set sessionState property to OPEN", function () {
          deferred.resolve();
          expect(session.sessionState).toBe($session.SESSION_STATES.OPEN);
        });

        it("should trigger EVENT_SESSION_STATE_CHANGE", function () {
          spyOn($event.Event, 'trigger');
          deferred.resolve();
          var event = $event.Event.trigger.calls.mostRecent().object;
          expect(event.sender).toBe(session);
          expect(event.eventName).toBe($session.EVENT_SESSION_STATE_CHANGE);
          expect(event.sessionStateBefore)
          .toBe($session.SESSION_STATES.OPENING);
          expect(event.sessionStateAfter).toBe($session.SESSION_STATES.OPEN);
        });
      });

      describe("on rejecting promise", function () {
        var deferred;
        beforeEach(function () {
          session.open();
          deferred = session.open.shared.deferred;
        });

        it("should set sessionState property to UNKNOWN", function () {
          deferred.reject();
          expect(session.sessionState).toBeUndefined();
        });

        it("should trigger EVENT_SESSION_STATE_CHANGE", function () {
          spyOn($event.Event, 'trigger');
          deferred.reject();
          var event = $event.Event.trigger.calls.mostRecent().object;
          expect(event.sender).toBe(session);
          expect(event.eventName).toBe($session.EVENT_SESSION_STATE_CHANGE);
          expect(event.sessionStateBefore)
          .toBe($session.SESSION_STATES.OPENING);
          expect(event.sessionStateAfter).toBeUndefined();
        });
      });
    });

    describe("#close()", function () {
      beforeEach(function () {
        session = Session.fromSessionId('foo');
      });

      it("should return promise", function () {
        var result = session.close();
        expect($utils.Promise.mixedBy(result)).toBeTruthy();
      });

      it("should expose deferred on shared", function () {
        var promise = session.close();
        expect($utils.Deferred.mixedBy(session.close.shared.deferred))
        .toBeTruthy();
        expect(session.close.shared.deferred.promise).toBe(promise);
      });

      it("should expose sessionStateBefore on shared", function () {
        session.open();
        expect(session.open.shared.sessionStateBefore).toBeUndefined();
      });

      describe("when session state is undefined", function () {
        beforeEach(function () {
          session.sessionState = undefined;
        });

        it("should set sessionState property to CLOSING", function () {
          session.close();
          expect(session.sessionState).toBe($session.SESSION_STATES.CLOSING);
        });

        it("should trigger EVENT_SESSION_STATE_CHANGE", function () {
          spyOn($event.Event, 'trigger');
          session.close();
          var event = $event.Event.trigger.calls.mostRecent().object;
          expect(event.sender).toBe(session);
          expect(event.eventName).toBe($session.EVENT_SESSION_STATE_CHANGE);
          expect(event.sessionStateBefore).toBeUndefined();
          expect(event.sessionStateAfter).toBe($session.SESSION_STATES.CLOSING);
          expect(event.promise).toBe(session.close.shared.deferred.promise);
        });
      });

      describe("when session state is CLOSED", function () {
        beforeEach(function () {
          session.sessionState = $session.SESSION_STATES.CLOSED;
        });

        it("should return resolved promise", function () {
          var result = session.close();
          expect(result.promiseState).toBe($utils.PROMISE_STATE_FULFILLED);
        });
      });

      describe("when session state is OPENING", function () {
        beforeEach(function () {
          session.sessionState = $session.SESSION_STATES.OPENING;
        });

        it("should return rejected promise", function () {
          var result = session.close();
          expect(result.promiseState).toBe($utils.PROMISE_STATE_REJECTED);
        });
      });

      describe("when session state is OPEN", function () {
        beforeEach(function () {
          session.sessionState = $session.SESSION_STATES.OPEN;
        });

        it("should set sessionState property to CLOSING", function () {
          session.close();
          expect(session.sessionState).toBe($session.SESSION_STATES.CLOSING);
        });

        it("should trigger EVENT_SESSION_STATE_CHANGE", function () {
          spyOn($event.Event, 'trigger');
          session.close();
          var event = $event.Event.trigger.calls.mostRecent().object;
          expect(event.sender).toBe(session);
          expect(event.eventName).toBe($session.EVENT_SESSION_STATE_CHANGE);
          expect(event.sessionStateBefore).toBe($session.SESSION_STATES.OPEN);
          expect(event.sessionStateAfter).toBe($session.SESSION_STATES.CLOSING);
          expect(event.promise).toBe(session.close.shared.deferred.promise);
        });
      });

      describe("when session state is CLOSING", function () {
        var promise;

        beforeEach(function () {
          session.sessionState = $session.SESSION_STATES.CLOSING;
          promise = {};
        });

        it("should fetch & return promise from index", function () {
          spyOn($session.TransientSessionIndex, 'getPromiseForSession').and
          .returnValue(promise);
          var result = session.close();
          expect(result).toBe(promise);
        });
      });

      describe("on resolving promise", function () {
        var deferred;
        beforeEach(function () {
          session.close();
          deferred = session.close.shared.deferred;
        });

        it("should set sessionState property to CLOSED", function () {
          deferred.resolve();
          expect(session.sessionState).toBe($session.SESSION_STATES.CLOSED);
        });

        it("should trigger EVENT_SESSION_STATE_CHANGE", function () {
          spyOn($event.Event, 'trigger');
          deferred.resolve();
          var event = $event.Event.trigger.calls.mostRecent().object;
          expect(event.sender).toBe(session);
          expect(event.eventName).toBe($session.EVENT_SESSION_STATE_CHANGE);
          expect(event.sessionStateBefore)
          .toBe($session.SESSION_STATES.CLOSING);
          expect(event.sessionStateAfter).toBe($session.SESSION_STATES.CLOSED);
        });
      });

      describe("on rejecting promise", function () {
        var deferred;
        beforeEach(function () {
          session.close();
          deferred = session.close.shared.deferred;
        });

        it("should set sessionState property to UNKNOWN", function () {
          deferred.reject();
          expect(session.sessionState).toBeUndefined();
        });

        it("should trigger EVENT_SESSION_STATE_CHANGE", function () {
          spyOn($event.Event, 'trigger');
          deferred.reject();
          var event = $event.Event.trigger.calls.mostRecent().object;
          expect(event.sender).toBe(session);
          expect(event.eventName).toBe($session.EVENT_SESSION_STATE_CHANGE);
          expect(event.sessionStateBefore)
          .toBe($session.SESSION_STATES.CLOSING);
          expect(event.sessionStateAfter).toBeUndefined();
        });
      });
    });
  });
});
