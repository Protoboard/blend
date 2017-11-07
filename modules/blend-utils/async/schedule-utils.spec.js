"use strict";

var $utils = window['blend-utils'];

describe("$utils", function () {
  beforeEach(function () {
    jasmine.clock().install();
  });

  afterEach(function () {
    jasmine.clock().uninstall();
  });

  describe("debounce()", function () {
    var originalFunction,
        debounced;

    beforeEach(function () {
      originalFunction = jasmine.createSpy().and.callFake(function () {
        return 'foo';
      });
    });

    it("should return function", function () {
      debounced = $utils.debounce(originalFunction);
      expect(typeof debounced).toBe("function");
    });

    describe("on invoking debounced function", function () {
      beforeEach(function () {
        debounced = $utils.debounce(originalFunction, 50);
      });

      it("should return pending Promise", function () {
        var result = debounced();
        expect($utils.Promise.mixedBy(result)).toBeTruthy();
        expect(result.promiseState).toBe($utils.PROMISE_STATE_PENDING);
      });

      it("should set timer property on returned function", function () {
        debounced();
        expect($utils.Timer.mixedBy(debounced.timer)).toBeTruthy();
      });

      it("should set args property on returned function", function () {
        debounced('bar');
        expect(debounced.args[0]).toEqual('bar');
      });

      describe("when invoking again within delay", function () {
        var promise,
            timer;

        beforeEach(function () {
          promise = debounced('foo', 'bar');
          timer = debounced.timer;
          jasmine.clock().tick(49);
        });

        it("should restart timer", function () {
          debounced('baz', 'quux');
          expect(debounced.timer).not.toBe(timer);
        });
      });

      describe("when delay elapses", function () {
        var promise;

        beforeEach(function () {
          promise = debounced('foo', 'bar');
        });

        it("should invoke original function", function () {
          jasmine.clock().tick(51);
          expect(originalFunction).toHaveBeenCalledTimes(1);
          expect(originalFunction).toHaveBeenCalledWith('foo', 'bar');
        });

        it("should resolve returned Promise with return value", function () {
          jasmine.clock().tick(51);
          expect(promise.promiseState).toBe($utils.PROMISE_STATE_FULFILLED);
          expect(promise.deferredArguments[0]).toBe('foo');
        });
      });

      describe("when user cancels timer", function () {
        var promise;

        beforeEach(function () {
          promise = debounced();
        });

        it("should reject the promise", function () {
          jasmine.clock().tick(49);
          debounced.timer.clearTimer();
          expect(promise.promiseState).toBe($utils.PROMISE_STATE_REJECTED);
        });
      });
    });
  });

  describe("throttle()", function () {
    var originalFunction,
        throttled;

    beforeEach(function () {
      originalFunction = jasmine.createSpy().and.callFake(function () {
        return 'foo';
      });
    });

    it("should return function", function () {
      throttled = $utils.throttle(originalFunction);
      expect(typeof throttled).toBe("function");
    });

    describe("on invoking throttled function", function () {
      beforeEach(function () {
        throttled = $utils.throttle(originalFunction, 50);
      });

      it("should return pending Promise", function () {
        var result = throttled();
        expect($utils.Promise.mixedBy(result)).toBeTruthy();
        expect(result.promiseState).toBe($utils.PROMISE_STATE_PENDING);
      });

      it("should set timer property on returned function", function () {
        throttled();
        expect($utils.Timer.mixedBy(throttled.timer)).toBeTruthy();
      });

      it("should set args property on returned function", function () {
        throttled('bar');
        expect(throttled.args[0]).toEqual('bar');
      });

      describe("when invoking again within delay", function () {
        var promise;

        beforeEach(function () {
          promise = throttled('foo', 'bar');
          jasmine.clock().tick(49);
        });

        it("should update args", function () {
          throttled('quux');
          expect(throttled.args[0]).toBe('quux');
        });
      });

      describe("when delay elapses", function () {
        describe("when throttled was called", function () {
          var promise;

          beforeEach(function () {
            throttled('foo', 'bar');
            promise = throttled('baz', 'quux');
          });

          it("should invoke original function with last arguments", function () {
            jasmine.clock().tick(51);
            expect(originalFunction).toHaveBeenCalledTimes(1);
            expect(originalFunction).toHaveBeenCalledWith('baz', 'quux');
          });

          it("should notify returned Promise with return value", function () {
            jasmine.clock().tick(51);
            expect(promise.notificationArguments.pop()[0]).toBe('foo');
          });
        });

        describe("when throttled was not called", function () {
          it("should invoke original function", function () {
            jasmine.clock().tick(51);
            expect(originalFunction).not.toHaveBeenCalled();
          });
        });
      });

      describe("when user cancels timer", function () {
        var promise;

        beforeEach(function () {
          promise = throttled();
        });

        it("should reject the promise", function () {
          jasmine.clock().tick(49);
          throttled.timer.clearTimer();
          expect(promise.promiseState).toBe($utils.PROMISE_STATE_REJECTED);
        });
      });
    });
  });
});