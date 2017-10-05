"use strict";

var $assert = window['cake-assert'],
    $oop = window['cake-oop'],
    $utils = window['cake-utils'],
    $template = window['cake-template'];

describe("$assert", function () {
  var template;

  beforeEach(function () {
    template = $template.Template.fromString('foo');
    spyOn($assert, 'assert').and.callThrough();
  });

  describe("isTemplate()", function () {
    it("should pass message to assert", function () {
      $assert.isTemplate(template, "bar");
      expect($assert.assert).toHaveBeenCalledWith(true, "bar");
    });

    describe("when passing non-Template", function () {
      it("should throw", function () {
        expect(function () {
          $assert.isTemplate({});
        }).toThrow();
      });
    });
  });

  describe("isTemplateOptional()", function () {
    it("should pass message to assert", function () {
      $assert.isTemplateOptional(template, "bar");
      expect($assert.assert).toHaveBeenCalledWith(true, "bar");
    });

    describe("when passing non-Template", function () {
      it("should throw", function () {
        expect(function () {
          $assert.isTemplateOptional({});
        }).toThrow();
      });
    });
  });
});

describe("$template", function () {
  describe("Template", function () {
    var Stringifiable,
        Template,
        template,
        result;

    beforeEach(function () {
      Stringifiable = $oop.getClass('test.$template.Template.Stringifiable')
      .implement($utils.Stringifiable)
      .define({
        fromAb: function (a, b) {
          return this.create({a: a, b: b});
        },
        toString: function () {
          return "" + this.a + this.b;
        }
      });
      Template = $oop.getClass('test.$template.Template.Template')
      .mix($template.Template);
    });

    describe("fromString()", function () {
      beforeEach(function () {
        result = Template.fromString("foo");
      });

      it("should return Template instance", function () {
        expect(Template.mixedBy(result)).toBeTruthy();
      });

      it("should set templateString property", function () {
        expect(result.templateString).toBe("foo");
      });
    });

    describe("fromStringifiable()", function () {
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

    describe("create()", function () {
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

    describe("extractTokens()", function () {
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

    describe("getResolvedString()", function () {
      beforeEach(function () {
        template = 'foo {{bar}} baz'.toTemplate();
      });

      it("should leave undefined parameters intact", function () {
        result = template.getResolvedString({});
        expect(result).toBe('foo {{bar}} baz');
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
  var result;

  describe("toTemplate()", function () {
    var template;

    beforeEach(function () {
      template = $template.Template.fromString('foo/bar/baz');
      spyOn($template.Template, 'create').and.returnValue(template);
      result = 'foo'.toTemplate();
    });

    it("should create a Template instance", function () {
      expect($template.Template.create).toHaveBeenCalledWith({
        templateString: 'foo'
      });
    });

    it("should return created instance", function () {
      expect(result).toBe(template);
    });
  });
});
