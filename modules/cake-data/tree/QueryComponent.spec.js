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
      describe("from string", function () {
        it("should set isSkipper property", function () {
          expect(QueryComponent.create({componentString: '**'}).isSkipper)
          .toBeTruthy();
          expect(QueryComponent.create({componentString: '**!foo'}).isSkipper)
          .toBeTruthy();
          expect(QueryComponent.create({componentString: '\\*\\*'}).isSkipper)
          .toBeFalsy();
        });

        it("should set isKeyExcluded property", function () {
          expect(QueryComponent.create({componentString: 'foo'}).isKeyExcluded)
          .toBeFalsy();
          expect(QueryComponent.create({componentString: '!foo'}).isKeyExcluded)
          .toBeTruthy();
          expect(QueryComponent.create({componentString: '*'}).isKeyExcluded)
          .toBeFalsy();
          expect(QueryComponent.create({componentString: '**'}).isKeyExcluded)
          .toBeFalsy();
        });

        it("should set matchesAnyKey property", function () {
          expect(QueryComponent.create({componentString: '*'}).matchesAnyKey)
          .toBeTruthy();
          expect(QueryComponent.create({componentString: '\\*'}).matchesAnyKey)
          .toBeFalsy();
          expect(QueryComponent.create({componentString: 'foo'}).matchesAnyKey)
          .toBeFalsy();
          expect(QueryComponent.create({componentString: '!foo'}).matchesAnyKey)
          .toBeFalsy();
          expect(QueryComponent.create({componentString: '**'}).matchesAnyKey)
          .toBeTruthy();
          expect(QueryComponent.create({componentString: '\\*\\*'}).matchesAnyKey)
          .toBeFalsy();
        });

        it("should set keyOptions property", function () {
          expect(QueryComponent.create({componentString: 'foo'}).keyOptions)
          .toEqual(['foo']);
          expect(QueryComponent.create({componentString: 'foo,bar'}).keyOptions)
          .toEqual(['foo', 'bar']);
          expect(QueryComponent.create({componentString: 'foo\\,bar'}).keyOptions)
          .toEqual(['foo,bar']);
          expect(QueryComponent.create({componentString: '!foo'}).keyOptions)
          .toEqual(['foo']);
          expect(QueryComponent.create({componentString: ''}).keyOptions)
          .toEqual(['']);
          expect(QueryComponent.create({componentString: '**'}).keyOptions)
          .toBeUndefined();
          expect(QueryComponent.create({componentString: '*'}).keyOptions)
          .toBeUndefined();
        });

        it("should set keyOptionLookup property", function () {
          expect(QueryComponent.create({componentString: 'foo'}).keyOptionLookup)
          .toEqual({foo: 1});
          expect(QueryComponent.create({componentString: 'foo,bar'}).keyOptionLookup)
          .toEqual({
            foo: 1,
            bar: 1
          });
          expect(QueryComponent.create({componentString: '!foo'}).keyOptionLookup)
          .toEqual({
            foo: 1
          });
        });

        it("should set matchesPrimitiveValues property", function () {
          expect(QueryComponent.create({componentString: 'foo'}).matchesPrimitiveValues)
          .toBeFalsy();
          expect(QueryComponent.create({componentString: 'foo:$'}).matchesPrimitiveValues)
          .toBeTruthy();
          expect(QueryComponent.create({componentString: 'foo:\\$'}).matchesPrimitiveValues)
          .toBeFalsy();
          expect(QueryComponent.create({componentString: 'foo:bar'}).matchesPrimitiveValues)
          .toBeFalsy();
        });

        it("should set isValueExcluded property", function () {
          expect(QueryComponent.create({componentString: 'foo'}).isValueExcluded)
          .toBeFalsy();
          expect(QueryComponent.create({componentString: 'foo:*'}).isValueExcluded)
          .toBeFalsy();
          expect(QueryComponent.create({componentString: 'foo:bar'}).isValueExcluded)
          .toBeFalsy();
          expect(QueryComponent.create({componentString: 'foo:!bar'}).isValueExcluded)
          .toBeTruthy();
        });

        it("should set matchesAnyValue property", function () {
          expect(QueryComponent.create({componentString: 'foo'}).matchesAnyValue)
          .toBeTruthy();
          expect(QueryComponent.create({componentString: 'foo:*'}).matchesAnyValue)
          .toBeTruthy();
          expect(QueryComponent.create({componentString: 'foo:\\*'}).matchesAnyValue)
          .toBeFalsy();
          expect(QueryComponent.create({componentString: 'foo:bar'}).matchesAnyValue)
          .toBeFalsy();
          expect(QueryComponent.create({componentString: 'foo:!bar'}).matchesAnyValue)
          .toBeFalsy();
        });

        it("should set valueOptions property", function () {
          expect(QueryComponent.create({componentString: '**'}).valueOptions)
          .toBeUndefined();
          expect(QueryComponent.create({componentString: '**!foo'}).valueOptions)
          .toBeUndefined();
          expect(QueryComponent.create({componentString: '*'}).valueOptions)
          .toBeUndefined();
          expect(QueryComponent.create({componentString: '*:foo'}).valueOptions)
          .toEqual(['foo']);
          expect(QueryComponent.create({componentString: '*:foo\\,bar'}).valueOptions)
          .toEqual(['foo,bar']);
          expect(QueryComponent.create({componentString: '!quux:foo,bar'}).valueOptions)
          .toEqual(['foo', 'bar']);
          expect(QueryComponent.create({componentString: '*:!foo,bar'}).valueOptions)
          .toEqual(['foo', 'bar']);
          expect(QueryComponent.create({componentString: '*:'}).valueOptions)
          .toEqual(['']);
          expect(QueryComponent.create({componentString: '*:!'}).valueOptions)
          .toEqual(['']);
          expect(QueryComponent.create({componentString: '*:*'}).valueOptions)
          .toBeUndefined();
          expect(QueryComponent.create({componentString: '*:$'}).valueOptions)
          .toBeUndefined();
        });
      });

      describe("from properties", function () {
        it("should set keyOptionLookup property", function () {
          expect(QueryComponent.create().keyOptionLookup).toBeUndefined();
          expect(QueryComponent.create({
            keyOptions: ['foo', 'bar']
          }).keyOptionLookup).toEqual({
            foo: 1,
            bar: 1
          });
        });

        it("should set matchesAnyKey property", function () {
          expect(QueryComponent.create().matchesAnyKey).toBeTruthy();
          expect(QueryComponent.create({
            keyOptions: ['foo', 'bar']
          }).matchesAnyKey).toBeFalsy();
          expect(QueryComponent.create({
            keyOptions: ['foo', 'bar'],
            matchesAnyKey: true
          }).matchesAnyKey).toBeFalsy();
          expect(QueryComponent.create({
            matchesAnyKey: true
          }).matchesAnyKey).toBeTruthy();
        });

        it("should set matchesAnyValue property", function () {
          expect(QueryComponent.create().matchesAnyValue).toBeTruthy();
          expect(QueryComponent.create({
            valueOptions: ['foo', 'bar']
          }).matchesAnyValue).toBeFalsy();
          expect(QueryComponent.create({
            valueOptions: ['foo', 'bar'],
            matchesAnyValue: true
          }).matchesAnyValue).toBeFalsy();
          expect(QueryComponent.create({
            matchesAnyValue: true
          }).matchesAnyValue).toBeTruthy();
        });

        it("should set matchesPrimitiveValues property", function () {
          expect(QueryComponent.create().matchesPrimitiveValues).toBeFalsy();
          expect(QueryComponent.create({
            valueOptions: ['foo', 'bar']
          }).matchesPrimitiveValues).toBeFalsy();
          expect(QueryComponent.create({
            valueOptions: ['foo', 'bar'],
            matchesPrimitiveValues: true
          }).matchesPrimitiveValues).toBeFalsy();
          expect(QueryComponent.create({
            matchesPrimitiveValues: true
          }).matchesPrimitiveValues).toBeTruthy();
        });
      });
    });

    describe("clone()", function () {
      beforeEach(function () {
        queryComponent = QueryComponent.create({
          keyOptions: ['foo', 'bar'],
          isKeyExcluded: true,
          valueOptions: ['baz'],
          isValueExcluded: true
        });
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
          expect(QueryComponent.create({componentString: '**:foo'}) + '')
          .toBe('**');
        });

        describe("and key is excluded", function () {
          it("should include excluded key options", function () {
            expect(QueryComponent.create({componentString: '**!foo'}) + '')
            .toBe('**!foo');
          });
        });
      });

      describe("when isKeyExcluded is true", function () {
        it("should exclude keys", function () {
          expect(QueryComponent.create({componentString: '!foo'}) + '')
          .toBe('!foo');
          expect(QueryComponent.create({componentString: '!foo:baz'}) + '')
          .toBe('!foo:baz');
        });
      });

      describe("when matchesAnyKey is true", function () {
        it("should output key wildcard", function () {
          expect(QueryComponent.create({componentString: '*'}) + '')
          .toBe('*');
          expect(QueryComponent.create({componentString: '*:foo'}) + '')
          .toBe('*:foo');
        });
      });

      describe("when keyOptions are specified", function () {
        it("should include key options", function () {
          expect(QueryComponent.create({componentString: 'foo,bar:baz'}) + '')
          .toBe('foo,bar:baz');
        });
      });

      describe("when matchesPrimitiveValues is true", function () {
        it("should output primitive value marker", function () {
          expect(QueryComponent.create({componentString: 'foo:$'}) + '')
          .toBe('foo:$');
        });
      });

      describe("when isValueExcluded is true", function () {
        it("should exclude keys", function () {
          expect(QueryComponent.create({componentString: 'foo:!bar'}) + '')
          .toBe('foo:!bar');
        });
      });

      describe("when matchesAnyValue is true", function () {
        it("should output value wildcard", function () {
          expect(QueryComponent.create({componentString: 'foo:*'}) + '')
          .toBe('foo');
          expect(QueryComponent.create({componentString: 'foo'}) + '')
          .toBe('foo');
        });
      });

      describe("when valueOptions are specified", function () {
        it("should include value options", function () {
          expect(QueryComponent.create({componentString: 'foo:bar,baz'}) + '')
          .toBe('foo:bar,baz');
        });
      });
    });

    describe("matches()", function () {
      describe("for matching key and value", function () {
        it("should return true", function () {
          // skipper
          expect(QueryComponent.create({componentString: '**'})
          .matches('foo')).toBeTruthy();
          expect(QueryComponent.create({componentString: '**!bar'})
          .matches('foo')).toBeTruthy();

          // key wildcard
          expect(QueryComponent.create({componentString: '*'}).matches('foo'))
          .toBeTruthy();

          // key options
          expect(QueryComponent.create({componentString: 'foo,bar'})
          .matches('foo')).toBeTruthy();
          expect(QueryComponent.create({componentString: 'foo,bar'})
          .matches('bar')).toBeTruthy();

          // excluded key options
          expect(QueryComponent.create({componentString: '!foo,bar'})
          .matches('baz')).toBeTruthy();

          // value wildcard
          expect(QueryComponent.create({componentString: 'foo:*'})
          .matches('foo', 'bar')).toBeTruthy();

          // value options
          expect(QueryComponent.create({componentString: 'foo:bar,baz'})
          .matches('foo', 'bar')).toBeTruthy();
          expect(QueryComponent.create({componentString: 'foo:bar,baz'})
          .matches('foo', 'baz')).toBeTruthy();

          // excluded value options
          expect(QueryComponent.create({componentString: 'foo:!bar,baz'})
          .matches('foo', 'foo')).toBeTruthy();

          // primitive value
          expect(QueryComponent.create({componentString: 'foo:$'})
          .matches('foo', 'foo')).toBeTruthy();
          expect(QueryComponent.create({componentString: 'foo:$'})
          .matches('foo', 1)).toBeTruthy();
          expect(QueryComponent.create({componentString: 'foo:$'})
          .matches('foo', true)).toBeTruthy();
          expect(QueryComponent.create({componentString: 'foo:$'})
          .matches('foo', null)).toBeTruthy();
        });
      });

      describe("for non-matching key or value", function () {
        it("should return false", function () {
          // skipper
          expect(QueryComponent.create({componentString: '**!foo'})
          .matches('foo')).toBeFalsy();

          // key options
          expect(QueryComponent.create({componentString: 'foo,bar'})
          .matches('baz')).toBeFalsy();

          // excluded key options
          expect(QueryComponent.create({componentString: '!foo,bar'})
          .matches('foo')).toBeFalsy();
          expect(QueryComponent.create({componentString: '!foo,bar'})
          .matches('bar')).toBeFalsy();

          // value options
          expect(QueryComponent.create({componentString: 'foo:bar,baz'})
          .matches('foo', 'foo'))
          .toBeFalsy();

          // excluded value options
          expect(QueryComponent.create({componentString: 'foo:!bar,baz'})
          .matches('foo', 'bar')).toBeFalsy();
          expect(QueryComponent.create({componentString: 'foo:!bar,baz'})
          .matches('foo', 'baz')).toBeFalsy();

          // primitive value
          expect(QueryComponent.create({componentString: 'foo:$'})
          .matches('foo', {})).toBeFalsy();
          expect(QueryComponent.create({componentString: 'foo:$'})
          .matches('foo', [])).toBeFalsy();
        });
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
      queryComponent = $data.QueryComponent.create({componentString: string});
      spyOn($data.QueryComponent, 'create').and
      .returnValue(queryComponent);
      result = string.toQueryComponent();
    });

    it("should create a QueryComponent instance", function () {
      expect($data.QueryComponent.create).toHaveBeenCalledWith({
        componentString: string
      });
    });

    it("should return created instance", function () {
      expect(result).toBe(queryComponent);
    });
  });
});
