"use strict";

var $oop = window['blend-oop'],
    $buidUtils = window['blend-build-utils'];

describe("$buildUtils", function () {
  describe("SymbolExtractor", function () {
    var SymbolExtractor,
        symbolExtractor;

    beforeAll(function () {
      SymbolExtractor = $oop.createClass('test.$buidUtils.SymbolExtractor.SymbolExtractor')
      .blend($buidUtils.SymbolExtractor)
      .build();
      SymbolExtractor.__builder.forwards = {list: [], lookup: {}};
    });

    describe("create()", function () {
      it("should initialize exportMatchers property", function () {
        symbolExtractor = SymbolExtractor.create();
        expect(symbolExtractor.exportMatchers).toEqual([]);
      });

      it("should initialize importMatchers property", function () {
        symbolExtractor = SymbolExtractor.create();
        expect(symbolExtractor.importMatchers).toEqual([]);
      });
    });

    describe("extractExports()", function () {
      var scriptBody = "var foo=1; var bar={baz: 2}";

      beforeEach(function () {
        symbolExtractor = SymbolExtractor.create({
          exportMatchers: [/(\w+)=/g, /(\w+):/g]
        });
      });

      it("should extract exported symbols", function () {
        var result = symbolExtractor.extractExports(scriptBody);
        expect(result.sort()).toEqual(['foo', 'bar', 'baz'].sort());
      });
    });

    describe("extractImports()", function () {
      var scriptBody = "var foo=bar; var bar={baz:quux}";

      beforeEach(function () {
        symbolExtractor = SymbolExtractor.create({
          importMatchers: [/=(\w+)/g, /:(\w+)/g]
        });
      });

      it("should extract imported symbols", function () {
        var result = symbolExtractor.extractImports(scriptBody);
        expect(result.sort()).toEqual(['bar', 'quux'].sort());
      });
    });
  });
});
