"use strict";

var $oop = window['blend-oop'],
    $cliTools = window['blend-cli-tools'];

describe("$cliTools", function () {
  describe("Argument", function () {
    var Argument,
        argument;

    beforeAll(function () {
      Argument = $oop.createClass('test.$cliTools.Argument.Argument')
      .blend($cliTools.Argument)
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
