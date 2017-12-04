"use strict";

var $oop = window['blend-oop'];

describe("$oop", function () {
  describe("Singleton", function () {
    var singletonBuilder,
        Singleton,
        singleton;

    beforeAll(function () {
      singletonBuilder = $oop.createClass('test.$oop.Singleton.Singleton')
      .blend($oop.Singleton);
      Singleton = singletonBuilder.build();
    });

    beforeEach(function () {
      singleton = Singleton.create();
    });

    describe("then mixing again", function () {
      it("should not throw", function () {
        expect(function () {
          singletonBuilder.blend($oop.Singleton);
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