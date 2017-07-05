"use strict";

var $assert = window['giant-assert'],
    $oop = window['giant-oop'],
    $utils = window['giant-utils'];

describe("$assert", function () {
  var promise;

  beforeEach(function () {
    promise = $utils.Promise.create();
    spyOn($assert, 'assert').and.callThrough();
  });

  describe("isPromise()", function () {
    it("should pass message to assert", function () {
      $assert.isPromise(promise, "bar");
      expect($assert.assert).toHaveBeenCalledWith(true, "bar");
    });

    describe("when passing non-promise", function () {
      it("should throw", function () {
        expect(function () {
          $assert.isPromise({});
        }).toThrow();
      });
    });
  });

  describe("isPromiseOptional()", function () {
    it("should pass message to assert", function () {
      $assert.isPromiseOptional(promise, "bar");
      expect($assert.assert).toHaveBeenCalledWith(true, "bar");
    });

    describe("when passing non-promise", function () {
      it("should throw", function () {
        expect(function () {
          $assert.isPromiseOptional({});
        }).toThrow();
      });
    });
  });
});

describe("$utils", function () {
  describe("Promise", function () {
    var promise;

    beforeEach(function () {
      promise = $utils.Promise.create();
    });

    describe("create()", function () {
      it("should initialize state property", function () {
        expect(promise.promiseState).toBe($utils.PROMISE_STATE_PENDING);
      });

      it("should initialize deferredArguments property", function () {
        expect(promise.hasOwnProperty('deferredArguments')).toBeTruthy();
      });

      it("should initialize notificationArguments property", function () {
        expect(promise.notificationArguments).toEqual([]);
      });

      it("should initialize successHandlers property", function () {
        expect(promise.successHandlers).toEqual([]);
      });

      it("should initialize failureHandlers property", function () {
        expect(promise.failureHandlers).toEqual([]);
      });

      it("should initialize progressHandlers property", function () {
        expect(promise.progressHandlers).toEqual([]);
      });
    });

    describe("then()", function () {
      var result,
          handlers;

      beforeEach(function () {
        result = promise.then();
      });

      it("should return self", function () {
        expect(result).toBe(promise);
      });

      describe("when promise is pending", function () {
        beforeEach(function () {
          handlers = {
            successHandler: function () {},
            failureHandler: function () {},
            progressHandler: function () {}
          };
          promise.then(
              handlers.successHandler,
              handlers.failureHandler,
              handlers.progressHandler);
        });

        it("should add handlers", function () {
          expect(promise.successHandlers).toEqual([handlers.successHandler]);
          expect(promise.failureHandlers).toEqual([handlers.failureHandler]);
          expect(promise.progressHandlers).toEqual([handlers.progressHandler]);
        });

        describe("when promise was notified in the past", function () {
          beforeEach(function () {
            promise.notificationArguments = [
              ["foo", "bar"],
              ["baz", "quux"]
            ];
            spyOn(handlers, 'progressHandler');
            promise.then(
                handlers.successHandler,
                handlers.failureHandler,
                handlers.progressHandler);
          });

          it("should call handler with recorded arguments", function () {
            expect(handlers.progressHandler.calls.allArgs())
            .toEqual(promise.notificationArguments);
          });
        });
      });

      describe("when promise is already fulfilled", function () {
        beforeEach(function () {
          promise.promiseState = $utils.PROMISE_STATE_FULFILLED;
          promise.deferredArguments = ["foo", "bar"];
          handlers = {
            successHandler: function () {},
            failureHandler: function () {},
            progressHandler: function () {}
          };
          spyOn(handlers, 'successHandler');
          promise.then(
              handlers.successHandler,
              handlers.failureHandler,
              handlers.progressHandler);
        });

        it("should call success handler", function () {
          expect(handlers.successHandler).toHaveBeenCalledWith("foo", "bar");
        });

        it("should not add handlers", function () {
          expect(promise.successHandlers).toEqual([]);
          expect(promise.failureHandlers).toEqual([]);
          expect(promise.progressHandlers).toEqual([]);
        });
      });

      describe("when promise has already rejected", function () {
        beforeEach(function () {
          promise.promiseState = $utils.PROMISE_STATE_REJECTED;
          promise.deferredArguments = ["foo", "bar"];
          handlers = {
            successHandler: function () {},
            failureHandler: function () {},
            progressHandler: function () {}
          };
          spyOn(handlers, 'failureHandler');
          promise.then(
              handlers.successHandler,
              handlers.failureHandler,
              handlers.progressHandler);
        });

        it("should call failure handler", function () {
          expect(handlers.failureHandler).toHaveBeenCalledWith("foo", "bar");
        });

        it("should not add handlers", function () {
          expect(promise.successHandlers).toEqual([]);
          expect(promise.failureHandlers).toEqual([]);
          expect(promise.progressHandlers).toEqual([]);
        });
      });
    });

    describe("when()", function () {
      var deferred, thenable,
          thenableResolve, thenableReject;

      beforeEach(function () {
        deferred = $utils.Deferred.create();
        thenable = {
          then: function (successHandler, failureHandler) {
            thenableResolve = function () {
              successHandler.apply(this, arguments);
            };
            thenableReject = function () {
              failureHandler.apply(this, arguments);
            };
          }
        };
        promise = $utils.Promise.when([
          deferred.promise,
          "foo",
          thenable
        ]);
      });

      it("should return a promise", function () {
        expect($utils.Promise.mixedBy(promise)).toBeTruthy();
      });

      describe("when all promises are fulfilled", function () {
        var successHandler,
            progressHandler;

        beforeEach(function () {
          successHandler = jasmine.createSpy();
          progressHandler = jasmine.createSpy();

          promise.then(
              successHandler,
              null,
              progressHandler);

          thenableResolve("foo", "bar");
          deferred.resolve("baz", "quux");
        });

        it("should notify aggregate promise", function () {
          expect(progressHandler).toHaveBeenCalledWith("foo", "bar");
        });

        it("should resolve aggregate promise", function () {
          // first argument of the first call to successHandler
          // ... is an array of Arguments
          expect(successHandler.calls.argsFor(0)[0]
          .map(function (arg) {
            return [].slice.call(arg);
          }))
          .toEqual([
            ["foo"],
            ["foo", "bar"],
            ["baz", "quux"]
          ]);
        });
      });

      describe("when at least one promise fails", function () {
        var failureHandler;

        beforeEach(function () {
          failureHandler = jasmine.createSpy();

          promise.then(null, failureHandler);

          thenableReject("foo", "bar");
        });

        it("should reject the aggregate promise", function () {
          expect(failureHandler).toHaveBeenCalledWith("foo", "bar");
        });
      });
    });
  });
});