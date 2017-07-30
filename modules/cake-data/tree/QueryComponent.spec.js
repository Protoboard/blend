"use strict";

var $data = window['cake-data'];

describe("$data", function () {
  describe("QueryComponent", function () {
    var QueryComponent,
        queryComponent,
        result;

    beforeEach(function () {
      QueryComponent = $oop.getClass('test.$data.QueryComponent.QueryComponent')
      .mix($data.QueryComponent);
    });

    describe("create()", function () {
      it("should set isSkipper property", function () {
        expect(QueryComponent.create({queryComponentStr: '**'}).isSkipper)
        .toBeTruthy();
        expect(QueryComponent.create({queryComponentStr: '**!foo'}).isSkipper)
        .toBeTruthy();
        expect(QueryComponent.create({queryComponentStr: '\\*\\*'}).isSkipper)
        .toBeFalsy();
      });

      it("should set isKeyExcluded property", function () {
        expect(QueryComponent.create({queryComponentStr: 'foo'}).isKeyExcluded)
        .toBeFalsy();
        expect(QueryComponent.create({queryComponentStr: '!foo'}).isKeyExcluded)
        .toBeTruthy();
        expect(QueryComponent.create({queryComponentStr: '*'}).isKeyExcluded)
        .toBeFalsy();
        expect(QueryComponent.create({queryComponentStr: '**'}).isKeyExcluded)
        .toBeFalsy();
      });

      it("should set matchesAnyKey property", function () {
        expect(QueryComponent.create({queryComponentStr: '*'}).matchesAnyKey)
        .toBeTruthy();
        expect(QueryComponent.create({queryComponentStr: '\\*'}).matchesAnyKey)
        .toBeFalsy();
        expect(QueryComponent.create({queryComponentStr: 'foo'}).matchesAnyKey)
        .toBeFalsy();
        expect(QueryComponent.create({queryComponentStr: '!foo'}).matchesAnyKey)
        .toBeFalsy();
        expect(QueryComponent.create({queryComponentStr: '**'}).matchesAnyKey)
        .toBeTruthy();
        expect(QueryComponent.create({queryComponentStr: '\\*\\*'}).matchesAnyKey)
        .toBeFalsy();
      });

      it("should set keyOptions property", function () {
        expect(QueryComponent.create({queryComponentStr: 'foo'}).keyOptions)
        .toEqual(['foo']);
        expect(QueryComponent.create({queryComponentStr: 'foo,bar'}).keyOptions)
        .toEqual(['foo', 'bar']);
        expect(QueryComponent.create({queryComponentStr: 'foo\\,bar'}).keyOptions)
        .toEqual(['foo,bar']);
        expect(QueryComponent.create({queryComponentStr: '!foo'}).keyOptions)
        .toEqual(['foo']);
        expect(QueryComponent.create({queryComponentStr: ''}).keyOptions)
        .toEqual(['']);
        expect(QueryComponent.create({queryComponentStr: '**'}).keyOptions)
        .toBeUndefined();
        expect(QueryComponent.create({queryComponentStr: '*'}).keyOptions)
        .toBeUndefined();
      });

      it("should set keyOptionLookup property", function () {
        expect(QueryComponent.create({queryComponentStr: 'foo'}).keyOptionLookup)
        .toEqual({foo: 1});
        expect(QueryComponent.create({queryComponentStr: 'foo,bar'}).keyOptionLookup)
        .toEqual({
          foo: 1,
          bar: 1
        });
        expect(QueryComponent.create({queryComponentStr: '!foo'}).keyOptionLookup)
        .toEqual({
          foo: 1
        });
      });

      it("should set matchesPrimitiveValues property", function () {
        expect(QueryComponent.create({queryComponentStr: 'foo'}).matchesPrimitiveValues)
        .toBeFalsy();
        expect(QueryComponent.create({queryComponentStr: 'foo:$'}).matchesPrimitiveValues)
        .toBeTruthy();
        expect(QueryComponent.create({queryComponentStr: 'foo:\\$'}).matchesPrimitiveValues)
        .toBeFalsy();
        expect(QueryComponent.create({queryComponentStr: 'foo:bar'}).matchesPrimitiveValues)
        .toBeFalsy();
      });

      it("should set isValueExcluded property", function () {
        expect(QueryComponent.create({queryComponentStr: 'foo'}).isValueExcluded)
        .toBeFalsy();
        expect(QueryComponent.create({queryComponentStr: 'foo:*'}).isValueExcluded)
        .toBeFalsy();
        expect(QueryComponent.create({queryComponentStr: 'foo:bar'}).isValueExcluded)
        .toBeFalsy();
        expect(QueryComponent.create({queryComponentStr: 'foo:!bar'}).isValueExcluded)
        .toBeTruthy();
      });

      it("should set matchesAnyValue property", function () {
        expect(QueryComponent.create({queryComponentStr: 'foo'}).matchesAnyValue)
        .toBeTruthy();
        expect(QueryComponent.create({queryComponentStr: 'foo:*'}).matchesAnyValue)
        .toBeTruthy();
        expect(QueryComponent.create({queryComponentStr: 'foo:\\*'}).matchesAnyValue)
        .toBeFalsy();
        expect(QueryComponent.create({queryComponentStr: 'foo:bar'}).matchesAnyValue)
        .toBeFalsy();
        expect(QueryComponent.create({queryComponentStr: 'foo:!bar'}).matchesAnyValue)
        .toBeFalsy();
      });

      it("should set valueOptions property", function () {
        expect(QueryComponent.create({queryComponentStr: '**'}).valueOptions)
        .toBeUndefined();
        expect(QueryComponent.create({queryComponentStr: '**!foo'}).valueOptions)
        .toBeUndefined();
        expect(QueryComponent.create({queryComponentStr: '*'}).valueOptions)
        .toBeUndefined();
        expect(QueryComponent.create({queryComponentStr: '*:foo'}).valueOptions)
        .toEqual(['foo']);
        expect(QueryComponent.create({queryComponentStr: '*:foo\\,bar'}).valueOptions)
        .toEqual(['foo,bar']);
        expect(QueryComponent.create({queryComponentStr: '!quux:foo,bar'}).valueOptions)
        .toEqual(['foo', 'bar']);
        expect(QueryComponent.create({queryComponentStr: '*:!foo,bar'}).valueOptions)
        .toEqual(['foo', 'bar']);
        expect(QueryComponent.create({queryComponentStr: '*:'}).valueOptions)
        .toEqual(['']);
        expect(QueryComponent.create({queryComponentStr: '*:!'}).valueOptions)
        .toEqual(['']);
        expect(QueryComponent.create({queryComponentStr: '*:*'}).valueOptions)
        .toBeUndefined();
        expect(QueryComponent.create({queryComponentStr: '*:$'}).valueOptions)
        .toBeUndefined();
      });
    });

    describe("clone()", function () {
      beforeEach(function () {
        queryComponent = QueryComponent.create()
        .setKeyOptions(['foo', 'bar'])
        .excludeKeyOptions()
        .setValueOptions(['baz'])
        .excludeValueOptions();
        result = queryComponent.clone();
      });

      it("should return QueryComponent instance", function () {
        expect(QueryComponent.mixedBy(result)).toBeTruthy();
      });

      it("should initialize properties", function () {
        expect(result).toEqual(queryComponent);
      });
    });

    describe("toString()", function () {
      describe("when isSkipper is true", function () {
        it("should discard value", function () {
          expect(QueryComponent.create({queryComponentStr: '**:foo'}) + '')
          .toBe('**');
        });

        describe("and key is excluded", function () {
          it("should include excluded key options", function () {
            expect(QueryComponent.create({queryComponentStr: '**!foo'}) + '')
            .toBe('**!foo');
          });
        });
      });

      describe("when isKeyExcluded is true", function () {
        it("should exclude keys", function () {
          expect(QueryComponent.create({queryComponentStr: '!foo'}) + '')
          .toBe('!foo');
          expect(QueryComponent.create({queryComponentStr: '!foo:baz'}) + '')
          .toBe('!foo:baz');
        });
      });

      describe("when matchesAnyKey is true", function () {
        it("should output key wildcard", function () {
          expect(QueryComponent.create({queryComponentStr: '*'}) + '')
          .toBe('*');
          expect(QueryComponent.create({queryComponentStr: '*:foo'}) + '')
          .toBe('*:foo');
        });
      });

      describe("when keyOptions are specified", function () {
        it("should include key options", function () {
          expect(QueryComponent.create({queryComponentStr: 'foo,bar:baz'}) + '')
          .toBe('foo,bar:baz');
        });
      });

      describe("when matchesPrimitiveValues is true", function () {
        it("should output primitive value marker", function () {
          expect(QueryComponent.create({queryComponentStr: 'foo:$'}) + '')
          .toBe('foo:$');
        });
      });

      describe("when isValueExcluded is true", function () {
        it("should exclude keys", function () {
          expect(QueryComponent.create({queryComponentStr: 'foo:!bar'}) + '')
          .toBe('foo:!bar');
        });
      });

      describe("when matchesAnyValue is true", function () {
        it("should output value wildcard", function () {
          expect(QueryComponent.create({queryComponentStr: 'foo:*'}) + '')
          .toBe('foo');
          expect(QueryComponent.create({queryComponentStr: 'foo'}) + '')
          .toBe('foo');
        });
      });

      describe("when valueOptions are specified", function () {
        it("should include value options", function () {
          expect(QueryComponent.create({queryComponentStr: 'foo:bar,baz'}) + '')
          .toBe('foo:bar,baz');
        });
      });
    });

    describe("matches()", function () {
      describe("for matching key and value", function () {
        it("should return true", function () {
          // skipper
          expect(QueryComponent.create({queryComponentStr: '**'})
          .matches('foo')).toBeTruthy();
          expect(QueryComponent.create({queryComponentStr: '**!bar'})
          .matches('foo')).toBeTruthy();

          // key wildcard
          expect(QueryComponent.create({queryComponentStr: '*'}).matches('foo'))
          .toBeTruthy();

          // key options
          expect(QueryComponent.create({queryComponentStr: 'foo,bar'})
          .matches('foo')).toBeTruthy();
          expect(QueryComponent.create({queryComponentStr: 'foo,bar'})
          .matches('bar')).toBeTruthy();

          // excluded key options
          expect(QueryComponent.create({queryComponentStr: '!foo,bar'})
          .matches('baz')).toBeTruthy();

          // value wildcard
          expect(QueryComponent.create({queryComponentStr: 'foo:*'})
          .matches('foo', 'bar'))
          .toBeTruthy();

          // value options
          expect(QueryComponent.create({queryComponentStr: 'foo:bar,baz'})
          .matches('foo', 'bar'))
          .toBeTruthy();
          expect(QueryComponent.create({queryComponentStr: 'foo:bar,baz'})
          .matches('foo', 'baz'))
          .toBeTruthy();

          // excluded value options
          expect(QueryComponent.create({queryComponentStr: 'foo:!bar,baz'})
          .matches('foo', 'foo'))
          .toBeTruthy();

          // primitive value
          expect(QueryComponent.create({queryComponentStr: 'foo:$'})
          .matches('foo', 'foo'))
          .toBeTruthy();
          expect(QueryComponent.create({queryComponentStr: 'foo:$'})
          .matches('foo', 1)).toBeTruthy();
          expect(QueryComponent.create({queryComponentStr: 'foo:$'})
          .matches('foo', true))
          .toBeTruthy();
          expect(QueryComponent.create({queryComponentStr: 'foo:$'})
          .matches('foo', null))
          .toBeTruthy();
        });
      });

      describe("for non-matching key or value", function () {
        it("should return false", function () {
          // skipper
          expect(QueryComponent.create({queryComponentStr: '**!foo'})
          .matches('foo')).toBeFalsy();

          // key options
          expect(QueryComponent.create({queryComponentStr: 'foo,bar'})
          .matches('baz')).toBeFalsy();

          // excluded key options
          expect(QueryComponent.create({queryComponentStr: '!foo,bar'})
          .matches('foo')).toBeFalsy();
          expect(QueryComponent.create({queryComponentStr: '!foo,bar'})
          .matches('bar')).toBeFalsy();

          // value options
          expect(QueryComponent.create({queryComponentStr: 'foo:bar,baz'})
          .matches('foo', 'foo'))
          .toBeFalsy();

          // excluded value options
          expect(QueryComponent.create({queryComponentStr: 'foo:!bar,baz'})
          .matches('foo', 'bar'))
          .toBeFalsy();
          expect(QueryComponent.create({queryComponentStr: 'foo:!bar,baz'})
          .matches('foo', 'baz'))
          .toBeFalsy();

          // primitive value
          expect(QueryComponent.create({queryComponentStr: 'foo:$'})
          .matches('foo', {})).toBeFalsy();
          expect(QueryComponent.create({queryComponentStr: 'foo:$'})
          .matches('foo', [])).toBeFalsy();
        });
      });
    });

    describe("setKeyOptions()", function () {
      var keyOptions;

      beforeEach(function () {
        keyOptions = ['foo', 'foo', 'bar'];
        queryComponent = QueryComponent.create();
        result = queryComponent.setKeyOptions(keyOptions);
      });

      it("should return self", function () {
        expect(result).toBe(queryComponent);
      });

      it("should add to keyOptions", function () {
        expect(queryComponent.keyOptions.sort())
        .toEqual(['foo', 'bar'].sort());
      });

      it("should add to keyOptionLookup", function () {
        expect(queryComponent.keyOptionLookup).toEqual({
          foo: 1,
          bar: 1
        });
      });

      it("should set matchesAnyKey to false", function () {
        expect(queryComponent.matchesAnyKey).toBeFalsy();
      });
    });

    describe("excludeKeyOptions()", function () {
      beforeEach(function () {
        queryComponent = QueryComponent.create({queryComponentStr: 'foo:bar,baz'});
        result = queryComponent.excludeKeyOptions();
      });

      it("should return self", function () {
        expect(result).toBe(queryComponent);
      });

      it("should set isKeyExcluded to true", function () {
        expect(queryComponent.isKeyExcluded).toBeTruthy();
      });
    });

    describe("setValueOptions()", function () {
      var valueOptions;

      beforeEach(function () {
        valueOptions = [1, 2, 3];
        queryComponent = QueryComponent.create({queryComponentStr: 'foo:*'});
        result = queryComponent.setValueOptions(valueOptions);
      });

      it("should return self", function () {
        expect(result).toBe(queryComponent);
      });

      it("should add to valueOptions", function () {
        expect(queryComponent.valueOptions).toBe(valueOptions);
      });

      it("should set matchesAnyValue to false", function () {
        expect(queryComponent.isValueExcluded).toBeFalsy();
      });
    });

    describe("excludeValueOptions()", function () {
      beforeEach(function () {
        queryComponent = QueryComponent.create({queryComponentStr: 'foo:bar,baz'});
        result = queryComponent.excludeValueOptions();
      });

      it("should return self", function () {
        expect(result).toBe(queryComponent);
      });

      it("should set isValueExcluded to true", function () {
        expect(queryComponent.isValueExcluded).toBeTruthy();
      });
    });
  });
});

describe("String", function () {
  var result;

  describe("toQueryComponent()", function () {
    var string,
        queryComponent;

    beforeEach(function () {
      string = 'foo:!bar';
      queryComponent = $data.QueryComponent.create({queryComponentStr: string});
      spyOn($data.QueryComponent, 'create').and
      .returnValue(queryComponent);
      result = string.toQueryComponent();
    });

    it("should create a QueryComponent instance", function () {
      expect($data.QueryComponent.create).toHaveBeenCalledWith({
        queryComponentStr: string
      });
    });

    it("should return created instance", function () {
      expect(result).toBe(queryComponent);
    });
  });
});
