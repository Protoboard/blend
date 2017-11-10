"use strict";

var $data = window['blend-data'];

describe("$data", function () {
  describe("Query", function () {
    var Query,
        query,
        result;

    beforeAll(function () {
      Query = $oop.getClass('test.$data.Query.Query')
      .blend($data.Query);
    });

    beforeEach(function () {
      query = Query.create({
        components: [
          'foo',
          'bar',
          $data.QueryComponent.fromString('*')
        ]
      });
    });

    describe("create()", function () {
      it("should initialize components property", function () {
        expect(query.components).toEqual([
          $data.QueryComponent.fromString('foo'),
          $data.QueryComponent.fromString('bar'),
          $data.QueryComponent.fromString('*')
        ]);
      });
    });

    describe("fromComponents()", function () {
      var query,
          components;

      beforeEach(function () {
        query = {};
        components = ['foo', 'bar', 'baz'];
        spyOn(Query, 'create').and.returnValue(query);
        result = Query.fromComponents(components);
      });

      it("should pass components to create()", function () {
        expect(Query.create).toHaveBeenCalledWith({components: components});
      });

      it("should return created instance", function () {
        expect(result).toBe(query);
      });
    });

    describe("fromString()", function () {
      var query;

      beforeEach(function () {
        query = {};
        spyOn(Query, 'create').and.returnValue(query);
        result = Query.fromString('foo.*.bar:!baz');
      });

      it("should create a Query instance", function () {
        expect(Query.create).toHaveBeenCalledWith({
          components: ['foo', '*', 'bar:!baz']
        });
      });

      it("should return created instance", function () {
        expect(result).toBe(query);
      });
    });

    describe("clone()", function () {
      beforeEach(function () {
        result = query.clone();
      });

      it("should initialize properties", function () {
        expect(result.components).not.toBe(query.components);
        expect(result.components).toEqual(query.components);
      });
    });

    describe("toString()", function () {
      beforeEach(function () {
        query = Query.create({components: ['foo.baz', 'bar', '*']});
        result = query.toString();
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
          expect('foo.bar.baz'.toQuery()
          .matches('foo.bar.baz'.toTreePath())).toBeTruthy();
          expect('foo.*.baz'.toQuery()
          .matches('foo.bar.baz'.toTreePath())).toBeTruthy();
          expect('foo.!bar.baz'.toQuery()
          .matches('foo.quux.baz'.toTreePath())).toBeTruthy();
          expect('foo.**.baz'.toQuery()
          .matches('foo.bar.baz'.toTreePath())).toBeTruthy();
          expect('foo.**.baz'.toQuery()
          .matches('foo.baz'.toTreePath())).toBeTruthy();
          expect('foo.**.baz'.toQuery()
          .matches('foo.bar.quux.baz'.toTreePath())).toBeTruthy();
          expect('foo.bar.**'.toQuery()
          .matches('foo.bar.quux.baz'.toTreePath())).toBeTruthy();
          expect('**!foo.baz'.toQuery()
          .matches('bar.quux.baz'.toTreePath())).toBeTruthy();
        });
      });

      describe("for non-matching path", function () {
        it("should return false", function () {
          expect('foo.bar.baz'.toQuery()
          .matches('foo.bar.baz.quux'.toTreePath())).toBeFalsy();
          expect('foo.bar.baz.quux'.toQuery()
          .matches('foo.bar.baz'.toTreePath())).toBeFalsy();
          expect('foo.bar.baz'.toQuery()
          .matches('foo.bar.quux'.toTreePath())).toBeFalsy();
          expect('foo.*.baz'.toQuery()
          .matches('foo.bar.quux'.toTreePath())).toBeFalsy();
          expect('foo.!bar.baz'.toQuery()
          .matches('foo.bar.baz'.toTreePath())).toBeFalsy();
          expect('foo.**.baz'.toQuery()
          .matches('foo.bar.quux'.toTreePath())).toBeFalsy();
          expect('**!foo.baz'.toQuery()
          .matches('bar.foo.baz'.toTreePath())).toBeFalsy();
        });
      });
    });
  });
});

describe("String", function () {
  var result;

  describe("toQuery()", function () {
    var query;

    beforeEach(function () {
      query = $data.Query.create({components: []});
      spyOn($data.Query, 'create').and.returnValue(query);
      result = 'foo.*.bar:!baz'.toQuery();
    });

    it("should create a Query instance", function () {
      expect($data.Query.create.calls.allArgs()).toEqual([
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

  describe("toQuery()", function () {
    var components,
        query;

    beforeEach(function () {
      components = ['!foo', '*:baz'];
      query = $data.Query.create({components: components});
      spyOn($data.Query, 'create').and
      .returnValue(query);
      result = components.toQuery();
    });

    it("should create a Query instance", function () {
      expect($data.Query.create).toHaveBeenCalledWith({components: components});
    });

    it("should return created instance", function () {
      expect(result).toBe(query);
    });
  });
});
