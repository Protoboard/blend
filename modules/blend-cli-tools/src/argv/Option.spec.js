"use strict";

var $oop = window['blend-oop'],
    $cliTools = window['blend-cli-tools'];

describe("$cliTools", function () {
  describe("Option", function () {
    var Option,
        option;

    beforeAll(function () {
      Option = $oop.createClass('test.$cliTools.Option.Option')
      .blend($cliTools.Option)
      .build();
      Option.__builder.forwards = {list: [], lookup: {}};
    });

    describe("create()", function () {
      it("should initialize optionName property", function () {
        option = Option.create({argumentString: "--foo"});
        expect(option.optionName).toBe("foo");
        option = Option.create({argumentString: "--foo=bar"});
        expect(option.optionName).toBe("foo");
      });

      it("should initialize optionValue property", function () {
        option = Option.create({argumentString: "--foo"});
        expect(option.optionValue).toBe(true);
        option = Option.create({argumentString: "--foo=bar"});
        expect(option.optionValue).toBe("bar");
      });

      describe("on invalid option format", function () {
        it("should initialize optionName & optionValue", function () {
          option = Option.create({argumentString: ""});
          expect(option.optionName).toBeUndefined();
          expect(option.optionValue).toBeUndefined();
        });
      });
    });
  });

  describe("Argument", function () {
    describe("create()", function () {
      describe("when passing option format", function () {
        var result;

        it("should return Option instance", function () {
          result = $cliTools.Argument.create({argumentString: "--foo"});
          expect($cliTools.Option.mixedBy(result)).toBeTruthy();
          result = $cliTools.Argument.create({argumentString: "--foo=bar"});
          expect($cliTools.Option.mixedBy(result)).toBeTruthy();
        });
      });
    });
  });
});
