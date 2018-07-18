"use strict";

var $oop = window['blend-oop'],
    $session = window['blend-session'];

describe("$session", function () {
  describe("TransientSessionIndex", function () {
    var TransientSessionIndex,
        transientSessionIndex;

    beforeAll(function () {
      TransientSessionIndex = $oop.createClass('test.$session.TransientSessionIndex.TransientSessionIndex')
      .blend($session.TransientSessionIndex)
      .build();
      TransientSessionIndex.__builder.forwards = {list: [], lookup: {}};
    });

    beforeEach(function () {
      TransientSessionIndex.__builder.instances = {};
    });

    it("should be singleton", function () {
      expect(TransientSessionIndex.create())
      .toBe(TransientSessionIndex.create());
    });

    describe("#addPromiseForSession()", function () {
      var session, promise;

      beforeEach(function () {
        transientSessionIndex = TransientSessionIndex.create();
        session = $session.Session.fromSessionId('foo');
        promise = {};
        $session.index.deleteNode('_session'.toTreePath());
      });

      it("should return self", function () {
        var result = transientSessionIndex.addPromiseForSession(session, promise);
        expect(result).toBe(transientSessionIndex);
      });

      it("should set session - promise association in container", function () {
        transientSessionIndex.addPromiseForSession(session, promise);
        expect($session.index.getNode('_session.foo'.toTreePath()))
        .toBe(promise);
      });
    });

    describe("#removePromiseForSession()", function () {
      var session, promise;

      beforeEach(function () {
        transientSessionIndex = TransientSessionIndex.create();
        session = $session.Session.fromSessionId('foo');
        promise = {};
        $session.index.setNode('_session.foo'.toTreePath(), promise);
      });

      it("should return self", function () {
        var result = transientSessionIndex.removePromiseForSession(session);
        expect(result).toBe(transientSessionIndex);
      });

      it("should delete session - promise association from container", function () {
        transientSessionIndex.removePromiseForSession(session, promise);
        expect($session.index.getNode('_session.foo'.toTreePath()))
        .toBeUndefined();
      });
    });

    describe("#getPromiseForSession()", function () {
      var session, promise;

      beforeEach(function () {
        transientSessionIndex = TransientSessionIndex.create();
        session = $session.Session.fromSessionId('foo');
        promise = {};
        $session.index.setNode('_session.foo'.toTreePath(), promise);
      });

      it("should return promise associated with session", function () {
        var result = transientSessionIndex.getPromiseForSession(session);
        expect(result).toBe(promise);
      });
    });

    describe("#onSessionStateChange()", function () {
      var session, promise,
          sessionStateChangeEvent;

      beforeEach(function () {
        session = $session.Session.fromSessionId('foo');
        promise = {};
      });

      describe("on * -> OPENING", function () {
        beforeEach(function () {
          sessionStateChangeEvent = session.spawnEvent({
            eventName: $session.EVENT_SESSION_STATE_CHANGE,
            sessionStateBefore: undefined,
            sessionStateAfter: $session.SESSION_STATES.OPENING,
            promise: promise
          });

        });

        it("should add promise to registry", function () {
          spyOn($session.TransientSessionIndex, 'addPromiseForSession');
          sessionStateChangeEvent.trigger();
          expect($session.TransientSessionIndex.addPromiseForSession)
          .toHaveBeenCalledWith(session, promise);
        });
      });

      describe("on * -> CLOSING", function () {
        beforeEach(function () {
          sessionStateChangeEvent = session.spawnEvent({
            eventName: $session.EVENT_SESSION_STATE_CHANGE,
            sessionStateBefore: undefined,
            sessionStateAfter: $session.SESSION_STATES.CLOSING,
            promise: promise
          });
        });

        it("should add promise to registry", function () {
          spyOn($session.TransientSessionIndex, 'addPromiseForSession');
          sessionStateChangeEvent.trigger();
          expect($session.TransientSessionIndex.addPromiseForSession)
          .toHaveBeenCalledWith(session, promise);
        });
      });

      describe("on OPENING -> OPEN", function () {
        beforeEach(function () {
          sessionStateChangeEvent = session.spawnEvent({
            eventName: $session.EVENT_SESSION_STATE_CHANGE,
            sessionStateBefore: $session.SESSION_STATES.OPENING,
            sessionStateAfter: $session.SESSION_STATES.OPEN
          });
        });

        it("should remove promise from registry", function () {
          spyOn($session.TransientSessionIndex, 'removePromiseForSession');
          sessionStateChangeEvent.trigger();
          expect($session.TransientSessionIndex.removePromiseForSession)
          .toHaveBeenCalledWith(session);
        });
      });

      describe("on OPENING -> UNKNOWN", function () {
        beforeEach(function () {
          sessionStateChangeEvent = session.spawnEvent({
            eventName: $session.EVENT_SESSION_STATE_CHANGE,
            sessionStateBefore: $session.SESSION_STATES.OPENING,
            sessionStateAfter: $session.SESSION_STATES.UNKNOWN
          });
        });

        it("should remove promise from registry", function () {
          spyOn($session.TransientSessionIndex, 'removePromiseForSession');
          sessionStateChangeEvent.trigger();
          expect($session.TransientSessionIndex.removePromiseForSession)
          .toHaveBeenCalledWith(session);
        });
      });

      describe("on CLOSING -> CLOSED", function () {
        beforeEach(function () {
          sessionStateChangeEvent = session.spawnEvent({
            eventName: $session.EVENT_SESSION_STATE_CHANGE,
            sessionStateBefore: $session.SESSION_STATES.CLOSING,
            sessionStateAfter: $session.SESSION_STATES.CLOSED
          });
        });

        it("should remove promise from registry", function () {
          spyOn($session.TransientSessionIndex, 'removePromiseForSession');
          sessionStateChangeEvent.trigger();
          expect($session.TransientSessionIndex.removePromiseForSession)
          .toHaveBeenCalledWith(session);
        });
      });

      describe("on CLOSING -> UNKNOWN", function () {
        beforeEach(function () {
          sessionStateChangeEvent = session.spawnEvent({
            eventName: $session.EVENT_SESSION_STATE_CHANGE,
            sessionStateBefore: $session.SESSION_STATES.CLOSING,
            sessionStateAfter: $session.SESSION_STATES.UNKNOWN
          });
        });

        it("should remove promise from registry", function () {
          spyOn($session.TransientSessionIndex, 'removePromiseForSession');
          sessionStateChangeEvent.trigger();
          expect($session.TransientSessionIndex.removePromiseForSession)
          .toHaveBeenCalledWith(session);
        });
      });
    });
  });
});
