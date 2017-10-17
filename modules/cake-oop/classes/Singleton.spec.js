"use strict";

var $oop = window['cake-oop'];

describe("$oop", function () {
  describe("Singleton", function () {
    var Singleton,
        singleton;

    beforeAll(function () {
      Singleton = $oop.getClass('test.$oop.Singleton.Singleton')
      .blend($oop.Singleton);
    });

    beforeEach(function () {
      singleton = Singleton.create();
    });

    describe("then mixing again", function () {
      it("should not throw", function () {
        expect(function () {
          Singleton.blend($oop.Singleton);
        }).not.toThrow();
      });
    });

    describe("create()", function () {
      it("should return the same instance", function () {
        expect(Singleton.create()).toBe(singleton);
      });
    });
  });
});