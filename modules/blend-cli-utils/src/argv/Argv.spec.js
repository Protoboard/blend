"use strict";

var $oop = window['blend-oop'],
    $data = window['blend-data'],
    $cli = window['blend-cli-utils'];

describe("$cli", function () {
  describe("Argv", function () {
    var Argv,
        argv;

    beforeAll(function () {
      Argv = $oop.createClass('test.$cli.Argv.Argv')
      .blend($cli.Argv)
      .build();
      Argv.__builder.forwards = {list: [], lookup: {}};
    });

    describe("fromArray()", function () {
      var argumentList;

      beforeEach(function () {
        argumentList = ["hello", "--hello=world"];
      });

      it("should set argumentList", function () {
        argv = Argv.fromArray(argumentList);
        expect(argv.argumentList).toBe(argumentList);
      });

      it("should initialize argumentCollection", function () {
        argv = Argv.fromArray(["hello", "--hello=world"]);
        expect(argv.argumentCollection.data).toEqual({
          'hello': $cli.Argument.fromString("hello"),
          '--hello=world': $cli.Option.fromString("--hello=world")
        });
      });

      it("should initialize options property", function () {
        argv = Argv.fromArray(["hello", "--hello=world"]);
        expect(argv.options.data).toEqual({
          'hello': $cli.Option.fromString("--hello=world")
        });
      });
    });

    describe("create()", function () {
      var argumentList;

      beforeEach(function () {
        argumentList = ["hello", "--hello=world"];
      });

      it("should set argumentList", function () {
        argv = Argv.create({
          argumentList: argumentList
        });
        expect(argv.argumentList).toBe(argumentList);
      });

      it("should initialize argumentCollection", function () {
        argv = Argv.create({
          argumentList: argumentList
        });
        expect(argv.argumentCollection.data).toEqual({
          'hello': $cli.Argument.fromString("hello"),
          '--hello=world': $cli.Option.fromString("--hello=world")
        });
      });

      it("should initialize options property", function () {
        argv = Argv.create({
          argumentList: argumentList
        });
        expect(argv.options.data).toEqual({
          'hello': $cli.Option.fromString("--hello=world")
        });
      });
    });

    describe("getOptionValue", function () {
      beforeEach(function () {
        argv = Argv.fromArray(["foo", "bar", "--foo=bar", "--baz"]);
      });

      it("should return corresponding option value", function () {
        var result = argv.getOptionValue("foo");
        expect(result).toBe("bar");
      });

      describe("when passing absent optionName", function () {
        it("should return undefined", function () {
          var result = argv.getOptionValue("hello");
          expect(result).toBeUndefined();
        });
      });
    });

    describe("getOptionValue", function () {
      beforeEach(function () {
        argv = Argv.fromArray(["foo", "bar", "--foo=bar", "--baz"]);
      });

      describe("when option is present", function () {
        it("should return true", function () {
          expect(argv.hasOption("foo")).toBe(true);
          expect(argv.hasOption("baz")).toBe(true);
        });
      });

      describe("when option is absent", function () {
        it("should return false", function () {
          expect(argv.hasOption("bar")).toBe(false);
          expect(argv.hasOption("hello")).toBe(false);
        });
      });
    });
  });
});
