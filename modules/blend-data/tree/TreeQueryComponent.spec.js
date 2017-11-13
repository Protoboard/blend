"use strict";

var $data = window['blend-data'];

describe("$data", function () {
  describe("TreeQueryComponent", function () {
    var TQC,
        tQC,
        result;

    beforeAll(function () {
      TQC = $oop.getClass('test.$data.TreeQueryComponent.TreeQueryComponent')
      .blend($data.TreeQueryComponent);
    });

    describe("fromString()", function () {
      var queryComponent,
          componentString;

      beforeEach(function () {
        queryComponent = {};
        componentString = 'foo';
      });

      it("should return TreeQueryComponent instance", function () {
        tQC = TQC.fromString(componentString);
        expect(TQC.mixedBy(tQC)).toBeTruthy();
      });

      it("should set componentString", function () {
        tQC = TQC.fromString(componentString);
        expect(tQC.componentString).toBe(componentString);
      });

      it("should pass additional properties to create", function () {
        tQC = TQC.fromString(componentString, {bar: 'baz'});
        expect(tQC.bar).toBe('baz');
      });
    });

    describe("fromKeyOptions()", function () {
      var queryComponent,
          keyOptions;

      beforeEach(function () {
        queryComponent = {};
        keyOptions = ['foo', 'bar', 'baz'];
      });

      it("should return TreeQueryComponent instance", function () {
        tQC = TQC.fromKeyOptions(keyOptions);
        expect(TQC.mixedBy(tQC)).toBeTruthy();
      });

      it("should set keyOptions property", function () {
        tQC = TQC.fromKeyOptions(keyOptions);
        expect(tQC.keyOptions).toEqual(keyOptions);
      });

      it("should pass additional properties to create", function () {
        tQC = TQC.fromKeyOptions(keyOptions, {bar: 'baz'});
        expect(tQC.bar).toBe('baz');
      });
    });

    describe("create()", function () {
      describe("from string", function () {
        it("should set isSkipper property", function () {
          expect(TQC.fromString('**').isSkipper).toBeTruthy();
          expect(TQC.fromString('**!foo').isSkipper).toBeTruthy();
          expect(TQC.fromString('\\*\\*').isSkipper).toBeFalsy();
        });

        it("should set isKeyExcluded property", function () {
          expect(TQC.fromString('foo').isKeyExcluded).toBeFalsy();
          expect(TQC.fromString('!foo').isKeyExcluded).toBeTruthy();
          expect(TQC.fromString('*').isKeyExcluded).toBeFalsy();
          expect(TQC.fromString('**').isKeyExcluded).toBeFalsy();
        });

        it("should set matchesAnyKey property", function () {
          expect(TQC.fromString('*').matchesAnyKey).toBeTruthy();
          expect(TQC.fromString('\\*').matchesAnyKey).toBeFalsy();
          expect(TQC.fromString('foo').matchesAnyKey).toBeFalsy();
          expect(TQC.fromString('!foo').matchesAnyKey).toBeFalsy();
          expect(TQC.fromString('**').matchesAnyKey).toBeTruthy();
          expect(TQC.fromString('\\*\\*').matchesAnyKey).toBeFalsy();
        });

        it("should set keyOptions property", function () {
          expect(TQC.fromString('foo').keyOptions).toEqual(['foo']);
          expect(TQC.fromString('foo,bar').keyOptions).toEqual(['foo', 'bar']);
          expect(TQC.fromString('foo\\,bar').keyOptions).toEqual(['foo,bar']);
          expect(TQC.fromString('!foo').keyOptions).toEqual(['foo']);
          expect(TQC.fromString('').keyOptions).toEqual(['']);
          expect(TQC.fromString('**').keyOptions).toBeUndefined();
          expect(TQC.fromString('*').keyOptions).toBeUndefined();
        });

        it("should set keyOptionLookup property", function () {
          expect(TQC.fromString('foo').keyOptionLookup).toEqual({foo: 1});
          expect(TQC.fromString('foo,bar').keyOptionLookup).toEqual({
            foo: 1,
            bar: 1
          });
          expect(TQC.fromString('!foo').keyOptionLookup).toEqual({
            foo: 1
          });
        });

        it("should set matchesPrimitiveValues property", function () {
          expect(TQC.fromString('foo').matchesPrimitiveValues).toBeFalsy();
          expect(TQC.fromString('foo:$').matchesPrimitiveValues).toBeTruthy();
          expect(TQC.fromString('foo:\\$').matchesPrimitiveValues).toBeFalsy();
          expect(TQC.fromString('foo:bar').matchesPrimitiveValues).toBeFalsy();
        });

        it("should set isValueExcluded property", function () {
          expect(TQC.fromString('foo').isValueExcluded).toBeFalsy();
          expect(TQC.fromString('foo:*').isValueExcluded).toBeFalsy();
          expect(TQC.fromString('foo:bar').isValueExcluded).toBeFalsy();
          expect(TQC.fromString('foo:!bar').isValueExcluded).toBeTruthy();
        });

        it("should set matchesAnyValue property", function () {
          expect(TQC.fromString('foo').matchesAnyValue).toBeTruthy();
          expect(TQC.fromString('foo:*').matchesAnyValue).toBeTruthy();
          expect(TQC.fromString('foo:\\*').matchesAnyValue).toBeFalsy();
          expect(TQC.fromString('foo:bar').matchesAnyValue).toBeFalsy();
          expect(TQC.fromString('foo:!bar').matchesAnyValue).toBeFalsy();
        });

        it("should set valueOptions property", function () {
          expect(TQC.fromString('**').valueOptions).toBeUndefined();
          expect(TQC.fromString('**!foo').valueOptions).toBeUndefined();
          expect(TQC.fromString('*').valueOptions).toBeUndefined();
          expect(TQC.fromString('*:foo').valueOptions).toEqual(['foo']);
          expect(TQC.fromString('*:foo\\,bar').valueOptions)
          .toEqual(['foo,bar']);
          expect(TQC.fromString('!quux:foo,bar').valueOptions)
          .toEqual(['foo', 'bar']);
          expect(TQC.fromString('*:!foo,bar').valueOptions)
          .toEqual(['foo', 'bar']);
          expect(TQC.fromString('*:').valueOptions).toEqual(['']);
          expect(TQC.fromString('*:!').valueOptions).toEqual(['']);
          expect(TQC.fromString('*:*').valueOptions).toBeUndefined();
          expect(TQC.fromString('*:$').valueOptions).toBeUndefined();
        });
      });

      describe("from properties", function () {
        it("should set keyOptionLookup property", function () {
          expect(TQC.create().keyOptionLookup).toBeUndefined();
          expect(TQC.create({
            keyOptions: ['foo', 'bar']
          }).keyOptionLookup).toEqual({
            foo: 1,
            bar: 1
          });
        });

        it("should set matchesAnyKey property", function () {
          expect(TQC.create().matchesAnyKey).toBeTruthy();
          expect(TQC.create({
            keyOptions: ['foo', 'bar']
          }).matchesAnyKey).toBeFalsy();
          expect(TQC.create({
            keyOptions: ['foo', 'bar'],
            matchesAnyKey: true
          }).matchesAnyKey).toBeFalsy();
          expect(TQC.create({
            matchesAnyKey: true
          }).matchesAnyKey).toBeTruthy();
        });

        it("should set matchesAnyValue property", function () {
          expect(TQC.create().matchesAnyValue).toBeTruthy();
          expect(TQC.create({
            valueOptions: ['foo', 'bar']
          }).matchesAnyValue).toBeFalsy();
          expect(TQC.create({
            valueOptions: ['foo', 'bar'],
            matchesAnyValue: true
          }).matchesAnyValue).toBeFalsy();
          expect(TQC.create({
            matchesAnyValue: true
          }).matchesAnyValue).toBeTruthy();
        });

        it("should set matchesPrimitiveValues property", function () {
          expect(TQC.create().matchesPrimitiveValues).toBeFalsy();
          expect(TQC.create({
            valueOptions: ['foo', 'bar']
          }).matchesPrimitiveValues).toBeFalsy();
          expect(TQC.create({
            valueOptions: ['foo', 'bar'],
            matchesPrimitiveValues: true
          }).matchesPrimitiveValues).toBeFalsy();
          expect(TQC.create({
            matchesPrimitiveValues: true
          }).matchesPrimitiveValues).toBeTruthy();
        });
      });
    });

    describe("clone()", function () {
      beforeEach(function () {
        tQC = TQC.create({
          keyOptions: ['foo', 'bar'],
          isKeyExcluded: true,
          valueOptions: ['baz'],
          isValueExcluded: true
        });
        result = tQC.clone();
      });

      it("should return TreeQueryComponent instance", function () {
        expect(TQC.mixedBy(result)).toBeTruthy();
      });

      it("should initialize properties", function () {
        expect(result).toEqual(tQC);
      });
    });

    describe("toString()", function () {
      describe("when isSkipper is true", function () {
        it("should discard value", function () {
          expect(TQC.fromString('**:foo') + '').toBe('**');
        });

        describe("and key is excluded", function () {
          it("should include excluded key options", function () {
            expect(TQC.fromString('**!foo') + '').toBe('**!foo');
          });
        });
      });

      describe("when isKeyExcluded is true", function () {
        it("should exclude keys", function () {
          expect(TQC.fromString('!foo') + '').toBe('!foo');
          expect(TQC.fromString('!foo:baz') + '').toBe('!foo:baz');
        });
      });

      describe("when matchesAnyKey is true", function () {
        it("should output key wildcard", function () {
          expect(TQC.fromString('*') + '').toBe('*');
          expect(TQC.fromString('*:foo') + '').toBe('*:foo');
        });
      });

      describe("when keyOptions are specified", function () {
        it("should include key options", function () {
          expect(TQC.fromString('foo,bar:baz') + '')
          .toBe('foo,bar:baz');
        });
      });

      describe("when matchesPrimitiveValues is true", function () {
        it("should output primitive value marker", function () {
          expect(TQC.fromString('foo:$') + '').toBe('foo:$');
        });
      });

      describe("when isValueExcluded is true", function () {
        it("should exclude keys", function () {
          expect(TQC.fromString('foo:!bar') + '').toBe('foo:!bar');
        });
      });

      describe("when matchesAnyValue is true", function () {
        it("should output value wildcard", function () {
          expect(TQC.fromString('foo:*') + '').toBe('foo');
          expect(TQC.fromString('foo') + '').toBe('foo');
        });
      });

      describe("when valueOptions are specified", function () {
        it("should include value options", function () {
          expect(TQC.fromString('foo:bar,baz') + '').toBe('foo:bar,baz');
        });
      });
    });

    describe("matches()", function () {
      describe("for matching key and value", function () {
        it("should return true", function () {
          // skipper
          expect(TQC.fromString('**').matches('foo')).toBeTruthy();
          expect(TQC.fromString('**!bar').matches('foo')).toBeTruthy();

          // key wildcard
          expect(TQC.fromString('*').matches('foo')).toBeTruthy();

          // key options
          expect(TQC.fromString('foo,bar').matches('foo')).toBeTruthy();
          expect(TQC.fromString('foo,bar').matches('bar')).toBeTruthy();

          // excluded key options
          expect(TQC.fromString('!foo,bar').matches('baz')).toBeTruthy();

          // value wildcard
          expect(TQC.fromString('foo:*').matches('foo', 'bar')).toBeTruthy();

          // value options
          expect(TQC.fromString('foo:bar,baz').matches('foo', 'bar'))
          .toBeTruthy();
          expect(TQC.fromString('foo:bar,baz').matches('foo', 'baz'))
          .toBeTruthy();

          // excluded value options
          expect(TQC.fromString('foo:!bar,baz').matches('foo', 'foo'))
          .toBeTruthy();

          // primitive value
          expect(TQC.fromString('foo:$').matches('foo', 'foo')).toBeTruthy();
          expect(TQC.fromString('foo:$').matches('foo', 1)).toBeTruthy();
          expect(TQC.fromString('foo:$').matches('foo', true)).toBeTruthy();
          expect(TQC.fromString('foo:$').matches('foo', null)).toBeTruthy();
        });
      });

      describe("for non-matching key or value", function () {
        it("should return false", function () {
          // skipper
          expect(TQC.fromString('**!foo').matches('foo')).toBeFalsy();

          // key options
          expect(TQC.fromString('foo,bar').matches('baz')).toBeFalsy();

          // excluded key options
          expect(TQC.fromString('!foo,bar').matches('foo')).toBeFalsy();
          expect(TQC.fromString('!foo,bar').matches('bar')).toBeFalsy();

          // value options
          expect(TQC.fromString('foo:bar,baz').matches('foo', 'foo'))
          .toBeFalsy();

          // excluded value options
          expect(TQC.fromString('foo:!bar,baz').matches('foo', 'bar'))
          .toBeFalsy();
          expect(TQC.fromString('foo:!bar,baz').matches('foo', 'baz'))
          .toBeFalsy();

          // primitive value
          expect(TQC.fromString('foo:$').matches('foo', {})).toBeFalsy();
          expect(TQC.fromString('foo:$').matches('foo', [])).toBeFalsy();
        });
      });
    });
  });
});

describe("String", function () {
  describe("toTreeQueryComponent()", function () {
    var string,
        queryComponent;

    beforeEach(function () {
      string = 'foo:!bar';
    });

    it("should create a TreeQueryComponent instance", function () {
      queryComponent = string.toTreeQueryComponent();
      expect($data.TreeQueryComponent.mixedBy(queryComponent)).toBeTruthy();
    });

    it("should return created instance", function () {
      queryComponent = string.toTreeQueryComponent();
      expect(queryComponent.componentString).toBe(string);
    });

    it("should pass additional properties to create", function () {
      queryComponent = string.toTreeQueryComponent({bar: 'baz'});
      expect(queryComponent.bar).toBe('baz');
    });
  });
});
