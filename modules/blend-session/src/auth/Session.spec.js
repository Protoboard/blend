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

      it("should initialize sessionState property", function () {
        session = Session.create({
          sessionId: 'foo'
        });
        expect(session.sessionState).toBe($session.SESSION_STATES.CLOSED);
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
        expect(session.open.shared.sessionStateBefore)
        .toBe($session.SESSION_STATES.CLOSED);
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
          expect(event.sessionStateBefore).toBe($session.SESSION_STATES.OPENING);
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
          expect(session.sessionState).toBe($session.SESSION_STATES.UNKNOWN);
        });

        it("should trigger EVENT_SESSION_STATE_CHANGE", function () {
          spyOn($event.Event, 'trigger');
          deferred.reject();
          var event = $event.Event.trigger.calls.mostRecent().object;
          expect(event.sender).toBe(session);
          expect(event.eventName).toBe($session.EVENT_SESSION_STATE_CHANGE);
          expect(event.sessionStateBefore).toBe($session.SESSION_STATES.OPENING);
          expect(event.sessionStateAfter).toBe($session.SESSION_STATES.UNKNOWN);
        });
      });
    });

    describe("#close()", function () {
      beforeEach(function () {
        session = Session.create({
          sessionId: 'foo',
          sessionState: $session.SESSION_STATES.OPEN
        });
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
        expect(session.open.shared.sessionStateBefore)
        .toBe($session.SESSION_STATES.OPEN);
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
          expect(event.sessionStateBefore).toBe($session.SESSION_STATES.CLOSING);
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
          expect(session.sessionState).toBe($session.SESSION_STATES.UNKNOWN);
        });

        it("should trigger EVENT_SESSION_STATE_CHANGE", function () {
          spyOn($event.Event, 'trigger');
          deferred.reject();
          var event = $event.Event.trigger.calls.mostRecent().object;
          expect(event.sender).toBe(session);
          expect(event.eventName).toBe($session.EVENT_SESSION_STATE_CHANGE);
          expect(event.sessionStateBefore).toBe($session.SESSION_STATES.CLOSING);
          expect(event.sessionStateAfter).toBe($session.SESSION_STATES.UNKNOWN);
        });
      });
    });
  });
});
