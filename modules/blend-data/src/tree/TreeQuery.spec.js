"use strict";

var $data = window['blend-data'];

describe("$data", function () {
  describe("TreeQuery", function () {
    var TreeQuery,
        treeQuery,
        result;

    beforeAll(function () {
      TreeQuery = $oop.createClass('test.$data.TreeQuery.TreeQuery')
      .blend($data.TreeQuery)
      .build();
    });

    describe("create()", function () {
      treeQuery = TreeQuery.create({
        components: [
          'foo',
          'bar',
          $data.TreeQueryComponent.fromString('*')
        ]
      });

      it("should initialize components property", function () {
        expect(treeQuery.components).toEqual([
          $data.TreeQueryComponent.fromString('foo'),
          $data.TreeQueryComponent.fromString('bar'),
          $data.TreeQueryComponent.fromString('*')
        ]);
      });
    });

    describe("fromComponents()", function () {
      var components;

      beforeEach(function () {
        components = ['foo', 'bar', 'baz'];
      });

      it("should return TreeQuery instance", function () {
        treeQuery = TreeQuery.fromComponents(components);
        expect(TreeQuery.mixedBy(treeQuery)).toBeTruthy();
      });

      it("should set components property", function () {
        treeQuery = TreeQuery.fromComponents(components);
        expect(treeQuery.components).toEqual([
          'foo'.toTreeQueryComponent(),
          'bar'.toTreeQueryComponent(),
          'baz'.toTreeQueryComponent()
        ]);
      });

      it("should pass additional properties to create", function () {
        treeQuery = TreeQuery.fromComponents(components, {bar: 'baz'});
        expect(treeQuery.bar).toBe('baz');
      });
    });

    describe("fromString()", function () {
      it("should create a TreeQuery instance", function () {
        treeQuery = TreeQuery.fromString('foo.*.bar:!baz');
        expect(TreeQuery.mixedBy(treeQuery)).toBeTruthy();
      });

      it("should set components property", function () {
        treeQuery = TreeQuery.fromString('foo.*.bar:!baz');
        expect(treeQuery.components).toEqual([
          'foo'.toTreeQueryComponent(),
          '*'.toTreeQueryComponent(),
          'bar:!baz'.toTreeQueryComponent()
        ]);
      });

      it("should pass additional properties to create", function () {
        treeQuery = TreeQuery.fromString('foo.*.bar:!baz', {bar: 'baz'});
        expect(treeQuery.bar).toBe('baz');
      });
    });

    describe("clone()", function () {
      beforeEach(function () {
        treeQuery = TreeQuery.create({
          components: [
            'foo',
            'bar',
            $data.TreeQueryComponent.fromString('*')
          ]
        });
      });

      it("should initialize properties", function () {
        result = treeQuery.clone();
        expect(result.components).not.toBe(treeQuery.components);
        expect(result.components).toEqual(treeQuery.components);
      });
    });

    describe("toString()", function () {
      beforeEach(function () {
        treeQuery = TreeQuery.create({components: ['foo.baz', 'bar', '*']});
      });

      it("should return string", function () {
        result = treeQuery.toString();
        expect(typeof result).toBe('string');
      });

      it("should escape special characters", function () {
        result = treeQuery.toString();
        expect(result).toBe('foo\\.baz.bar.*');
      });
    });

    describe("matches()", function () {
      describe("for matching path", function () {
        it("should return true", function () {
          expect('foo.bar.baz'.toTreeQuery()
          .matches('foo.bar.baz'.toTreePath())).toBeTruthy();
          expect('foo.*.baz'.toTreeQuery()
          .matches('foo.bar.baz'.toTreePath())).toBeTruthy();
          expect('foo.!bar.baz'.toTreeQuery()
          .matches('foo.quux.baz'.toTreePath())).toBeTruthy();
          expect('foo.**.baz'.toTreeQuery()
          .matches('foo.bar.baz'.toTreePath())).toBeTruthy();
          expect('foo.**.baz'.toTreeQuery()
          .matches('foo.baz'.toTreePath())).toBeTruthy();
          expect('foo.**.baz'.toTreeQuery()
          .matches('foo.bar.quux.baz'.toTreePath())).toBeTruthy();
          expect('foo.bar.**'.toTreeQuery()
          .matches('foo.bar.quux.baz'.toTreePath())).toBeTruthy();
          expect('**!foo.baz'.toTreeQuery()
          .matches('bar.quux.baz'.toTreePath())).toBeTruthy();
        });
      });

      describe("for non-matching path", function () {
        it("should return false", function () {
          expect('foo.bar.baz'.toTreeQuery()
          .matches('foo.bar.baz.quux'.toTreePath())).toBeFalsy();
          expect('foo.bar.baz.quux'.toTreeQuery()
          .matches('foo.bar.baz'.toTreePath())).toBeFalsy();
          expect('foo.bar.baz'.toTreeQuery()
          .matches('foo.bar.quux'.toTreePath())).toBeFalsy();
          expect('foo.*.baz'.toTreeQuery()
          .matches('foo.bar.quux'.toTreePath())).toBeFalsy();
          expect('foo.!bar.baz'.toTreeQuery()
          .matches('foo.bar.baz'.toTreePath())).toBeFalsy();
          expect('foo.**.baz'.toTreeQuery()
          .matches('foo.bar.quux'.toTreePath())).toBeFalsy();
          expect('**!foo.baz'.toTreeQuery()
          .matches('bar.foo.baz'.toTreePath())).toBeFalsy();
        });
      });
    });
  });
});

describe("String", function () {
  describe("toTreeQuery()", function () {
    var treeQuery;

    it("should create a TreeQuery instance", function () {
      treeQuery = 'foo.*.bar:!baz'.toTreeQuery();
      expect($data.TreeQuery.mixedBy(treeQuery)).toBeTruthy();
    });

    it("should set components property", function () {
      treeQuery = 'foo.*.bar:!baz'.toTreeQuery();
      expect(treeQuery.components).toEqual([
        'foo'.toTreeQueryComponent(),
        '*'.toTreeQueryComponent(),
        'bar:!baz'.toTreeQueryComponent()
      ]);
    });
  });
});

describe("Array", function () {
  describe("toTreeQuery()", function () {
    var components,
        query;

    beforeEach(function () {
      components = ['!foo', '*:baz'];
    });

    it("should create a TreeQuery instance", function () {
      query = components.toTreeQuery();
      expect($data.TreeQuery.mixedBy(query)).toBeTruthy();
    });

    it("should set components property", function () {
      query = components.toTreeQuery();
      expect(query.components).toEqual([
        '!foo'.toTreeQueryComponent(),
        '*:baz'.toTreeQueryComponent()
      ]);
    });
  });
});
