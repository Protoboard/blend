"use strict";

var $oop = window['blend-oop'],
    $utils = window['blend-utils'],
    $template = window['blend-template'];

describe("$template", function () {
  describe("Template", function () {
    var Stringifiable,
        Template,
        template,
        result;

    beforeAll(function () {
      Stringifiable = $oop.createClass('test.$template.Template.Stringifiable')
      .implement($utils.Stringifiable)
      .define({
        fromAb: function (a, b) {
          return this.create({a: a, b: b});
        },
        toString: function () {
          return "" + this.a + this.b;
        }
      })
      .build();
      Template = $oop.createClass('test.$template.Template.Template')
      .blend($template.Template)
      .build();
    });

    describe(".fromString()", function () {
      it("should return Template instance", function () {
        template = Template.fromString("foo");
        expect(Template.mixedBy(template)).toBeTruthy();
      });

      it("should set templateString property", function () {
        template = Template.fromString("foo");
        expect(template.templateString).toBe("foo");
      });

      it("should pass additional properties to create", function () {
        template = Template.fromString("foo", {bar: 'baz'});
        expect(template.bar).toBe('baz');
      });
    });

    describe(".fromStringifiable()", function () {
      var templateString;

      beforeEach(function () {
        templateString = Stringifiable.fromAb(1, 2);
        result = Template.fromStringifiable(templateString);
      });

      it("should return Template instance", function () {
        expect(Template.mixedBy(result)).toBeTruthy();
      });

      it("should set templateString property", function () {
        expect(result.templateString).toBe(templateString);
      });
    });

    describe(".create()", function () {
      describe("with string literal", function () {
        it("should set templateString property", function () {
          result = Template.create({templateString: "foo"});
          expect(result.templateString).toBe("foo");
        });
      });

      describe("with Stringifiable instance", function () {
        it("should set templateString property", function () {
          var templateString = Stringifiable.fromAb(1, 2);
          result = Template.create({templateString: templateString});
          expect(result.templateString).toBe(templateString);
        });
      });
    });

    describe("#extractTokens()", function () {
      describe("when templateString is string literal", function () {
        describe("with no params", function () {
          beforeEach(function () {
            template = "foo".toTemplate();
            result = template.extractTokens();
          });

          it("should return string literal", function () {
            expect(result).toEqual(['foo']);
          });
        });

        describe("with params", function () {
          beforeEach(function () {
            template = 'foo {{bar}} baz'.toTemplate();
            result = template.extractTokens();
          });

          it("should return parsed array", function () {
            expect(result).toEqual(['foo ', '{{bar}}', ' baz']);
          });

          describe("when params have leading/trailing whitespace", function () {
            beforeEach(function () {
              template = 'A {{   foo   }} B {{   bar   }} C'.toTemplate();
              result = template.extractTokens();
            });

            it("should strip out whitespace from params", function () {
              expect(result).toEqual(['A ', '{{foo}}', ' B ', '{{bar}}', ' C']);
            });
          });

          describe("when params are touching", function () {
            beforeEach(function () {
              template = '{{foo}}{{bar}}'.toTemplate();
              result = template.extractTokens();
            });

            it("should return parsed array", function () {
              expect(result).toEqual(['', '{{foo}}', '', '{{bar}}', '']);
            });
          });
        });
      });

      describe("when templateString is string Stringifiable", function () {
        describe("with no params", function () {
          beforeEach(function () {
            template = $template.Template.fromStringifiable({});
            result = template.extractTokens();
          });

          it("should return stringified instance", function () {
            expect(result).toEqual(['[object Object]']);
          });
        });

        describe("with params", function () {
          var templateString;

          beforeEach(function () {
            templateString = Stringifiable.fromAb('foo', '{{bar}} baz');
            template = $template.Template.fromStringifiable(templateString);
            result = template.extractTokens();
          });

          it("should return parsed array", function () {
            expect(result).toEqual(['foo', '{{bar}}', ' baz']);
          });
        });
      });
    });

    describe("#getResolvedString()", function () {
      beforeEach(function () {
        template = 'foo {{bar}} baz'.toTemplate();
      });

      it("should clear undefined parameters intact", function () {
        result = template.getResolvedString({});
        expect(result).toBe('foo  baz');
      });

      it("should resolve parameters", function () {
        result = template.getResolvedString({
          '{{bar}}': "quux"
        });
        expect(result).toBe("foo quux baz");
      });

      describe("when parameters are not handlebars-wrapped", function () {
        it("should resolve parameters", function () {
          result = template.getResolvedString({
            'bar': "quux"
          });
          expect(result).toBe("foo quux baz");
        });
      });

      describe("on missing parameter value list", function () {
        it("should replace parameters with empty string", function () {
          result = template.getResolvedString();
          expect(result).toBe('foo  baz');
        });
      });

      describe("when parameters have parameters", function () {
        it("should resolve second-degree parameters", function () {
          result = template.getResolvedString({
            '{{bar}}': "Hello {{what}}!",
            '{{what}}': "World"
          });
          expect(result).toBe("foo Hello World! baz");
        });
      });
    });
  });
});

describe("String", function () {
  describe("#toTemplate()", function () {
    var template;

    it("should create a Template instance", function () {
      template = 'foo'.toTemplate();
      expect($template.Template.mixedBy(template)).toBeTruthy();
    });

    it("should set templateString property", function () {
      template = 'foo'.toTemplate();
      expect(template.templateString).toBe('foo');
    });

    it("should pass additional properties to create", function () {
      template = 'foo'.toTemplate({bar: 'baz'});
      expect(template.bar).toBe('baz');
    });
  });
});
