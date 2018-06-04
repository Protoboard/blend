"use strict";

var $oop = window['blend-oop'],
    $cliUtils = window['blend-cli-utils'];

describe("$cliUtils", function () {
  describe("Option", function () {
    var Option,
        option;

    beforeAll(function () {
      Option = $oop.createClass('test.$cliUtils.Option.Option')
      .blend($cliUtils.Option)
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
          result = $cliUtils.Argument.create({argumentString: "--foo"});
          expect($cliUtils.Option.mixedBy(result)).toBeTruthy();
          result = $cliUtils.Argument.create({argumentString: "--foo=bar"});
          expect($cliUtils.Option.mixedBy(result)).toBeTruthy();
        });
      });
    });
  });
});
