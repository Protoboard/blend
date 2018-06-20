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

    describe("getIndependent()", function () {
      beforeEach(function () {
        dependencyGraph = DependencyGraph.fromData({
          A: {B: true, C: true, D: true},
          B: {C: true}
        });
      });

      it("should return StringPairList instance", function () {
        var result = dependencyGraph.getIndependent();
        expect($data.StringPairList.mixedBy(result)).toBeTruthy();
      });

      it("should return values that are not keys", function () {
        var result = dependencyGraph.getIndependent();
        expect(result.data).toEqual([
          {key: 'A', value: 'C'},
          {key: 'A', value: 'D'},
          {key: 'B', value: 'C'}
        ]);
      });

      describe("for empty graph", function () {
        beforeEach(function () {
          dependencyGraph = DependencyGraph.fromData({});
        });

        it("should return empty pair list", function () {
          var result = dependencyGraph.getIndependent();
          expect(result.getItemCount()).toBe(0);
        });
      });
    });

    describe("deletePairs()", function () {
      var pairsToDelete;

      beforeEach(function () {
        dependencyGraph = DependencyGraph.fromData({
          A: {B: true, C: true, D: true},
          B: {C: true}
        });
        pairsToDelete = $data.StringPairList.fromData([
          {key: 'A', value: 'C'},
          {key: 'A', value: 'D'}
        ]);
      });

      it("should return self", function () {
        var result = dependencyGraph.deletePairs(pairsToDelete);
        expect(result).toBe(dependencyGraph);
      });

      it("should delete specified pairs", function () {
        dependencyGraph.deletePairs(pairsToDelete);
        expect(dependencyGraph.data).toEqual({
          A: {B: true},
          B: {C: true}
        });
      });
    });

    describe("serialize()", function () {
      beforeEach(function () {
        dependencyGraph = DependencyGraph.fromData({
          A: {B: true, C: true, D: true},
          B: {C: true}
        });
      });

      it("should return items in order of dependants", function () {
        dependencyGraph.serialize();
      });
    });
  });
});
