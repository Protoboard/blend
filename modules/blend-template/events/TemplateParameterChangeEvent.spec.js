"use strict";

var $oop = window['blend-oop'],
    $event = window['blend-event'],
    $template = window['blend-template'];

describe("$event", function () {
  describe("Event", function () {
    describe("create()", function () {
      describe("when eventName matches EVENT_TEMPLATE_PARAMETER_CHANGE", function () {
        it("should return TemplateParameterChangeEvent instance", function () {
          var result = $event.Event.fromEventName($template.EVENT_TEMPLATE_PARAMETER_CHANGE);
          expect($template.TemplateParameterChangeEvent.mixedBy(result))
          .toBeTruthy();
        });
      });
    });
  });
});
