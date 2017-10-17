"use strict";

var $oop = window['blend-oop'],
    $event = window['blend-event'],
    $template = window['blend-template'];

describe("$event", function () {
  describe("Event", function () {
    var result;

    describe("create()", function () {
      describe("when eventName matches EVENT_TEMPLATE_PARAMETER_CHANGE", function () {
        beforeEach(function () {
          result = $event.Event.fromEventName($template.EVENT_TEMPLATE_PARAMETER_CHANGE);
        });

        it("should return TemplateParameterChangeEvent instance", function () {
          expect($template.TemplateParameterChangeEvent.mixedBy(result))
          .toBeTruthy();
        });
      });
    });
  });
});
