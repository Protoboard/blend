"use strict";

var $data = window['blend-data'];

describe("$data", function () {
  describe("TreeQuery", function () {
    var TreeQuery,
        treeQuery,
        result;

    beforeAll(function () {
      TreeQuery = $oop.getClass('test.$data.TreeQuery.TreeQuery')
      .blend($data.TreeQuery);
    });

    beforeEach(function () {
      treeQuery = TreeQuery.create({
        components: [
          'foo',
          'bar',
          $data.TreeQueryComponent.fromString('*')
        ]
      });
    });

    describe("create()", function () {
      it("should initialize components property", function () {
        expect(treeQuery.components).toEqual([
          $data.TreeQueryComponent.fromString('foo'),
          $data.TreeQueryComponent.fromString('bar'),
          $data.TreeQueryComponent.fromString('*')
        ]);
      });
    });

    describe("fromComponents()", function () {
      var query,
          components;

      beforeEach(function () {
        query = {};
        components = ['foo', 'bar', 'baz'];
        spyOn(TreeQuery, 'create').and.returnValue(query);
        result = TreeQuery.fromComponents(components);
      });

      it("should pass components to create()", function () {
        expect(TreeQuery.create).toHaveBeenCalledWith({components: components});
      });

      it("should return created instance", function () {
        expect(result).toBe(query);
      });
    });

    describe("fromString()", function () {
      var query;

      beforeEach(function () {
        query = {};
        spyOn(TreeQuery, 'create').and.returnValue(query);
        result = TreeQuery.fromString('foo.*.bar:!baz');
      });

      it("should create a TreeQuery instance", function () {
        expect(TreeQuery.create).toHaveBeenCalledWith({
          components: ['foo', '*', 'bar:!baz']
        });
      });

      it("should return created instance", function () {
        expect(result).toBe(query);
      });
    });

    describe("clone()", function () {
      beforeEach(function () {
        result = treeQuery.clone();
      });

      it("should initialize properties", function () {
        expect(result.components).not.toBe(treeQuery.components);
        expect(result.components).toEqual(treeQuery.components);
      });
    });

    describe("toString()", function () {
      beforeEach(function () {
        treeQuery = TreeQuery.create({components: ['foo.baz', 'bar', '*']});
        result = treeQuery.toString();
      });

      it("should return string", function () {
        expect(typeof result).toBe('string');
      });

      it("should escape special characters", function () {
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
  var result;

  describe("toTreeQuery()", function () {
    var query;

    beforeEach(function () {
      query = $data.TreeQuery.create({components: []});
      spyOn($data.TreeQuery, 'create').and.returnValue(query);
      result = 'foo.*.bar:!baz'.toTreeQuery();
    });

    it("should create a TreeQuery instance", function () {
      expect($data.TreeQuery.create.calls.allArgs()).toEqual([
        [{components: ['foo', '*', 'bar:!baz']}]
      ]);
    });

    it("should return created instance", function () {
      expect(result).toBe(query);
    });
  });
});

describe("Array", function () {
  var result;

  describe("toTreeQuery()", function () {
    var components,
        query;

    beforeEach(function () {
      components = ['!foo', '*:baz'];
      query = $data.TreeQuery.create({components: components});
      spyOn($data.TreeQuery, 'create').and
      .returnValue(query);
      result = components.toTreeQuery();
    });

    it("should create a TreeQuery instance", function () {
      expect($data.TreeQuery.create)
      .toHaveBeenCalledWith({components: components});
    });

    it("should return created instance", function () {
      expect(result).toBe(query);
    });
  });
});
