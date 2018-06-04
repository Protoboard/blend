"use strict";

var $oop = window['blend-oop'],
    $cliUtils = window['blend-cli-utils'];

describe("$cliUtils", function () {
  describe("Argument", function () {
    var Argument,
        argument;

    beforeAll(function () {
      Argument = $oop.createClass('test.$cliUtils.Argument.Argument')
      .blend($cliUtils.Argument)
      .build();
      Argument.__builder.forwards = {list: [], lookup: {}};
    });

    describe("fromString()", function () {
      it("should initialize argumentString property", function () {
        argument = Argument.fromString("foo");
        expect(argument.argumentString).toBe("foo");
      });
    });

    describe("toString()", function () {
      it("should return argumentString property", function () {
        argument = Argument.create({argumentString: "foo"});
        expect(argument.toString()).toBe("foo");
      });
    });
  });
});
