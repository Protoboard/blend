"use strict";

var $utils = window['giant-utils'];

describe("Debouncer", function () {
    var callback,
        debouncer;

    beforeEach(function () {
        callback = function () {};
        debouncer = $utils.Debouncer.create(callback, 50);
    });

    describe("instantiation", function () {
        it("should set scheduleDelay", function () {
            expect(debouncer.scheduleDelay).toBe(50);
        });

        it("should set scheduledCallback", function () {
            expect(debouncer.scheduledCallback).toBe(callback);
        });

        it("should initialize scheduledCallbackArguments", function () {
            expect(debouncer.scheduledCallbackArguments).toEqual([]);
        });

        it("should initialize scheduleTimers", function () {
            expect(debouncer.scheduleTimers).toEqual([]);
        });

        it("should initialize schedulerDeferred", function () {
            expect($utils.Deferred.isIncludedBy(debouncer.schedulerDeferred)).toBeTruthy();
        });

        describe("when passing invalid arguments", function () {
            it("should throw", function () {
                expect(function () {
                    $utils.Debouncer.create("foo");
                }).toThrow();
                expect(function () {
                    $utils.Debouncer.create(function () {}, "foo");
                }).toThrow();
            });
        });
    });

    describe("scheduling", function () {
        var result;

        beforeEach(function () {
            jasmine.clock().install();
            spyOn($utils, 'setTimeout').and.callThrough();
            result = debouncer.schedule("foo", "bar");
        });

        afterEach(function () {
            jasmine.clock().uninstall();
        });

        it("should return promise", function () {
            expect(result).toBe(debouncer.schedulerDeferred.promise);
        });

        it("should add arguments to list", function () {
            expect(debouncer.scheduledCallbackArguments).toEqual([["foo", "bar"]]);
        });

        it("should add timer to list", function () {
            expect($utils.Timeout.isIncludedBy(debouncer.scheduleTimers[0])).toBeTruthy();
        });

        it("should start timer", function () {
            expect($utils.setTimeout).toHaveBeenCalledWith(50, "foo", "bar");
        });

        describe("when scheduling again with same arguments", function () {
            beforeEach(function () {
                debouncer.schedule("foo", "bar");
            });

            it("should not add to argument list", function () {
                expect(debouncer.scheduledCallbackArguments).toEqual([["foo", "bar"]]);
            });

            it("should not add timer to list", function () {
                expect(debouncer.scheduleTimers[1]).toBeUndefined();
            });

            it("should restart timer", function () {
                expect($utils.setTimeout).toHaveBeenCalledWith(50, "foo", "bar");
            });
        });

        describe("when timer completes", function () {
            var progressHandler;

            beforeEach(function () {
                jasmine.clock().tick(51);
                progressHandler = jasmine.createSpy();
                result.then(null, null, progressHandler);
            });

            it("should remove affected timer from registry", function () {
                expect(debouncer.scheduleTimers).toEqual([]);
            });

            it("should remove affected arguments from registry", function () {
                expect(debouncer.scheduledCallbackArguments).toEqual([]);
            });

            it("should notify promise with corresponding arguments", function () {
                expect(progressHandler).toHaveBeenCalledWith("foo", "bar");
            });
        });

        describe("when timer gets canceled by user", function () {
            beforeEach(function () {
                debouncer.scheduleTimers[0].clearTimer();
            });

            it("should remove affected timer in registry", function () {
                expect(debouncer.scheduleTimers).toEqual([undefined]);
            });
        });
    });
});
