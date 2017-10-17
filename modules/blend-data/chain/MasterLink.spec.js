"use strict";

var $oop = window['blend-oop'],
    $data = window['blend-data'];

describe("$data", function () {
  describe("MasterLink", function () {
    var MasterLink,
        masterLink,
        chain;

    beforeAll(function () {
      MasterLink = $oop.getClass('test.$data.MasterLink.MasterLink')
      .blend($data.MasterLink);
    });

    beforeEach(function () {
      chain = $data.Chain.create();
      masterLink = MasterLink.create({chain: chain});
    });

    describe("create()", function () {
      it("should initialize previousLink property", function () {
        expect(masterLink.hasOwnProperty('previousLink')).toBeTruthy();
      });

      it("should initialize nextLink property", function () {
        expect(masterLink.hasOwnProperty('nextLink')).toBeTruthy();
      });

      it("should initialize chain property", function () {
        expect(masterLink.chain).toBe(chain);
      });

      describe("on invalid argument", function () {
        it("should throw", function () {
          expect(function () {
            MasterLink.create();
          }).toThrow();
          expect(function () {
            MasterLink.create({chain: 'foo'});
          }).toThrow();
        });
      });
    });
  });
});
