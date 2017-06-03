"use strict";

var $oop = window['giant-oop'],
    $data = window['giant-data'];

describe("$assert", function () {
    var chain;

    beforeEach(function () {
        chain = $data.Chain.create();
        spyOn($assert, 'assert').and.callThrough();
    });

    describe("isChain()", function () {
        it("should pass message to assert", function () {
            $assert.isChain(chain, "bar");
            expect($assert.assert).toHaveBeenCalledWith(true, "bar");
        });

        describe("when passing non-promise", function () {
            it("should throw", function () {
                expect(function () {
                    $assert.isChain({});
                }).toThrow();
            });
        });
    });

    describe("isChainOptional()", function () {
        it("should pass message to assert", function () {
            $assert.isChainOptional(chain, "bar");
            expect($assert.assert).toHaveBeenCalledWith(true, "bar");
        });

        describe("when passing non-promise", function () {
            it("should throw", function () {
                expect(function () {
                    $assert.isChainOptional({});
                }).toThrow();
            });
        });
    });
});

describe("$data", function () {
    describe("Chain", function () {
        var Chain,
            chain,
            link,
            result;

        beforeEach(function () {
            Chain = $oop.getClass('test.$data.Chain.Chain')
                .extend($data.Chain);
            chain = Chain.create();
            link = $data.Link.create();
        });

        describe("create()", function () {
            it("should initialize _data", function () {
                expect(chain._data.includes($data.MasterLink)).toBeTruthy();
            });

            it("should initialize _itemCount", function () {
                expect(chain._itemCount).toBe(0);
            });
        });

        describe("clear()", function () {
            var oldMasterLink;

            beforeEach(function () {
                oldMasterLink = chain._data;
                result = chain.clear();
            });

            it("should return self", function () {
                expect(result).toBe(chain);
            });

            it("should reset _data", function () {
                expect(chain._data.includes($data.MasterLink)).toBeTruthy();
                expect(chain._data).not.toBe(oldMasterLink);
                expect(chain._data.nextLink).toBe(chain._data);
                expect(chain._data.previousLink).toBe(chain._data);
            });
        });

        describe("setItem()", function () {
            beforeEach(function () {
                spyOn(chain, 'push');
                result = chain.setItem(link);
            });

            it("should return self", function () {
                expect(result).toBe(chain);
            });

            it("should invoke push()", function () {
                expect(chain.push).toHaveBeenCalledWith(link);
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
                    .push(link1)
                    .push(link2);
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

        describe("push()", function () {
            beforeEach(function () {
                result = chain.push(link);
            });

            it("should return self", function () {
                expect(result).toBe(chain);
            });

            it("should add link", function () {
                expect(chain._data.nextLink).toBe(link);
                expect(link.previousLink).toBe(chain._data);
                expect(link._chain).toBe(chain);
            });

            it("should increment _itemCount", function () {
                expect(chain._itemCount).toBe(1);
            });
        });

        describe("pop()", function () {
            var link1,
                link2;

            beforeEach(function () {
                link1 = $data.Link.create();
                link2 = $data.Link.create();

                chain
                    .push(link1)
                    .push(link2);

                result = chain.pop();
            });

            it("should remove link", function () {
                expect(chain._data.previousLink).toBe(link1);
            });

            it("should return removed link", function () {
                expect(result).toBe(link2);
            });

            it("should decrement _itemCount", function () {
                expect(chain._itemCount).toBe(1);
            });

            describe("on last link", function () {
                beforeEach(function () {
                    chain.pop();
                    chain.pop();
                });

                it("should leave master link only", function () {
                    expect(chain._data.nextLink).toBe(chain._data);
                    expect(chain._data.previousLink).toBe(chain._data);
                });
            });
        });

        describe("unshift()", function () {
            beforeEach(function () {
                result = chain.unshift(link);
            });

            it("should return self", function () {
                expect(result).toBe(chain);
            });

            it("should add link", function () {
                expect(chain._data.previousLink).toBe(link);
                expect(link.nextLink).toBe(chain._data);
                expect(link._chain).toBe(chain);
            });

            it("should increment _itemCount", function () {
                expect(chain._itemCount).toBe(1);
            });
        });

        describe("shift()", function () {
            var link1,
                link2;

            beforeEach(function () {
                link1 = $data.Link.create();
                link2 = $data.Link.create();

                chain
                    .push(link1)
                    .push(link2);

                result = chain.shift();
            });

            it("should remove link", function () {
                expect(chain._data.nextLink).toBe(link2);
            });

            it("should return removed link", function () {
                expect(result).toBe(link1);
            });

            it("should decrement _itemCount", function () {
                expect(chain._itemCount).toBe(1);
            });

            describe("on last link", function () {
                beforeEach(function () {
                    chain.shift();
                    chain.shift();
                });

                it("should leave master link only", function () {
                    expect(chain._data.nextLink).toBe(chain._data);
                    expect(chain._data.previousLink).toBe(chain._data);
                });
            });
        });

        describe("concat()", function () {
            var Link,
                link1, link2,
                chain2,
                link3, link4;

            beforeEach(function () {
                Link = $oop.getClass('test.$data.Chain.Link')
                    .extend($data.Link)
                    .define({
                        init: function (a) {
                            this.foo = a;
                        },
                        clone: function clone() {
                            clone.returned.foo = this.foo;
                            return clone.returned;
                        }
                    });

                link1 = Link.create('A');
                link2 = Link.create('B');
                link3 = Link.create('C');
                link4 = Link.create('D');

                chain
                    .push(link1)
                    .push(link2);

                chain2 = $data.Chain.create()
                    .push(link3)
                    .push(link4);

                result = chain.concat(chain2);
            });

            it("should return instance of right class", function () {
                expect(result.includes(Chain)).toBeTruthy();
            });

            it("should concatenate chains", function () {
                expect(result._data.nextLink.foo).toEqual(link1.foo);
                expect(result._data.nextLink.nextLink.foo).toEqual(link2.foo);
                expect(result._data.nextLink.nextLink.nextLink.foo)
                    .toEqual(link3.foo);
                expect(result._data.nextLink.nextLink.nextLink.nextLink.foo)
                    .toEqual(link4.foo);
            });

            it("should set _itemCount", function () {
                expect(result._itemCount).toBe(4);
            });
        });
    });
});
