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

    describe("getFileNamesVsDefined()", function () {
      beforeEach(function () {
        scriptCollection = ScriptCollection.fromData({
          'foo.js': $buildUtils.Script.fromScriptBody(
              'Foo = $oop.createClass("Foo")'),
          'bar.js': $buildUtils.Script.fromScriptBody(
              'Bar = $oop.createClass("Bar").blend(Foo)')
        });
      });

      it("should resolve defined symbols", function () {
        var result = scriptCollection.getFileNamesVsDefined(extractor);
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

    describe("getFileNamesVsReferenced()", function () {
      beforeEach(function () {
        scriptCollection = ScriptCollection.fromData({
          'foo.js': $buildUtils.Script.fromScriptBody(
              'Foo = $oop.createClass("Foo")'),
          'bar.js': $buildUtils.Script.fromScriptBody(
              'Bar = $oop.createClass("Bar").blend(Foo)')
        });
      });

      it("should resolve referenced symbols", function () {
        var result = scriptCollection.getFileNamesVsReferenced(extractor);
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

      it("should resolve referenced symbols", function () {
        var result = scriptCollection.getDependencyOrder(extractor);
        expect(result).toEqual(["foo.js", "bar.js"]);
      });
    });
  });
});
