"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("SingleChoice", function () {
    var SingleChoice,
        singleChoice,
        RootWidget;

    beforeAll(function () {
      SingleChoice = $oop.createClass('test.$ui.SingleChoice.SingleChoice')
      .blend($widget.Widget)
      .blend($ui.InputValueHost)
      .blend($ui.SingleChoice)
      .build();
      SingleChoice.__builder.forwards = {list: [], lookup: {}};
      RootWidget = $oop.createClass('test.$ui.SingleChoice.RootWidget')
      .blend($widget.RootWidget)
      .build();
      RootWidget.__builder.forwards = {list: [], lookup: {}};
    });

    describe("addChildNode()", function () {
      var option;

      beforeEach(function () {
        singleChoice = SingleChoice.create();
        option = $ui.Option.create({
          ownValue: 'foo'
        });
      });

      it("should return self", function () {
        var result = singleChoice.addChildNode(option);
        expect(result).toBe(singleChoice);
      });

      describe("when node's ownValue matches inputValue", function () {
        beforeEach(function () {
          singleChoice.setInputValue('foo');
        });

        it("should select node", function () {
          singleChoice.addChildNode(option);
          expect(option.isSelected()).toBeTruthy();
        });

        describe("when ownValue and inputValue are both undefined", function () {
          beforeEach(function () {
            option.setOwnValue(undefined);
          });

          it("should not select node", function () {
            singleChoice.addChildNode(option);
            expect(option.isSelected()).toBeFalsy();
          });
        });
      });
    });

    describe("removeChildNode()", function () {
      var option;

      beforeEach(function () {
        singleChoice = SingleChoice.create();
        option = $ui.Option.create({
          nodeName: 'foo',
          ownValue: 'bar'
        });
        singleChoice.addChildNode(option);
      });

      it("should return self", function () {
        var result = singleChoice.removeChildNode(option);
        expect(result).toBe(singleChoice);
      });

      describe("when node is selected", function () {
        beforeEach(function () {
          option.select();
        });

        it("should deselect node", function () {
          singleChoice.removeChildNode('foo');
          expect(option.isSelected()).toBeFalsy();
        });
      });
    });

    describe("setInputValue()", function () {
      var option1,
          option2;

      beforeEach(function () {
        singleChoice = SingleChoice.create();
        option1 = $ui.Option.create({
          ownValue: 'foo'
        });
        option2 = $ui.Option.create({
          ownValue: 'bar'
        });
        singleChoice.addChildNode(option1);
        singleChoice.addChildNode(option2);
      });

      it("should return self", function () {
        var result = singleChoice.setInputValue('bar');
        expect(result).toBe(singleChoice);
      });

      describe("when input value matches option ownValue", function () {
        it("should select matching option", function () {
          singleChoice.setInputValue('foo');
          expect(option1.isSelected()).toBeTruthy();
        });
      });

      describe("when a different option was selected before", function () {
        beforeEach(function () {
          singleChoice.addToParentNode(RootWidget.create());
          singleChoice.onAttach();
          option2.select();
        });

        afterEach(function () {
          singleChoice.removeFromParentNode();
        });

        it("should deselect previously active option", function () {
          singleChoice.setInputValue('foo');
          expect(option2.isSelected()).toBeFalsy();
        });
      });
    });

    describe("onAttach()", function () {
      var option1,
          option2;

      beforeEach(function () {
        singleChoice = SingleChoice.create({
          inputValue: 'bar'
        });
        option1 = $ui.Option.create({
          ownValue: 'foo'
        });
        option2 = $ui.Option.create({
          ownValue: 'bar'
        });
        singleChoice.addChildNode(option1);
        singleChoice.addChildNode(option2);
      });

      it("should sync selectables' selected states", function () {
        singleChoice.onAttach();
        expect(option2.isSelected).toBeTruthy();
      });
    });

    describe("onSelectableOwnValueChange()", function () {
      var option;

      beforeEach(function () {
        singleChoice = SingleChoice.create({
          inputValue: 'foo'
        });
        option = $ui.Option.create({
          ownValue: 'foo'
        });
        singleChoice.addChildNode(option);
        singleChoice.addToParentNode(RootWidget.create());
        singleChoice.onAttach();
      });

      afterEach(function () {
        singleChoice.removeFromParentNode();
      });

      it("should update inputValue", function () {
        option.setOwnValue('bar');
        expect(singleChoice.inputValue).toBe('bar');
      });
    });

    describe("onStateChange()", function () {
      var option;

      beforeEach(function () {
        singleChoice = SingleChoice.create();
        option = $ui.Option.create({
          ownValue: 'foo'
        });
        singleChoice.addChildNode(option);
        singleChoice.addToParentNode(RootWidget.create());
        singleChoice.onAttach();
      });

      afterEach(function () {
        singleChoice.removeFromParentNode();
      });

      it("should update inputValue", function () {
        option.select();
        expect(singleChoice.inputValue).toBe('foo');
      });
    });
  });
});
