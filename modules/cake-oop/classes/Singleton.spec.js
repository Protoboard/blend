"use strict";

var $oop = window['cake-oop'];

describe("$oop", function () {
  describe("Singleton", function () {
    var Singleton,
        singleton;

    beforeEach(function () {
      delete $oop.Class.classByClassId['test.$oop.Singleton.Singleton'];
      Singleton = $oop.getClass('test.$oop.Singleton.Singleton')
      .mix($oop.Singleton);
      singleton = Singleton.create();
    });

    describe("then mixing again", function () {
      it("should not throw", function () {
        expect(function () {
          Singleton.mix($oop.Singleton);
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