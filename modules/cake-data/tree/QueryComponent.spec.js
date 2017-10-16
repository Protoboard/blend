"use strict";

var $data = window['cake-data'];

describe("$data", function () {
  describe("QueryComponent", function () {
    var QueryComponent,
        queryComponent,
        result;

    beforeAll(function () {
      QueryComponent = $oop.getClass('test.$data.QueryComponent.QueryComponent')
      .mix($data.QueryComponent);
    });

    describe("fromString()", function () {
      var queryComponent,
          componentString;

      beforeEach(function () {
        queryComponent = {};
        componentString = 'foo';
        spyOn(QueryComponent, 'create').and.returnValue(queryComponent);
        result = QueryComponent.fromString(componentString);
      });

      it("should pass string to create()", function () {
        expect(QueryComponent.create)
        .toHaveBeenCalledWith({componentString: componentString});
      });

      it("should return created instance", function () {
        expect(result).toBe(queryComponent);
      });
    });

    describe("fromKeyOptions()", function () {
      var queryComponent,
          keyOptions;

      beforeEach(function () {
        queryComponent = {};
        keyOptions = ['foo', 'bar', 'baz'];
        spyOn(QueryComponent, 'create').and.returnValue(queryComponent);
        result = QueryComponent.fromKeyOptions(keyOptions);
      });

      it("should pass string to create()", function () {
        expect(QueryComponent.create)
        .toHaveBeenCalledWith({keyOptions: keyOptions});
      });

      it("should return created instance", function () {
        expect(result).toBe(queryComponent);
      });
    });

    describe("create()", function () {
      describe("from string", function () {
        it("should set isSkipper property", function () {
          expect(QueryComponent.fromString('**').isSkipper).toBeTruthy();
          expect(QueryComponent.fromString('**!foo').isSkipper).toBeTruthy();
          expect(QueryComponent.fromString('\\*\\*').isSkipper).toBeFalsy();
        });

        it("should set isKeyExcluded property", function () {
          expect(QueryComponent.fromString('foo').isKeyExcluded).toBeFalsy();
          expect(QueryComponent.fromString('!foo').isKeyExcluded).toBeTruthy();
          expect(QueryComponent.fromString('*').isKeyExcluded).toBeFalsy();
          expect(QueryComponent.fromString('**').isKeyExcluded).toBeFalsy();
        });

        it("should set matchesAnyKey property", function () {
          expect(QueryComponent.fromString('*').matchesAnyKey).toBeTruthy();
          expect(QueryComponent.fromString('\\*').matchesAnyKey).toBeFalsy();
          expect(QueryComponent.fromString('foo').matchesAnyKey).toBeFalsy();
          expect(QueryComponent.fromString('!foo').matchesAnyKey).toBeFalsy();
          expect(QueryComponent.fromString('**').matchesAnyKey).toBeTruthy();
          expect(QueryComponent.fromString('\\*\\*').matchesAnyKey).toBeFalsy();
        });

        it("should set keyOptions property", function () {
          expect(QueryComponent.fromString('foo').keyOptions).toEqual(['foo']);
          expect(QueryComponent.fromString('foo,bar').keyOptions)
          .toEqual(['foo', 'bar']);
          expect(QueryComponent.fromString('foo\\,bar').keyOptions)
          .toEqual(['foo,bar']);
          expect(QueryComponent.fromString('!foo').keyOptions).toEqual(['foo']);
          expect(QueryComponent.fromString('').keyOptions).toEqual(['']);
          expect(QueryComponent.fromString('**').keyOptions).toBeUndefined();
          expect(QueryComponent.fromString('*').keyOptions).toBeUndefined();
        });

        it("should set keyOptionLookup property", function () {
          expect(QueryComponent.fromString('foo').keyOptionLookup)
          .toEqual({foo: 1});
          expect(QueryComponent.fromString('foo,bar').keyOptionLookup).toEqual({
            foo: 1,
            bar: 1
          });
          expect(QueryComponent.fromString('!foo').keyOptionLookup).toEqual({
            foo: 1
          });
        });

        it("should set matchesPrimitiveValues property", function () {
          expect(QueryComponent.fromString('foo').matchesPrimitiveValues)
          .toBeFalsy();
          expect(QueryComponent.fromString('foo:$').matchesPrimitiveValues)
          .toBeTruthy();
          expect(QueryComponent.fromString('foo:\\$').matchesPrimitiveValues)
          .toBeFalsy();
          expect(QueryComponent.fromString('foo:bar').matchesPrimitiveValues)
          .toBeFalsy();
        });

        it("should set isValueExcluded property", function () {
          expect(QueryComponent.fromString('foo').isValueExcluded).toBeFalsy();
          expect(QueryComponent.fromString('foo:*').isValueExcluded)
          .toBeFalsy();
          expect(QueryComponent.fromString('foo:bar').isValueExcluded)
          .toBeFalsy();
          expect(QueryComponent.fromString('foo:!bar').isValueExcluded)
          .toBeTruthy();
        });

        it("should set matchesAnyValue property", function () {
          expect(QueryComponent.fromString('foo').matchesAnyValue).toBeTruthy();
          expect(QueryComponent.fromString('foo:*').matchesAnyValue)
          .toBeTruthy();
          expect(QueryComponent.fromString('foo:\\*').matchesAnyValue)
          .toBeFalsy();
          expect(QueryComponent.fromString('foo:bar').matchesAnyValue)
          .toBeFalsy();
          expect(QueryComponent.fromString('foo:!bar').matchesAnyValue)
          .toBeFalsy();
        });

        it("should set valueOptions property", function () {
          expect(QueryComponent.fromString('**').valueOptions).toBeUndefined();
          expect(QueryComponent.fromString('**!foo').valueOptions)
          .toBeUndefined();
          expect(QueryComponent.fromString('*').valueOptions).toBeUndefined();
          expect(QueryComponent.fromString('*:foo').valueOptions)
          .toEqual(['foo']);
          expect(QueryComponent.fromString('*:foo\\,bar').valueOptions)
          .toEqual(['foo,bar']);
          expect(QueryComponent.fromString('!quux:foo,bar').valueOptions)
          .toEqual(['foo', 'bar']);
          expect(QueryComponent.fromString('*:!foo,bar').valueOptions)
          .toEqual(['foo', 'bar']);
          expect(QueryComponent.fromString('*:').valueOptions).toEqual(['']);
          expect(QueryComponent.fromString('*:!').valueOptions).toEqual(['']);
          expect(QueryComponent.fromString('*:*').valueOptions).toBeUndefined();
          expect(QueryComponent.fromString('*:$').valueOptions).toBeUndefined();
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
          expect(QueryComponent.fromString('**:foo') + '').toBe('**');
        });

        describe("and key is excluded", function () {
          it("should include excluded key options", function () {
            expect(QueryComponent.fromString('**!foo') + '').toBe('**!foo');
          });
        });
      });

      describe("when isKeyExcluded is true", function () {
        it("should exclude keys", function () {
          expect(QueryComponent.fromString('!foo') + '').toBe('!foo');
          expect(QueryComponent.fromString('!foo:baz') + '').toBe('!foo:baz');
        });
      });

      describe("when matchesAnyKey is true", function () {
        it("should output key wildcard", function () {
          expect(QueryComponent.fromString('*') + '').toBe('*');
          expect(QueryComponent.fromString('*:foo') + '').toBe('*:foo');
        });
      });

      describe("when keyOptions are specified", function () {
        it("should include key options", function () {
          expect(QueryComponent.fromString('foo,bar:baz') + '')
          .toBe('foo,bar:baz');
        });
      });

      describe("when matchesPrimitiveValues is true", function () {
        it("should output primitive value marker", function () {
          expect(QueryComponent.fromString('foo:$') + '').toBe('foo:$');
        });
      });

      describe("when isValueExcluded is true", function () {
        it("should exclude keys", function () {
          expect(QueryComponent.fromString('foo:!bar') + '').toBe('foo:!bar');
        });
      });

      describe("when matchesAnyValue is true", function () {
        it("should output value wildcard", function () {
          expect(QueryComponent.fromString('foo:*') + '').toBe('foo');
          expect(QueryComponent.fromString('foo') + '').toBe('foo');
        });
      });

      describe("when valueOptions are specified", function () {
        it("should include value options", function () {
          expect(QueryComponent.fromString('foo:bar,baz') + '')
          .toBe('foo:bar,baz');
        });
      });
    });

    describe("matches()", function () {
      describe("for matching key and value", function () {
        it("should return true", function () {
          // skipper
          expect(QueryComponent.fromString('**').matches('foo')).toBeTruthy();
          expect(QueryComponent.fromString('**!bar').matches('foo'))
          .toBeTruthy();

          // key wildcard
          expect(QueryComponent.fromString('*').matches('foo')).toBeTruthy();

          // key options
          expect(QueryComponent.fromString('foo,bar').matches('foo'))
          .toBeTruthy();
          expect(QueryComponent.fromString('foo,bar').matches('bar'))
          .toBeTruthy();

          // excluded key options
          expect(QueryComponent.fromString('!foo,bar').matches('baz'))
          .toBeTruthy();

          // value wildcard
          expect(QueryComponent.fromString('foo:*').matches('foo', 'bar'))
          .toBeTruthy();

          // value options
          expect(QueryComponent.fromString('foo:bar,baz').matches('foo', 'bar'))
          .toBeTruthy();
          expect(QueryComponent.fromString('foo:bar,baz').matches('foo', 'baz'))
          .toBeTruthy();

          // excluded value options
          expect(QueryComponent.fromString('foo:!bar,baz')
          .matches('foo', 'foo')).toBeTruthy();

          // primitive value
          expect(QueryComponent.fromString('foo:$').matches('foo', 'foo'))
          .toBeTruthy();
          expect(QueryComponent.fromString('foo:$').matches('foo', 1))
          .toBeTruthy();
          expect(QueryComponent.fromString('foo:$').matches('foo', true))
          .toBeTruthy();
          expect(QueryComponent.fromString('foo:$').matches('foo', null))
          .toBeTruthy();
        });
      });

      describe("for non-matching key or value", function () {
        it("should return false", function () {
          // skipper
          expect(QueryComponent.fromString('**!foo').matches('foo'))
          .toBeFalsy();

          // key options
          expect(QueryComponent.fromString('foo,bar').matches('baz'))
          .toBeFalsy();

          // excluded key options
          expect(QueryComponent.fromString('!foo,bar').matches('foo'))
          .toBeFalsy();
          expect(QueryComponent.fromString('!foo,bar').matches('bar'))
          .toBeFalsy();

          // value options
          expect(QueryComponent.fromString('foo:bar,baz')
          .matches('foo', 'foo'))
          .toBeFalsy();

          // excluded value options
          expect(QueryComponent.fromString('foo:!bar,baz')
          .matches('foo', 'bar')).toBeFalsy();
          expect(QueryComponent.fromString('foo:!bar,baz')
          .matches('foo', 'baz')).toBeFalsy();

          // primitive value
          expect(QueryComponent.fromString('foo:$').matches('foo', {}))
          .toBeFalsy();
          expect(QueryComponent.fromString('foo:$').matches('foo', []))
          .toBeFalsy();
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
      queryComponent = $data.QueryComponent.fromString(string);
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
