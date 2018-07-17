"use strict";

var $oop = window['blend-oop'],
    $event = window['blend-event'],
    $i18n = window['blend-i18n'];

describe("$event", function () {
  describe("Event", function () {
    var result;

    describe(".create()", function () {
      describe("when eventName matches EVENT_LOCALE_CHANGE", function () {
        beforeEach(function () {
          result = $event.Event.fromEventName($i18n.EVENT_LOCALE_CHANGE);
        });

        it("should return LocaleChangeEvent instance", function () {
          expect($i18n.LocaleChangeEvent.mixedBy(result))
          .toBeTruthy();
        });
      });
    });
  });
});
