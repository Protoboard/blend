"use strict";

var $oop = window['giant-oop'],
    $data = window['giant-data'];

describe("$data", function () {
    describe("Link", function () {
        var Link,
            link,
            result;

        beforeEach(function () {
            $oop.Class.classLookup = {};
            Link = $oop.getClass('Link')
                .extend($data.Link);
            link = Link.create();
        });

        describe("create()", function () {
            it("should initialize previousLink property", function () {
                expect(link.hasOwnProperty('previousLink')).toBeTruthy();
            });

            it("should initialize nextLink property", function () {
                expect(link.hasOwnProperty('nextLink')).toBeTruthy();
            });

            it("should initialize _chain property", function () {
                expect(link.hasOwnProperty('_chain')).toBeTruthy();
            });
        });

        describe("addAfter()", function () {
            var link2,
                oldPreviousLink,
                oldNextLink;

            beforeEach(function () {
                link2 = Link.create();
                oldPreviousLink = {};
                oldNextLink = {};
                link2.previousLink = oldPreviousLink;
                link2.nextLink = oldNextLink;
                link2._chain = {};
                result = link.addAfter(link2);
            });

            it("should return self", function () {
                expect(result).toBe(link);
            });

            it("should set previousLink", function () {
                expect(link.previousLink).toBe(link2);
            });

            it("should set nextLink", function () {
                expect(link.nextLink).toBe(oldNextLink);
            });

            it("should set _chain", function () {
                expect(link._chain).toBe(link2._chain);
            });

            it("should set self as new previousLink of old nextLink", function () {
                expect(oldNextLink.previousLink).toBe(link);
            });

            it("should set self as new nextLink", function () {
                expect(link2.nextLink).toBe(link);
            });

            describe("then adding again", function () {
                beforeEach(function () {
                    spyOn(link, 'unlink');
                    link.addAfter(link2);
                });

                it("should unlink link before adding", function () {
                    expect(link.unlink).toHaveBeenCalled();
                });
            });
        });

        describe("addBefore()", function () {
            var link2,
                oldPreviousLink,
                oldNextLink;

            beforeEach(function () {
                link2 = Link.create();
                oldPreviousLink = {};
                oldNextLink = {};
                link2.previousLink = oldPreviousLink;
                link2.nextLink = oldNextLink;
                link2._chain = {};
                result = link.addBefore(link2);
            });

            it("should return self", function () {
                expect(result).toBe(link);
            });

            it("should set nextLink", function () {
                expect(link.nextLink).toBe(link2);
            });

            it("should set previousLink", function () {
                expect(link.previousLink).toBe(oldPreviousLink);
            });

            it("should set _chain", function () {
                expect(link._chain).toBe(link2._chain);
            });

            it("should set self as new nextLink of old previousLink", function () {
                expect(oldPreviousLink.nextLink).toBe(link);
            });

            it("should set self as new previousLink", function () {
                expect(link2.previousLink).toBe(link);
            });

            describe("then adding again", function () {
                beforeEach(function () {
                    spyOn(link, 'unlink');
                    link.addBefore(link2);
                });

                it("should unlink link before adding", function () {
                    expect(link.unlink).toHaveBeenCalled();
                });
            });
        });

        describe("unlink()", function () {
            var oldPreviousLink,
                oldNextLink;

            beforeEach(function () {
                oldPreviousLink = {};
                oldNextLink = {};
                link.previousLink = oldPreviousLink;
                link.nextLink = oldNextLink;
                result = link.unlink();
            });

            it("should return self", function () {
                expect(result).toBe(link);
            });

            it("should set old nextLink on old previousLink", function () {
                expect(oldPreviousLink.nextLink).toBe(oldNextLink);
            });

            it("should set old previousLink on old nextLink", function () {
                expect(oldNextLink.previousLink).toBe(oldPreviousLink);
            });

            it("should clear nextLink", function () {
                expect(link.nextLink).toBeUndefined();
            });

            it("should clear previousLink", function () {
                expect(link.previousLink).toBeUndefined();
            });

            it("should clear _chain", function () {
                expect(link._chain).toBeUndefined();
            });

            describe("then unlinking again", function () {
                it("should do nothing", function () {
                    expect(function () {
                        link.unlink();
                    }).not.toThrow();
                });
            });
        });
    });
});
