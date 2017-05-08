"use strict";

var $assert = window['giant-assert'],
    $oop = window['giant-oop'],
    $utils = window['giant-utils'];

describe("Promise", function () {
    var promise;

    beforeEach(function () {
        promise = $utils.Promise.create();
        spyOn($assert, 'assert').and.callThrough();
    });

    describe("type assertion", function () {
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

    describe("optional type assertion", function () {
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

    describe("instantiation", function () {
        it("should initialize status property", function () {
            expect(promise.status).toBe($utils.PROMISE_STATE_UNFULFILLED);
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

    describe("chaining", function () {
        var result,
            handlers;

        beforeEach(function () {
            result = promise.then();
        });

        it("should return self", function () {
            expect(result).toBe(promise);
        });

        describe("when promise is unfulfilled", function () {
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
                    expect(handlers.progressHandler.calls.allArgs()).toEqual(promise.notificationArguments);
                });
            });
        });

        describe("when promise is already fulfilled", function () {
            beforeEach(function () {
                promise.status = $utils.PROMISE_STATE_FULFILLED;
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

        describe("when promise has already failed", function () {
            beforeEach(function () {
                promise.status = $utils.PROMISE_STATE_FAILED;
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

    describe("aggregation", function () {
        var deferred1, deferred2,
            handlers;

        beforeEach(function () {
            deferred1 = $utils.Deferred.create();
            deferred2 = $utils.Deferred.create();
            promise = $utils.Promise.when(
                deferred1.promise,
                "foo",
                deferred2.promise);
        });

        it("should return a promise", function () {
            expect($utils.Promise.isIncludedBy(promise)).toBeTruthy();
        });

        describe("when notifying individual promise", function () {
            beforeEach(function () {
                handlers = {
                    progressHandler: function () {}
                };

                spyOn(handlers, 'progressHandler');

                promise.then(null, null, handlers.progressHandler);

                deferred2.notify("foo", "bar");
            });

            it("should notify aggregate promise", function () {
                expect(handlers.progressHandler).toHaveBeenCalledWith("foo", "bar");
            });
        });

        describe("when all promises are fulfilled", function () {
            beforeEach(function () {
                handlers = {
                    successHandler: function () {},
                    progressHandler: function () {}
                };

                spyOn(handlers, 'successHandler');
                spyOn(handlers, 'progressHandler');

                promise.then(
                    handlers.successHandler,
                    null,
                    handlers.progressHandler);

                deferred2.resolve("foo", "bar");
                deferred1.resolve("baz", "quux");
            });

            it("should notify aggregate promise", function () {
                expect(handlers.progressHandler).toHaveBeenCalledWith("foo", "bar");
            });

            it("should resolve aggregate promise", function () {
                expect(handlers.successHandler).toHaveBeenCalledWith("baz", "quux");
            });
        });

        describe("when at least one promise fails", function () {
            beforeEach(function () {
                handlers = {
                    failureHandler: function () {}
                };

                spyOn(handlers, 'failureHandler');

                promise.then(null, handlers.failureHandler);

                deferred2.reject("foo", "bar");
            });

            it("should reject the aggregate promise", function () {
                expect(handlers.failureHandler).toHaveBeenCalledWith("foo", "bar");
            });
        });
    });
});
