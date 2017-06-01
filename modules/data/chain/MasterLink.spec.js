"use strict";

var $oop = window['giant-oop'],
    $data = window['giant-data'];

describe("$data", function () {
    describe("MasterLink", function () {
        var MasterLink,
            masterLink,
            chain;

        beforeEach(function () {
            $oop.Class.classLookup = {};
            MasterLink = $oop.getClass('MasterLink')
                .extend($data.MasterLink);
            chain = $data.Chain.create();
            masterLink = MasterLink.create(chain);
        });

        describe("create()", function () {
            it("should initialize previousLink property", function () {
                expect(masterLink.hasOwnProperty('previousLink')).toBeTruthy();
            });

            it("should initialize nextLink property", function () {
                expect(masterLink.hasOwnProperty('nextLink')).toBeTruthy();
            });

            it("should initialize _chain property", function () {
                expect(masterLink._chain).toBe(chain);
            });

            describe("on invalid argument", function () {
                it("should throw", function () {
                    expect(function () {
                        MasterLink.create();
                    }).toThrow();
                    expect(function () {
                        MasterLink.create('foo');
                    }).toThrow();
                });
            });
        });
    });
});
