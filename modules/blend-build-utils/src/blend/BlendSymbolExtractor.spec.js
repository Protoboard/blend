"use strict";

var $oop = window['blend-oop'],
    $buildUtils = window['blend-build-utils'];

describe("$buildUtils", function () {
  describe("BlendSymbolExtractor", function () {
    var BlendSymbolExtractor,
        blendSymbolExtractor;

    beforeAll(function () {
      BlendSymbolExtractor = $oop.createClass('test.$buildUtils.BlendSymbolExtractor.BlendSymbolExtractor')
      .blend($buildUtils.BlendSymbolExtractor)
      .build();
      BlendSymbolExtractor.__builder.forwards = {list: [], lookup: {}};
    });

    describe("#extractExports()", function () {
      beforeEach(function () {
        blendSymbolExtractor = BlendSymbolExtractor.create();
      });

      it("should extract exported class name", function () {
        expect(blendSymbolExtractor.extractExports(
            '$foo.Bar = $oop.createClass("$foo.Bar")')).toEqual(['$foo.Bar']);
        expect(blendSymbolExtractor.extractExports(
            '$foo.Bar = $oop.createClass( "$foo.Bar"  )'))
        .toEqual(['$foo.Bar']);
      });

      it("should collapse results", function () {
        expect(blendSymbolExtractor.extractExports(
            '$oop.createClass( "$foo.Bar"  ); $oop.createClass("$foo.Bar")'))
        .toEqual(['$foo.Bar']);
      });
    });

    describe("#extractImports()", function () {
      beforeEach(function () {
        blendSymbolExtractor = BlendSymbolExtractor.create();
      });

      it("should extract mixed classes", function () {
        expect(blendSymbolExtractor.extractImports(
            'foo.mix($foo.Bar)')).toEqual(['$foo.Bar']);
        expect(blendSymbolExtractor.extractImports(
            'foo.mix(  $foo.Bar  )')).toEqual(['$foo.Bar']);
        expect(blendSymbolExtractor.extractImports(
            'foo.mix  ($foo.Bar)')).toEqual(['$foo.Bar']);
      });

      it("should extract blended classes", function () {
        expect(blendSymbolExtractor.extractImports(
            'foo.blend($foo.Bar)')).toEqual(['$foo.Bar']);
        expect(blendSymbolExtractor.extractImports(
            'foo.blend(  $foo.Bar  )')).toEqual(['$foo.Bar']);
        expect(blendSymbolExtractor.extractImports(
            'foo.blend  ($foo.Bar)')).toEqual(['$foo.Bar']);
      });

      it("should extract expected classes", function () {
        expect(blendSymbolExtractor.extractImports(
            'foo.expect($foo.Bar)')).toEqual(['$foo.Bar']);
        expect(blendSymbolExtractor.extractImports(
            'foo.expect(  $foo.Bar  )')).toEqual(['$foo.Bar']);
        expect(blendSymbolExtractor.extractImports(
            'foo.expect  ($foo.Bar)')).toEqual(['$foo.Bar']);
      });

      it("should extract implemented interfaces", function () {
        expect(blendSymbolExtractor.extractImports(
            'foo.implement($foo.Bar)')).toEqual(['$foo.Bar']);
        expect(blendSymbolExtractor.extractImports(
            'foo.implement(  $foo.Bar  )')).toEqual(['$foo.Bar']);
        expect(blendSymbolExtractor.extractImports(
            'foo.implement  ($foo.Bar)')).toEqual(['$foo.Bar']);
      });

      it("should extract forward blended classes", function () {
        expect(blendSymbolExtractor.extractImports(
            '$foo.Bar.forwardBlend()')).toEqual(['$foo.Bar']);
      });

      it("should extract delegation", function () {
        expect(blendSymbolExtractor.extractImports(
            '$foo.Bar.delegate({})')).toEqual(['$foo.Bar']);
      });

      it("should collapse results", function () {
        expect(blendSymbolExtractor.extractImports(
            'foo.blend($foo.Bar).mix($foo.Bar);' +
            '$foo.Bar.forwardBlend();' +
            '$foo.Bar.delegate({});'))
        .toEqual(['$foo.Bar']);
      });
    });
  });
});
