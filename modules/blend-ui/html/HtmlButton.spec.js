"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("HtmlButton", function () {
    var HtmlButton,
        htmlButton;

    beforeAll(function () {
      HtmlButton = $oop.createClass('test.$ui.HtmlButton.HtmlButton')
      .blend($ui.Button)
      .blend($ui.HtmlButton)
      .build();
      HtmlButton.__builder.forwards = {list: [], lookup: {}};
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
      Button = $oop.createClass('test.$ui.HtmlButton.Button')
      .blend($ui.Button)
      .build();
    });

    describe("create()", function () {
      describe("in HTML environment", function () {
        it("should return HtmlButton instance", function () {
          button = Button.create();
          expect($ui.HtmlButton.mixedBy(button)).toBeTruthy();
        });
      });
    });
  });
});
