"use strict";

var $oop = window['blend-oop'],
    $entity = window['blend-entity'],
    $template = window['blend-template'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("TemplateText", function () {
    var TemplateText,
        templateText;

    beforeAll(function () {
      TemplateText = $oop.createClass('test.$ui.TemplateText.TemplateText')
      .blend($ui.TemplateText)
      .build();
      TemplateText.__builder.forwards = {list: [], lookup: {}};
    });

    describe(".fromTextTemplate()", function () {
      var liveTemplate;

      beforeEach(function () {
        liveTemplate = "Hello {{name}}!".toLiveTemplate();
      });

      it("should return TemplateText", function () {
        templateText = TemplateText.fromTextTemplate(liveTemplate);
        expect(TemplateText.mixedBy(templateText)).toBeTruthy();
      });

      it("should initialize textTemplate", function () {
        templateText = TemplateText.fromTextTemplate(liveTemplate);
        expect(templateText.textTemplate).toBe(liveTemplate);
      });
    });

    describe(".create()", function () {
      var liveTemplate;

      beforeEach(function () {
        liveTemplate = "Hello {{name}}!".toLiveTemplate();
      });

      describe("on invalid textTemplate", function () {
        it("should throw", function () {
          expect(function () {
            TemplateText.create();
          }).toThrow();
        });
      });

      it("should initialize textTemplate", function () {
        templateText = TemplateText.create({textTemplate: liveTemplate});
        expect(templateText.textTemplate).toBe(liveTemplate);
      });
    });

    describe("#onAttach()", function () {
      var field,
          liveTemplate;

      beforeEach(function () {
        field = 'foo/bar/baz'.toField();
        field.setNode("World");
        liveTemplate = "Hello {{name}}!".toLiveTemplate()
        .setParameterValues({
          name: field
        });
        templateText = TemplateText.create({
          textTemplate: liveTemplate
        });
      });

      afterEach(function () {
        templateText.destroy();
        field.deleteNode();
      });

      it("should sync textContent", function () {
        templateText.onAttach();
        expect(templateText.textContent).toBe("Hello World!");
      });

      it("should subscribe to EVENT_TEMPLATE_PARAMETER_CHANGE", function () {
        templateText.onAttach();
        expect(templateText.subscribes(
            $template.EVENT_TEMPLATE_PARAMETER_CHANGE,
            liveTemplate)).toBeTruthy();
      });

      it("should subscribe to EVENT_ENTITY_CHANGE", function () {
        templateText.onAttach();
        expect(templateText.subscribes($entity.EVENT_ENTITY_CHANGE, field))
        .toBeTruthy();
      });
    });

    describe("#setTextTemplate()", function () {
      var field1, field2,
          liveTemplateBefore,
          liveTemplateAfter;

      beforeEach(function () {
        field1 = 'foo/bar/quux'.toField();
        field1.setNode(3);
        field2 = 'foo/bar/baz'.toField();
        liveTemplateBefore = "{{count}} apples".toLiveTemplate()
        .setParameterValues({
          count: field1
        });
        liveTemplateAfter = "Hello {{name}}!".toLiveTemplate()
        .setParameterValues({
          name: field2
        });
        templateText = TemplateText.fromTextTemplate(liveTemplateBefore);
      });

      afterEach(function () {
        templateText.destroy();
        field1.deleteNode();
      });

      it("should return self", function () {
        var result = templateText.setTextTemplate(liveTemplateAfter);
        expect(result).toBe(templateText);
      });

      it("should sync textContent", function () {
        templateText.setTextTemplate(liveTemplateAfter);
        expect(templateText.textContent).toBe("3 apples");
      });

      it("should save before state", function () {
        templateText.setTextTemplate(liveTemplateAfter);
        expect(templateText.setTextTemplate.shared.textTemplateBefore)
        .toBe(liveTemplateBefore);
      });

      it("should subscribe to EVENT_TEMPLATE_PARAMETER_CHANGE", function () {
        templateText.setTextTemplate(liveTemplateAfter);
        expect(templateText.subscribes(
            $template.EVENT_TEMPLATE_PARAMETER_CHANGE,
            liveTemplateAfter)).toBeTruthy();
      });

      it("should subscribe to EVENT_ENTITY_CHANGE", function () {
        templateText.setTextTemplate(liveTemplateAfter);
        expect(templateText.subscribes($entity.EVENT_ENTITY_CHANGE, field2))
        .toBeTruthy();
      });

      it("should unsubscribe from EVENT_TEMPLATE_PARAMETER_CHANGE", function () {
        templateText.setTextTemplate(liveTemplateAfter);
        expect(templateText.subscribes(
            $template.EVENT_TEMPLATE_PARAMETER_CHANGE,
            liveTemplateBefore)).toBeFalsy();
      });

      it("should unsubscribe from EVENT_ENTITY_CHANGE", function () {
        templateText.setTextTemplate(liveTemplateAfter);
        expect(templateText.subscribes($entity.EVENT_ENTITY_CHANGE, field1))
        .toBeFalsy();
      });
    });

    describe("#onActiveTranslationsChange()", function () {
      var liveTemplate;

      beforeEach(function () {
        '_translation/helloname-de'.toDocument().setNode({
          originalString: "Hello {{name}}!",
          pluralForms: ["Hallo {{name}}!"]
        });
        '_translation/world-de'.toDocument().setNode({
          originalString: "World",
          pluralForms: ["Welt"]
        });
        '_locale/de'.toDocument().setNode({
          localeName: 'German',
          pluralFormula: 'nplurals=2; plural=(n != 1);',
          translations: {
            '_translation/helloname-de': 1,
            '_translation/world-de': 1
          }
        });

        liveTemplate = $template.LiveTemplate
        .fromStringifiable("Hello {{name}}!".toTranslatable())
        .setParameterValues({
          name: "World".toTranslatable()
        });
        templateText = TemplateText.create({textTemplate: liveTemplate});
        templateText.onAttach();
      });

      afterEach(function () {
        templateText.destroy();
        'en'.toLocale().setAsActiveLocale();
        '_translation/helloworld-de'.toDocument().deleteNode();
        '_locale/de'.toDocument().deleteNode();
      });

      it("should sync textContent", function () {
        'de'.toLocale().setAsActiveLocale();
        expect(templateText.textContent).toBe("Hallo Welt!");
      });
    });

    describe("#onTemplateParameterChange()", function () {
      var liveTemplate;

      beforeEach(function () {
        liveTemplate = "Hello {{name}}!".toLiveTemplate()
        .setParameterValues({
          name: "World"
        });
        templateText = TemplateText.create({textTemplate: liveTemplate});
        templateText.onAttach();
      });

      afterEach(function () {
        templateText.destroy();
      });

      it("should sync textContent", function () {
        liveTemplate.setParameterValues({
          name: "All"
        });
        expect(templateText.textContent).toBe("Hello All!");
      });
    });

    describe("#onEntityParameterChange()", function () {
      var liveTemplate;

      beforeEach(function () {
        liveTemplate = "Hello {{name}}!".toLiveTemplate()
        .setParameterValues({
          name: 'foo/bar/baz'.toField().setNode("World")
        });
        templateText = TemplateText.create({textTemplate: liveTemplate});
        templateText.onAttach();
      });

      afterEach(function () {
        templateText.destroy();
        'foo/bar/baz'.toField().deleteNode();
      });

      it("should sync textContent", function () {
        'foo/bar/baz'.toField().setNode("All");
        expect(templateText.textContent).toBe("Hello All!");
      });
    });
  });
});
