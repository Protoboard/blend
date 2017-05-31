"use strict";

var $oop = window['giant-oop'],
    $data = window['giant-data'];

describe("$data", function () {
    describe("Chain", function () {
        var Chain,
            chain,
            link,
            result;

        beforeEach(function () {
            $oop.Class.classLookup = {};
            Chain = $oop.getClass('Chain')
                .extend($data.Chain);
            chain = Chain.create();
            link = $data.Link.create();
        });

        describe("setItem()", function () {
            beforeEach(function () {
                spyOn(chain, 'pushLink');
                result = chain.setItem(link);
            });

            it("should return self", function () {
                expect(result).toBe(chain);
            });

            it("should invoke pushLink()", function () {
                expect(chain.pushLink).toHaveBeenCalledWith(link);
            });
        });

        describe("deleteItem()", function () {
            beforeEach(function () {
                spyOn(link, 'unlink');
                result = chain.deleteItem(link);
            });

            it("should return self", function () {
                expect(result).toBe(chain);
            });

            it("should invoke unlink() on item", function () {
                expect(link.unlink).toHaveBeenCalled();
            });
        });

        describe("hasItem()", function () {
            describe("for existing item", function () {
                it("should return true", function () {
                    chain.setItem(link);
                    expect(chain.hasItem(link)).toBeTruthy();
                });
            });

            describe("for absent item", function () {
                it("should return false", function () {
                    expect(chain.hasItem(link)).toBeFalsy();
                });
            });
        });

        describe("forEachItem()", function () {
            var link1,
                link2,
                callback;

            beforeEach(function () {
                link1 = $data.Link.create();
                link2 = $data.Link.create();
                chain
                    .pushLink(link1)
                    .pushLink(link2);
                callback = jasmine.createSpy();
                result = chain.forEachItem(callback);
            });

            it("should return self", function () {
                expect(result).toBe(chain);
            });

            it("should pass items to callback", function () {
                expect(callback.calls.allArgs()).toEqual([
                    [link1],
                    [link2]
                ]);
            });

            describe("when interrupted", function () {
                beforeEach(function () {
                    callback = jasmine.createSpy().and.returnValue(false);
                    chain.forEachItem(callback);
                });

                it("should stop at interruption", function () {
                    expect(callback).toHaveBeenCalledTimes(1);
                });
            });
        });

        describe("create()", function () {
            it("should initialize _data", function () {
                expect(chain._data.includes($data.MainLink)).toBeTruthy();
            });
        });

        describe("pushLink()", function () {
            beforeEach(function () {
                result = chain.pushLink(link);
            });

            it("should return self", function () {
                expect(result).toBe(chain);
            });

            it("should add link", function () {
                expect(chain._data.nextLink).toBe(link);
                expect(link.previousLink).toBe(chain._data);
                expect(link._chain).toBe(chain);
            });
        });

        describe("popLink()", function () {
            var link1,
                link2;

            beforeEach(function () {
                link1 = $data.Link.create();
                link2 = $data.Link.create();

                chain
                    .pushLink(link1)
                    .pushLink(link2);

                result = chain.popLink();
            });

            it("should remove link", function () {
                expect(chain._data.previousLink).toBe(link1);
            });

            it("should return removed link", function () {
                expect(result).toBe(link2);
            });
        });

        describe("unshiftLink()", function () {
            beforeEach(function () {
                result = chain.unshiftLink(link);
            });

            it("should return self", function () {
                expect(result).toBe(chain);
            });

            it("should add link", function () {
                expect(chain._data.previousLink).toBe(link);
                expect(link.nextLink).toBe(chain._data);
                expect(link._chain).toBe(chain);
            });
        });

        describe("shiftLink()", function () {
            var link1,
                link2;

            beforeEach(function () {
                link1 = $data.Link.create();
                link2 = $data.Link.create();

                chain
                    .pushLink(link1)
                    .pushLink(link2);

                result = chain.shiftLink();
            });

            it("should remove link", function () {
                expect(chain._data.nextLink).toBe(link2);
            });

            it("should return removed link", function () {
                expect(result).toBe(link1);
            });
        });
    });
});
