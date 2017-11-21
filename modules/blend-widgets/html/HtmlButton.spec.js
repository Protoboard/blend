"use strict";

var $oop = window['blend-oop'],
    $widgets = window['blend-widgets'];

describe("$widgets", function () {
  describe("HtmlButton", function () {
    var HtmlButton,
        htmlButton;

    beforeAll(function () {
      HtmlButton = $oop.getClass('test.$widgets.HtmlButton.HtmlButton')
      .blend($widgets.Button)
      .blend($widgets.HtmlButton);
      HtmlButton.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("create()", function () {
      it("should initialize elementName", function () {
        htmlButton = HtmlButton.create();
        expect(htmlButton.elementName).toBe('button');
      });

      it("should initialize 'disabled' attribute", function () {
        htmlButton = HtmlButton.create({
          state: {
            disabled: true
          }
        });
        expect(htmlButton.getAttribute('disabled')).toBe('disabled');
      });
    });

    describe("setStateValue()", function () {
      beforeEach(function () {
        htmlButton = HtmlButton.create();
      });

      it("should return self", function () {
        var result = htmlButton.setStateValue('disabled', true);
        expect(result).toBe(htmlButton);
      });

      describe("when setting disabled state to true", function () {
        it("should add 'disabled' attribute", function () {
          htmlButton.setStateValue('disabled', true);
          expect(htmlButton.getAttribute('disabled')).toBe('disabled');
        });
      });

      describe("when setting disabled state to false", function () {
        it("should remove 'disabled' attribute", function () {
          htmlButton.setStateValue('disabled', false);
          expect(htmlButton.getAttribute('disabled')).toBeUndefined();
        });
      });
    });
  });

  describe("Button", function () {
    var Button,
        button;

    beforeAll(function () {
      Button = $oop.getClass('test.$widgets.HtmlButton.Button')
      .blend($widgets.Button);
    });

    describe("create()", function () {
      describe("in HTML environment", function () {
        it("should return HtmlButton instance", function () {
          button = Button.create();
          expect($widgets.HtmlButton.mixedBy(button)).toBeTruthy();
        });
      });
    });
  });
});
