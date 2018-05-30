"use strict";

var $oop = window['blend-oop'],
    $data = window['blend-data'],
    $cliTools = window['blend-cli-tools'];

describe("$cliTools", function () {
  describe("Argv", function () {
    var Argv,
        argv;

    beforeAll(function () {
      Argv = $oop.createClass('test.$cliTools.Argv.Argv')
      .blend($cliTools.Argv)
      .build();
      Argv.__builder.forwards = {list: [], lookup: {}};
    });

    describe("fromArray()", function () {
      it("should initialize argumentCollection", function () {
        argv = Argv.fromArray(["hello", "--hello=world"]);
        expect(argv.argumentCollection.data).toEqual({
          'hello': $cliTools.Argument.fromString("hello"),
          '--hello=world': $cliTools.Option.fromString("--hello=world")
        });
      });

      it("should initialize options property", function () {
        argv = Argv.fromArray(["hello", "--hello=world"]);
        expect(argv.options.data).toEqual({
          'hello': $cliTools.Option.fromString("--hello=world")
        });
      });
    });

    describe("create()", function () {
      it("should initialize argumentCollection", function () {
        argv = Argv.create();
        expect($data.Collection.mixedBy(argv.argumentCollection)).toBeTruthy();
        expect(argv.argumentCollection.getItemCount()).toBe(0);
      });

      it("should initialize options collection", function () {
        argv = Argv.create({
          argumentCollection: $data.Collection.fromData({
            'hello': $cliTools.Argument.fromString("hello"),
            '--hello=world': $cliTools.Option.fromString("--hello=world")
          })
        });
        expect(argv.options.data).toEqual({
          'hello': $cliTools.Option.fromString("--hello=world")
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
