"use strict";

var $oop = window['blend-oop'],
    $utils = window['blend-utils'];

describe("$utils", function () {
  describe("Promise", function () {
    var promise;

    describe("create()", function () {
      it("should initialize state property", function () {
        promise = $utils.Promise.create();
        expect(promise.promiseState).toBe($utils.PROMISE_STATE_PENDING);
      });

      it("should initialize notificationArguments property", function () {
        promise = $utils.Promise.create();
        expect(promise.notificationArguments).toEqual([]);
      });

      it("should initialize successHandlers property", function () {
        promise = $utils.Promise.create();
        expect(promise.successHandlers).toEqual([]);
      });

      it("should initialize failureHandlers property", function () {
        promise = $utils.Promise.create();
        expect(promise.failureHandlers).toEqual([]);
      });

      it("should initialize progressHandlers property", function () {
        promise = $utils.Promise.create();
        expect(promise.progressHandlers).toEqual([]);
      });
    });

    describe("then()", function () {
      var handlers;

      beforeEach(function () {
        promise = $utils.Promise.create();
      });

      it("should return self", function () {
        var result = promise.then();
        expect(result).toBe(promise);
      });

      describe("when promise is pending", function () {
        beforeEach(function () {
          handlers = {
            successHandler: function () {},
            failureHandler: function () {},
            progressHandler: function () {}
          };
        });

        it("should add handlers", function () {
          promise.then(
              handlers.successHandler,
              handlers.failureHandler,
              handlers.progressHandler);
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
          });

          it("should call handler with recorded arguments", function () {
            promise.then(
                handlers.successHandler,
                handlers.failureHandler,
                handlers.progressHandler);
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
      });

      it("should return a promise", function () {
        promise = $utils.Promise.when([
          deferred.promise,
          "foo",
          thenable
        ]);
        expect($utils.Promise.mixedBy(promise)).toBeTruthy();
      });

      describe("when passing empty list", function () {
        var successHandler;

        beforeEach(function () {
          promise = $utils.Promise.when([]);
          successHandler = jasmine.createSpy();

          promise.then(successHandler);
        });

        it("should resolve aggregate promise", function () {
          expect(successHandler).toHaveBeenCalledWith();
        });
      });

      describe("when all promises are fulfilled", function () {
        var successHandler,
            progressHandler;

        beforeEach(function () {
          promise = $utils.Promise.when([
            deferred.promise,
            "foo",
            thenable
          ]);
          successHandler = jasmine.createSpy();
          progressHandler = jasmine.createSpy();

          promise.then(
              successHandler,
              null,
              progressHandler);
        });

        it("should notify aggregate promise", function () {
          thenableResolve("foo", "bar");
          deferred.resolve("baz", "quux");
          expect(progressHandler).toHaveBeenCalledWith("foo", "bar");
        });

        it("should resolve aggregate promise", function () {
          thenableResolve("foo", "bar");
          deferred.resolve("baz", "quux");
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
          promise = $utils.Promise.when([
            deferred.promise,
            "foo",
            thenable
          ]);
          promise.then(null, failureHandler);
        });

        it("should reject the aggregate promise", function () {
          deferred.resolve("baz", "quux");
          thenableReject("foo", "bar");
          expect(failureHandler).toHaveBeenCalledWith("foo", "bar");
        });
      });
    });
  });
});