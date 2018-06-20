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
      it("should initialize defineMatchers property", function () {
        symbolExtractor = SymbolExtractor.create();
        expect(symbolExtractor.defineMatchers).toEqual([]);
      });

      it("should initialize referenceMatchers property", function () {
        symbolExtractor = SymbolExtractor.create();
        expect(symbolExtractor.referenceMatchers).toEqual([]);
      });
    });

    describe("extractDefinedSymbols()", function () {
      var scriptBody = "var foo=1; var bar={baz: 2}";

      beforeEach(function () {
        symbolExtractor = SymbolExtractor.create({
          defineMatchers: [/(\w+)=/g, /(\w+):/g]
        });
      });

      it("should extract defined symbols", function () {
        var result = symbolExtractor.extractDefinedSymbols(scriptBody);
        expect(result.sort()).toEqual(['foo', 'bar', 'baz'].sort());
      });
    });

    describe("extractReferencedSymbols()", function () {
      var scriptBody = "var foo=bar; var bar={baz:quux}";

      beforeEach(function () {
        symbolExtractor = SymbolExtractor.create({
          referenceMatchers: [/=(\w+)/g, /:(\w+)/g]
        });
      });

      it("should extract defined symbols", function () {
        var result = symbolExtractor.extractReferencedSymbols(scriptBody);
        expect(result.sort()).toEqual(['bar', 'quux'].sort());
      });
    });
  });
});
