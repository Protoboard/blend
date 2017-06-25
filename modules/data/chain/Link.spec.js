"use strict";

var $oop = window['giant-oop'],
    $data = window['giant-data'];

describe("$data", function () {
  describe("Link", function () {
    var Link,
        link,
        result;

    beforeEach(function () {
      Link = $oop.getClass('test.$data.Link.Link')
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

      it("should initialize chain property", function () {
        expect(link.hasOwnProperty('chain')).toBeTruthy();
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
        link2.chain = $data.Chain.create();
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

      it("should set chain", function () {
        expect(link.chain).toBe(link2.chain);
      });

      it("should set self as new previousLink of old nextLink", function () {
        expect(oldNextLink.previousLink).toBe(link);
      });

      it("should set self as new nextLink", function () {
        expect(link2.nextLink).toBe(link);
      });

      it("should increment _itemCount on chain", function () {
        expect(link.chain._itemCount).toBe(1);
      });

      describe("to unchained link", function () {
        it("should throw", function () {
          expect(function () {
            link.addAfter($data.Link.create());
          }).toThrow();
        });
      });

      describe("to self", function () {
        it("should throw", function () {
          expect(function () {
            link.addAfter(link);
          }).toThrow();
        });
      });

      describe("then adding again", function () {
        it("should end up in same state", function () {
          link.addAfter(link2);
          expect(link.nextLink).toBe(oldNextLink);
          expect(link.previousLink).toBe(link2);
          expect(link.chain).toBe(link2.chain);
          expect(oldNextLink.previousLink).toBe(link);
          expect(link2.nextLink).toBe(link);
          expect(link.chain._itemCount).toBe(1);
        });
      });

      describe("then adding to different link", function () {
        var link3;

        beforeEach(function () {
          link3 = $data.MasterLink.create($data.Chain.create());
          spyOn(link, 'unlink');
          link.addAfter(link3);
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
        link2.chain = $data.Chain.create();
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

      it("should set chain", function () {
        expect(link.chain).toBe(link2.chain);
      });

      it("should set self as new nextLink of old previousLink", function () {
        expect(oldPreviousLink.nextLink).toBe(link);
      });

      it("should set self as new previousLink", function () {
        expect(link2.previousLink).toBe(link);
      });

      it("should increment _itemCount on chain", function () {
        expect(link.chain._itemCount).toBe(1);
      });

      describe("to unchained link", function () {
        it("should throw", function () {
          expect(function () {
            link.addBefore($data.Link.create());
          }).toThrow();
        });
      });

      describe("to self", function () {
        it("should throw", function () {
          expect(function () {
            link.addBefore(link);
          }).toThrow();
        });
      });

      describe("then adding again", function () {
        it("should end up in same state", function () {
          link.addBefore(link2);
          expect(link.nextLink).toBe(link2);
          expect(link.previousLink).toBe(oldPreviousLink);
          expect(link.chain).toBe(link2.chain);
          expect(oldPreviousLink.nextLink).toBe(link);
          expect(link2.previousLink).toBe(link);
          expect(link.chain._itemCount).toBe(1);
        });
      });

      describe("then adding to different link", function () {
        var link3;

        beforeEach(function () {
          link3 = $data.MasterLink.create($data.Chain.create());
          spyOn(link, 'unlink');
          link.addBefore(link3);
        });

        it("should unlink link before adding", function () {
          expect(link.unlink).toHaveBeenCalled();
        });
      });
    });

    describe("unlink()", function () {
      var oldPreviousLink,
          oldNextLink,
          oldChain;

      beforeEach(function () {
        oldPreviousLink = {};
        oldNextLink = {};
        oldChain = $data.Chain.create()
        .setItem($data.Link.create())
        .setItem($data.Link.create());
        link.chain = oldChain;
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

      it("should clear chain", function () {
        expect(link.chain).toBeUndefined();
      });

      it("should decrement _itemCount on old chain", function () {
        expect(oldChain._itemCount).toBe(1);
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
