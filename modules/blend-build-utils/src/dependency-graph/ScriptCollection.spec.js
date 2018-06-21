"use strict";

var $oop = window['blend-oop'],
    $buildUtils = window['blend-build-utils'];

describe("$buildUtils", function () {
  describe("ScriptCollection", function () {
    var ScriptCollection,
        scriptCollection,
        extractor;

    beforeAll(function () {
      ScriptCollection = $oop.createClass('test.$buildUtils.ScriptCollection.ScriptCollection')
      .blend($buildUtils.ScriptCollection)
      .build();
      ScriptCollection.__builder.forwards = {list: [], lookup: {}};
      extractor = $buildUtils.BlendSymbolExtractor.create();
    });

    describe("getFilePathsVsExports()", function () {
      beforeEach(function () {
        scriptCollection = ScriptCollection.fromData({
          'foo.js': $buildUtils.Script.fromScriptBody(
              'Foo = $oop.createClass("Foo")'),
          'bar.js': $buildUtils.Script.fromScriptBody(
              'Bar = $oop.createClass("Bar").blend(Foo)')
        });
      });

      it("should resolve exported symbols", function () {
        var result = scriptCollection.getFilePathsVsExports(extractor);
        expect(result.data).toEqual({
          "foo.js": {
            "Foo": 1
          },
          "bar.js": {
            "Bar": 1
          }
        });
      });
    });

    describe("getFilePathsVsImports()", function () {
      beforeEach(function () {
        scriptCollection = ScriptCollection.fromData({
          'foo.js': $buildUtils.Script.fromScriptBody(
              'Foo = $oop.createClass("Foo")'),
          'bar.js': $buildUtils.Script.fromScriptBody(
              'Bar = $oop.createClass("Bar").blend(Foo)')
        });
      });

      it("should resolve imported symbols", function () {
        var result = scriptCollection.getFilePathsVsImports(extractor);
        expect(result.data).toEqual({
          "bar.js": {
            "Foo": 1
          }
        });
      });
    });

    describe("getDependencyOrder()", function () {
      beforeEach(function () {
        scriptCollection = ScriptCollection.fromData({
          'foo.js': $buildUtils.Script.fromScriptBody(
              'Foo = $oop.createClass("Foo")'),
          'bar.js': $buildUtils.Script.fromScriptBody(
              'Bar = $oop.createClass("Bar").blend(Foo)')
        });
      });

      it("should resolve script order", function () {
        var result = scriptCollection.getDependencyOrder(extractor);
        expect(result).toEqual(["foo.js", "bar.js"]);
      });
    });
  });
});
