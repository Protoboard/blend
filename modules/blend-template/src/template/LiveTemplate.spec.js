"use strict";

var $oop = window['blend-oop'],
    $event = window['blend-event'],
    $template = window['blend-template'];

describe("$template", function () {
  describe("LiveTemplate", function () {
    var LiveTemplate,
        liveTemplate,
        result;

    beforeAll(function () {
      LiveTemplate = $oop.createClass('test.$template.LiveTemplate.LiveTemplate')
      .blend($template.LiveTemplate)
      .build();
    });

    beforeEach(function () {
      liveTemplate = LiveTemplate.fromString('Hello {{name}}!');
    });

    describe(".create()", function () {
      it("should initialize listeningPath property", function () {
        expect(liveTemplate.listeningPath)
        .toEqual(['template', '' + liveTemplate.instanceId].toTreePath()
        .toString());
      });

      it("should initialize triggerPaths property", function () {
        expect(liveTemplate.triggerPaths.list).toContain(
            ['template', '' + liveTemplate.instanceId].toTreePath().toString(),
            'template');
      });

      it("should initialize parameterValues property", function () {
        expect(liveTemplate.parameterValues).toEqual({});
      });
    });

    describe("#setParameterValues()", function () {
      it("should return self", function () {
        var result = liveTemplate.setParameterValues({
          foo: 'bar',
          baz: 'quux'
        });
        expect(result).toBe(liveTemplate);
      });

      it("should append specified parameter values", function () {
        liveTemplate.setParameterValues({
          foo: 'bar',
          baz: 'quux'
        });
        expect(liveTemplate.parameterValues).toEqual({
          foo: 'bar',
          baz: 'quux'
        });
      });

      it("should trigger event", function () {
        spyOn($event.Event, 'trigger');
        liveTemplate.setParameterValues({
          foo: 'bar',
          baz: 'quux'
        });

        var calls = $event.Event.trigger.calls.all();
        expect(calls.length).toBe(1);
        expect(calls[0].object).toEqual(liveTemplate.spawnEvent({
          eventName: $template.EVENT_TEMPLATE_PARAMETER_CHANGE,
          parameterValuesBefore: {},
          parameterValuesAfter: {
            foo: 'bar',
            baz: 'quux'
          }
        }));
      });

      describe("then setting same parameters", function () {
        beforeEach(function () {
          liveTemplate.setParameterValues({
            foo: 'bar',
            baz: 'quux'
          });
        });

        it("should not trigger event", function () {
          spyOn($event.Event, 'trigger');
          liveTemplate.setParameterValues({
            foo: 'bar',
            baz: 'quux'
          });
          expect($event.Event.trigger).not.toHaveBeenCalled();
        });
      });

      describe("when parameter value is a LiveTemplate", function () {
        it("should transfer parameter values", function () {
          liveTemplate.setParameterValues({
            bar: $template.LiveTemplate.create({
              templateString: 'foo',
              parameterValues: {
                param1: 1,
                param2: 2
              }
            })
          });
          expect(liveTemplate.parameterValues).toEqual({
            bar: 'foo',
            param1: 1,
            param2: 2
          });
        });
      });
    });

    describe("#toString()", function () {
      beforeEach(function () {
        liveTemplate.setParameterValues({
          name: "World"
        });
        result = liveTemplate.toString();
      });

      it("should return resolved template", function () {
        expect(result).toBe("Hello World!");
      });
    });
  });
});

describe("String", function () {
  var result;

  describe("#toLiveTemplate()", function () {
    var liveTemplate;

    it("should create a LiveTemplate instance", function () {
      liveTemplate = 'foo'.toLiveTemplate();
      expect($template.LiveTemplate.mixedBy(liveTemplate)).toBeTruthy();
    });

    it("should set templateString property", function () {
      liveTemplate = 'foo'.toLiveTemplate();
      expect(liveTemplate.templateString).toBe('foo');
    });

    it("should pass additional properties to create", function () {
      liveTemplate = 'foo'.toLiveTemplate({bar: 'baz'});
      expect(liveTemplate.bar).toBe('baz');
    });
  });
});
