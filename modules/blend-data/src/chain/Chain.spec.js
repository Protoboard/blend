"use strict";

var $oop = window['blend-oop'],
    $data = window['blend-data'];

describe("$data", function () {
  var result;

  describe("Chain", function () {
    var Chain,
        chain,
        link;

    beforeAll(function () {
      Chain = $oop.createClass('test.$data.Chain.Chain')
      .blend($data.Chain)
      .build();
    });

    beforeEach(function () {
      chain = Chain.create();
      link = $data.Link.create();
    });

    describe("create()", function () {
      it("should initialize data", function () {
        expect(chain.data.mixes($data.MasterLink)).toBeTruthy();
      });

      it("should initialize _itemCount", function () {
        expect(chain._itemCount).toBe(0);
      });
    });

    describe("clear()", function () {
      var oldMasterLink;

      beforeEach(function () {
        oldMasterLink = chain.data;
        result = chain.clear();
      });

      it("should return self", function () {
        expect(result).toBe(chain);
      });

      it("should reset data", function () {
        expect(chain.data.mixes($data.MasterLink)).toBeTruthy();
        expect(chain.data).not.toBe(oldMasterLink);
        expect(chain.data.nextLink).toBe(chain.data);
        expect(chain.data.previousLink).toBe(chain.data);
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
        expect(chain.data.nextLink).toBe(link);
        expect(link.previousLink).toBe(chain.data);
        expect(link.chain).toBe(chain);
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
        expect(chain.data.previousLink).toBe(link1);
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
          expect(chain.data.nextLink).toBe(chain.data);
          expect(chain.data.previousLink).toBe(chain.data);
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
        expect(chain.data.previousLink).toBe(link);
        expect(link.nextLink).toBe(chain.data);
        expect(link.chain).toBe(chain);
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
        expect(chain.data.nextLink).toBe(link2);
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
          expect(chain.data.nextLink).toBe(chain.data);
          expect(chain.data.previousLink).toBe(chain.data);
        });
      });
    });

    describe("concat()", function () {
      var Link,
          link1, link2,
          chain2,
          link3, link4;

      beforeAll(function () {
        Link = $oop.createClass('test.$data.Chain.Link')
        .blend($data.Link)
        .define({
          clone: function clone() {
            clone.returned.foo = this.foo;
            return clone.returned;
          }
        })
        .build();
      });

      beforeEach(function () {
        link1 = Link.create({foo: 'A'});
        link2 = Link.create({foo: 'B'});
        link3 = Link.create({foo: 'C'});
        link4 = Link.create({foo: 'D'});

        chain
        .push(link1)
        .push(link2);

        chain2 = $data.Chain.create()
        .push(link3)
        .push(link4);

        result = chain.concat(chain2);
      });

      it("should return instance of right class", function () {
        expect(result.mixes(Chain)).toBeTruthy();
      });

      it("should concatenate chains", function () {
        expect(result.data.nextLink.foo).toEqual(link1.foo);
        expect(result.data.nextLink.nextLink.foo).toEqual(link2.foo);
        expect(result.data.nextLink.nextLink.nextLink.foo).toEqual(link3.foo);
        expect(result.data.nextLink.nextLink.nextLink.nextLink.foo)
        .toEqual(link4.foo);
      });

      it("should set _itemCount", function () {
        expect(result._itemCount).toBe(4);
      });
    });
  });

  describe("SetContainer", function () {
    describe("toChain()", function () {
      var container,
          transformed;

      beforeEach(function () {
        container = $data.Chain.create();
        transformed = {};
        spyOn(container, 'to').and.returnValue(transformed);
        result = container.toChain();
      });

      it("should invoke to() on container", function () {
        expect(container.to).toHaveBeenCalledWith($data.Chain);
      });

      it("should initialize data buffer", function () {
        expect(result).toBe(transformed);
      });
    });
  });

  describe("KeyValueContainer", function () {
    describe("toChain()", function () {
      var container,
          transformed;

      beforeEach(function () {
        container = $data.Chain.create();
        transformed = {};
        spyOn(container, 'to').and.returnValue(transformed);
        result = container.toChain();
      });

      it("should invoke to() on container", function () {
        expect(container.to).toHaveBeenCalledWith($data.Chain);
      });

      it("should initialize data buffer", function () {
        expect(result).toBe(transformed);
      });
    });
  });
});
