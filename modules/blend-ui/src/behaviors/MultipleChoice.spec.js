"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("MultipleChoice", function () {
    var MultipleChoice,
        multipleChoice,
        RootWidget;

    beforeAll(function () {
      MultipleChoice = $oop.createClass('test.$ui.MultipleChoice.MultipleChoice')
      .blend($widget.Widget)
      .blend($ui.InputValuesHost)
      .blend($ui.MultipleChoice)
      .build();
      MultipleChoice.__builder.forwards = {list: [], lookup: {}};
      RootWidget = $oop.createClass('test.$ui.MultipleChoice.RootWidget')
      .blend($widget.RootWidget)
      .build();
      RootWidget.__builder.forwards = {list: [], lookup: {}};
    });

    describe("#addChildNode()", function () {
      var option;

      beforeEach(function () {
        multipleChoice = MultipleChoice.create();
        option = $ui.Option.create({
          ownValue: 'foo'
        });
      });

      it("should return self", function () {
        var result = multipleChoice.addChildNode(option);
        expect(result).toBe(multipleChoice);
      });

      describe("when node's ownValue matches inputValues", function () {
        beforeEach(function () {
          multipleChoice.setInputValues({foo: 'foo'});
        });

        it("should select node", function () {
          multipleChoice.addChildNode(option);
          expect(option.isSelected()).toBeTruthy();
        });

        describe("when ownValue and inputValue are both undefined", function () {
          beforeEach(function () {
            option.setOwnValue(undefined);
          });

          it("should not select node", function () {
            multipleChoice.addChildNode(option);
            expect(option.isSelected()).toBeFalsy();
          });
        });
      });
    });

    describe("#removeChildNode()", function () {
      var option;

      beforeEach(function () {
        multipleChoice = MultipleChoice.create();
        option = $ui.Option.create({
          nodeName: 'foo',
          ownValue: 'bar'
        });
        multipleChoice.addChildNode(option);
      });

      it("should return self", function () {
        var result = multipleChoice.removeChildNode(option);
        expect(result).toBe(multipleChoice);
      });

      describe("when node is selected", function () {
        beforeEach(function () {
          option.select();
        });

        it("should deselect node", function () {
          multipleChoice.removeChildNode('foo');
          expect(option.isSelected()).toBeFalsy();
        });
      });
    });

    describe("#setInputValues()", function () {
      var option1,
          option2;

      beforeEach(function () {
        multipleChoice = MultipleChoice.create();
        option1 = $ui.Option.create({
          ownValue: 'foo'
        });
        option2 = $ui.Option.create({
          ownValue: 'bar'
        });
        multipleChoice.addChildNode(option1);
        multipleChoice.addChildNode(option2);
      });

      it("should return self", function () {
        var result = multipleChoice.setInputValues({bar: 'bar'});
        expect(result).toBe(multipleChoice);
      });

      describe("when input value matches option ownValue", function () {
        it("should select matching option", function () {
          multipleChoice.setInputValues({foo: 'foo'});
          expect(option1.isSelected()).toBeTruthy();
        });
      });

      describe("when a different option was selected before", function () {
        beforeEach(function () {
          multipleChoice.addToParentNode(RootWidget.create());
          multipleChoice.onAttach();
          option2.select();
        });

        afterEach(function () {
          multipleChoice.removeFromParentNode();
        });

        it("should deselect previously active option", function () {
          multipleChoice.setInputValues({foo: 'foo'});
          expect(option2.isSelected()).toBeFalsy();
        });
      });
    });

    describe("#setInputValue()", function () {
      var option;

      beforeEach(function () {
        multipleChoice = MultipleChoice.create();
        option = $ui.Option.create({
          nodeName: 'foo',
          ownValue: 'bar'
        });
        multipleChoice.addChildNode(option);
      });

      it("should return self", function () {
        var result = multipleChoice.setInputValue('foo');
        expect(result).toBe(multipleChoice);
      });

      it("should select matching option", function () {
        multipleChoice.setInputValue('bar');
        expect(option.isSelected()).toBeTruthy();
      });
    });

    describe("#deleteInputValue()", function () {
      var option;

      beforeEach(function () {
        multipleChoice = MultipleChoice.create();
        option = $ui.Option.create({
          nodeName: 'foo',
          ownValue: 'bar'
        });
        multipleChoice.addChildNode(option);
        multipleChoice.setInputValue('bar');
      });

      it("should return self", function () {
        var result = multipleChoice.deleteInputValue('foo');
        expect(result).toBe(multipleChoice);
      });

      it("should deselect matching option", function () {
        multipleChoice.deleteInputValue('bar');
        expect(option.isSelected()).toBeFalsy();
      });
    });

    describe("#onAttach()", function () {
      var option1,
          option2;

      beforeEach(function () {
        multipleChoice = MultipleChoice.create({
          inputValues: {bar: 'bar'}
        });
        option1 = $ui.Option.create({
          ownValue: 'foo'
        });
        option2 = $ui.Option.create({
          ownValue: 'bar'
        });
        multipleChoice.addChildNode(option1);
        multipleChoice.addChildNode(option2);
      });

      it("should sync selectables' selected states", function () {
        multipleChoice.onAttach();
        expect(option2.isSelected).toBeTruthy();
      });
    });

    describe("#onSelectableOwnValueChange()", function () {
      var option;

      beforeEach(function () {
        multipleChoice = MultipleChoice.create({
          inputValues: {foo: 'foo'}
        });
        option = $ui.Option.create({
          ownValue: 'foo'
        });
        multipleChoice.addChildNode(option);
        multipleChoice.addToParentNode(RootWidget.create());
        multipleChoice.onAttach();
      });

      afterEach(function () {
        multipleChoice.removeFromParentNode();
      });

      it("should update inputValues", function () {
        option.setOwnValue('bar');
        expect(multipleChoice.inputValues).toEqual({bar: 'bar'});
      });
    });

    describe("#onStateChange()", function () {
      var option;

      beforeEach(function () {
        multipleChoice = MultipleChoice.create();
        option = $ui.Option.create({
          ownValue: 'foo'
        });
        multipleChoice.addChildNode(option);
        multipleChoice.addToParentNode(RootWidget.create());
        multipleChoice.onAttach();
      });

      afterEach(function () {
        multipleChoice.removeFromParentNode();
      });

      it("should update inputValues", function () {
        option.select();
        expect(multipleChoice.inputValues).toEqual({foo: 'foo'});
      });
    });
  });
});
