"use strict";

var $data = window['cake-data'];

describe("$assert", function () {
  var query;

  beforeEach(function () {
    query = $data.Query.create(['foo', 'bar']);
    spyOn($assert, 'assert').and.callThrough();
  });

  describe("isQuery()", function () {
    it("should pass message to assert", function () {
      $assert.isQuery(query, "bar");
      expect($assert.assert).toHaveBeenCalledWith(true, "bar");
    });

    describe("when passing non-query", function () {
      it("should throw", function () {
        expect(function () {
          $assert.isQuery({});
        }).toThrow();
      });
    });
  });

  describe("isQueryOptional()", function () {
    it("should pass message to assert", function () {
      $assert.isQueryOptional(query, "bar");
      expect($assert.assert).toHaveBeenCalledWith(true, "bar");
    });

    describe("when passing non-qpuery", function () {
      it("should throw", function () {
        expect(function () {
          $assert.isQueryOptional({});
        }).toThrow();
      });
    });
  });
});

describe("$data", function () {
  describe("Query", function () {
    var Query,
        query,
        result;

    beforeEach(function () {
      Query = $oop.getClass('test.$data.Query.Query')
      .mix($data.Query);
      query = Query.create([
        'foo',
        'bar',
        $data.QueryComponent.create('*')
      ]);
    });

    describe("create()", function () {
      it("should initialize components property", function () {
        expect(query.components).toEqual([
          $data.QueryComponent.create('foo'),
          $data.QueryComponent.create('bar'),
          $data.QueryComponent.create('*')
        ]);
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
        query = Query.create(['foo.baz', 'bar', '*']);
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
          .matches('foo.bar.baz'.toPath())).toBeTruthy();
          expect('foo.*.baz'.toQuery()
          .matches('foo.bar.baz'.toPath())).toBeTruthy();
          expect('foo.!bar.baz'.toQuery()
          .matches('foo.quux.baz'.toPath())).toBeTruthy();
          expect('foo.**.baz'.toQuery()
          .matches('foo.bar.baz'.toPath())).toBeTruthy();
          expect('foo.**.baz'.toQuery()
          .matches('foo.baz'.toPath())).toBeTruthy();
          expect('foo.**.baz'.toQuery()
          .matches('foo.bar.quux.baz'.toPath())).toBeTruthy();
          expect('foo.bar.**'.toQuery()
          .matches('foo.bar.quux.baz'.toPath())).toBeTruthy();
          expect('**!foo.baz'.toQuery()
          .matches('bar.quux.baz'.toPath())).toBeTruthy();
        });
      });

      describe("for non-matching path", function () {
        it("should return false", function () {
          expect('foo.bar.baz'.toQuery()
          .matches('foo.bar.baz.quux'.toPath())).toBeFalsy();
          expect('foo.bar.baz.quux'.toQuery()
          .matches('foo.bar.baz'.toPath())).toBeFalsy();
          expect('foo.bar.baz'.toQuery()
          .matches('foo.bar.quux'.toPath())).toBeFalsy();
          expect('foo.*.baz'.toQuery()
          .matches('foo.bar.quux'.toPath())).toBeFalsy();
          expect('foo.!bar.baz'.toQuery()
          .matches('foo.bar.baz'.toPath())).toBeFalsy();
          expect('foo.**.baz'.toQuery()
          .matches('foo.bar.quux'.toPath())).toBeFalsy();
          expect('**!foo.baz'.toQuery()
          .matches('bar.foo.baz'.toPath())).toBeFalsy();
        });
      });
    });

    describe("fromString()", function () {
      var query;

      beforeEach(function () {
        query = $data.Query.create([]);
        spyOn($data.Query, 'create').and.returnValue(query);
        result = $data.Query.fromString('foo.*.bar:!baz');
      });

      it("should create a Query instance", function () {
        expect($data.Query.create.calls.allArgs()).toEqual([
          [['foo', '*', 'bar:!baz']]
        ]);
      });

      it("should return created instance", function () {
        expect(result).toBe(query);
      });
    });
  });
});

describe("String", function () {
  var result;

  describe("toQuery()", function () {
    var query;

    beforeEach(function () {
      query = $data.Query.create([]);
      spyOn($data.Query, 'create').and.returnValue(query);
      result = 'foo.*.bar:!baz'.toQuery();
    });

    it("should create a Query instance", function () {
      expect($data.Query.create.calls.allArgs()).toEqual([
        [['foo', '*', 'bar:!baz']]
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
      query = $data.Query.create(components);
      spyOn($data.Query, 'create').and
      .returnValue(query);
      result = components.toQuery();
    });

    it("should create a Query instance", function () {
      expect($data.Query.create).toHaveBeenCalledWith(components);
    });

    it("should return created instance", function () {
      expect(result).toBe(query);
    });
  });
});
