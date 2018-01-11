"use strict";

var $oop = window['blend-oop'],
    $utils = window['blend-utils'];

describe("$utils", function () {
  describe("PathPatternComponent", function () {
    var PathPatternComponent,
        pathPatternComponent;

    beforeAll(function () {
      PathPatternComponent = $oop.createClass('test.$utils.PathPatternComponent.PathPatternComponent')
      .blend($utils.PathPatternComponent)
      .build();
      PathPatternComponent.__builder.forwards = {list: [], lookup: {}};
    });

    describe("fromString()", function () {
      it("should return PathPatternComponent instance", function () {
        pathPatternComponent = PathPatternComponent.fromString(':foo');
        expect(PathPatternComponent.mixedBy(pathPatternComponent)).toBeTruthy();
      });

      it("should set properties", function () {
        pathPatternComponent = PathPatternComponent.fromString(':foo');
        expect(pathPatternComponent).toEqual(PathPatternComponent.create({
          componentString: ':foo'
        }));
      });
    });

    describe("fromParameterName()", function () {
      it("should return PathPatternComponent instance", function () {
        pathPatternComponent = PathPatternComponent.fromParameterName('foo');
        expect(PathPatternComponent.mixedBy(pathPatternComponent)).toBeTruthy();
      });

      it("should set properties", function () {
        pathPatternComponent = PathPatternComponent.fromParameterName('foo');
        expect(pathPatternComponent).toEqual(PathPatternComponent.create({
          parameterName: 'foo'
        }));
      });
    });

    describe("create()", function () {
      describe("from string", function () {
        it("should initialize parameterName", function () {
          pathPatternComponent = PathPatternComponent.create({
            componentString: ':foo'
          });
          expect(pathPatternComponent.parameterName).toBe('foo');
        });

        describe("when not prefixed", function () {
          it("should not initialize parameterName", function () {
            pathPatternComponent = PathPatternComponent.create({
              componentString: 'foo'
            });
            expect(pathPatternComponent.parameterName).toBeUndefined();
          });
        });

        describe("when componentString has escaped special chars", function () {
          it("should unescape special chars", function () {
            pathPatternComponent = PathPatternComponent.create({
              componentString: ':foo\\:bar'
            });
            expect(pathPatternComponent.parameterName).toBe('foo:bar');
          });
        });
      });

      describe("from parameterName", function () {
        it("should initialize componentString", function () {
          pathPatternComponent = PathPatternComponent.create({
            parameterName: 'foo'
          });
          expect(pathPatternComponent.componentString).toBe(':foo');
        });

        describe("when parameterName contains special chars", function () {
          it("should escape special chars", function () {
            pathPatternComponent = PathPatternComponent.create({
              parameterName: 'foo:bar'
            });
            expect(pathPatternComponent.componentString).toBe(':foo\\:bar');
          });
        });
      });
    });

    describe("matches()", function () {
      describe("for parameters", function () {
        beforeEach(function () {
          pathPatternComponent = PathPatternComponent.fromString(':foo');
        });

        it("should return true", function () {
          expect(pathPatternComponent.matches('foo')).toBeTruthy();
          expect(pathPatternComponent.matches('bar')).toBeTruthy();
          expect(pathPatternComponent.matches(undefined)).toBeTruthy();
        });
      });

      describe("for literals", function () {
        beforeEach(function () {
          pathPatternComponent = PathPatternComponent.fromString('foo');
        });

        describe("when passing same string", function () {
          it("should return true", function () {
            expect(pathPatternComponent.matches('foo')).toBeTruthy();
          });
        });

        describe("when passing different string", function () {
          it("should return false", function () {
            expect(pathPatternComponent.matches('bar')).toBeFalsy();
            expect(pathPatternComponent.matches(undefined)).toBeFalsy();
          });
        });
      });
    });

    describe("toString()", function () {
      beforeEach(function () {
        pathPatternComponent = PathPatternComponent.fromString(':foo');
      });

      it("should return componentString", function () {
        expect(pathPatternComponent.toString()).toBe(':foo');
      });
    });
  });
});
