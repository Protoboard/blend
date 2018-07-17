"use strict";

var $oop = window['blend-oop'],
    $data = window['blend-data'],
    $buildUtils = window['blend-build-utils'];

describe("$buildUtils", function () {
  describe("DependencyGraph", function () {
    var DependencyGraph,
        dependencyGraph;

    beforeAll(function () {
      DependencyGraph = $oop.createClass('test.$buildUtils.DependencyGraph.DependencyGraph')
      .blend($buildUtils.DependencyGraph)
      .build();
      DependencyGraph.__builder.forwards = {list: [], lookup: {}};
    });

    describe("#getSinkEdges()", function () {
      beforeEach(function () {
        dependencyGraph = DependencyGraph.fromData({
          A: {B: 1, C: 1, D: 1},
          B: {C: 1}
        });
      });

      it("should return StringDictionary instance", function () {
        var result = dependencyGraph.getSinkEdges();
        expect($data.StringDictionary.mixedBy(result)).toBeTruthy();
      });

      it("should return values that are not keys", function () {
        var result = dependencyGraph.getSinkEdges();
        expect(result.data).toEqual({
          A: {C: 1, D: 1},
          B: {C: 1}
        });
      });

      describe("for empty graph", function () {
        beforeEach(function () {
          dependencyGraph = DependencyGraph.fromData({});
        });

        it("should return empty pair list", function () {
          var result = dependencyGraph.getSinkEdges();
          expect(result.getItemCount()).toBe(0);
        });
      });
    });

    describe("#deleteEdgesForSourceNodes()", function () {
      var pairsToDelete;

      beforeEach(function () {
        dependencyGraph = DependencyGraph.fromData({
          A: {B: 1, C: 1, D: 1},
          B: {C: 1}
        });
        pairsToDelete = $data.StringPairList.fromData([
          {key: 'A', value: 'C'},
          {key: 'A', value: 'D'}
        ]);
      });

      it("should return self", function () {
        var result = dependencyGraph.deleteEdgesForSourceNodes(pairsToDelete);
        expect(result).toBe(dependencyGraph);
      });

      it("should delete specified pairs", function () {
        dependencyGraph.deleteEdgesForSourceNodes(pairsToDelete);
        expect(dependencyGraph.data).toEqual({
          A: {B: 1},
          B: {C: 1}
        });
      });
    });

    describe("#serialize()", function () {
      beforeEach(function () {
        dependencyGraph = DependencyGraph.fromData({
          A: {B: 1, C: 1, D: 1},
          B: {C: 1},
          D: {C: 1},
          C: {}
        });
      });

      it("should return items in order of dependants", function () {
        var result = dependencyGraph.serialize();
        expect(result).toEqual(["C", "B", "D", "A"]);
      });

      describe("on circular dependencies", function () {
        beforeEach(function () {
          dependencyGraph = DependencyGraph.fromData({
            A: {B: 1, C: 1, D: 1},
            B: {C: 1, D: 1},
            D: {A: 1}
          });
        });

        it("should throw", function () {
          expect(function () {
            dependencyGraph.serialize();
          }).toThrow();
        });
      });
    });
  });
});
