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
