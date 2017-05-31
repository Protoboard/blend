"use strict";

var $oop = window['giant-oop'],
    $data = window['giant-data'];

describe("$data", function () {
    describe("MainLink", function () {
        var MainLink,
            mainLink;

        beforeEach(function () {
            $oop.Class.classLookup = {};
            MainLink = $oop.getClass('MainLink')
                .extend($data.MainLink);
            mainLink = MainLink.create();
        });

        describe("create()", function () {
            it("should initialize previousLink property", function () {
                expect(mainLink.hasOwnProperty('previousLink')).toBeTruthy();
            });

            it("should initialize nextLink property", function () {
                expect(mainLink.hasOwnProperty('nextLink')).toBeTruthy();
            });

            it("should initialize _chain property", function () {
                expect(mainLink.hasOwnProperty('_chain')).toBeTruthy();
            });

            // TODO: Add invalid argument tests
        });
    });
});
