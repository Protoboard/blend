"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("SingleSelect", function () {
    var SingleSelect,
        singleSelect;

    beforeAll(function () {
      SingleSelect = $oop.getClass('test.$ui.SingleSelect.SingleSelect')
      .blend($widget.Widget)
      .blend($ui.Inputable)
      .blend($ui.SingleSelect);
      SingleSelect.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("addChildNode()", function () {
      var option;

      beforeEach(function () {
        singleSelect = SingleSelect.create();
        option = $ui.Option.create({
          ownValue: 'foo'
        });
      });

      it("should return self", function () {
        var result = singleSelect.addChildNode(option);
        expect(result).toBe(singleSelect);
      });

      describe("when node's ownValue matches inputValue", function () {
        beforeEach(function () {
          singleSelect.setInputValue('foo');
        });

        it("should select node", function () {
          singleSelect.addChildNode(option);
          expect(option.isSelected()).toBeTruthy();
        });

        describe("when ownValue and inputValue are both undefined", function () {
          beforeEach(function () {
            option.setOwnValue(undefined);
          });

          it("should not select node", function () {
            singleSelect.addChildNode(option);
            expect(option.isSelected()).toBeFalsy();
          });
        });
      });
    });

    describe("removeChildNode()", function () {
      var option;

      beforeEach(function () {
        singleSelect = SingleSelect.create();
        option = $ui.Option.create({
          nodeName: 'foo',
          ownValue: 'bar'
        });
        singleSelect.addChildNode(option);
      });

      it("should return self", function () {
        var result = singleSelect.removeChildNode(option);
        expect(result).toBe(singleSelect);
      });

      describe("when node is selected", function () {
        beforeEach(function () {
          option.select();
        });

        it("should deselect node", function () {
          singleSelect.removeChildNode('foo');
          expect(option.isSelected()).toBeFalsy();
        });
      });
    });

    describe("setInputValue()", function () {
      var option1,
          option2;

      beforeEach(function () {
        singleSelect = SingleSelect.create();
        option1 = $ui.Option.create({
          ownValue: 'foo'
        });
        option2 = $ui.Option.create({
          ownValue: 'bar'
        });
        singleSelect.addChildNode(option1);
        singleSelect.addChildNode(option2);
      });

      it("should return self", function () {
        var result = singleSelect.setInputValue('bar');
        expect(result).toBe(singleSelect);
      });

      describe("when input value matches option ownValue", function () {
        it("should select matching option", function () {
          singleSelect.setInputValue('foo');
          expect(option1.isSelected()).toBeTruthy();
        });
      });

      describe("when a different option was selected before", function () {
        beforeEach(function () {
          singleSelect.addToParentNode($widget.RootWidget.create());
          singleSelect.onAttach();
          option2.select();
        });

        afterEach(function () {
          singleSelect.removeFromParentNode();
        });

        it("should deselect previously active option", function () {
          singleSelect.setInputValue('foo');
          expect(option2.isSelected()).toBeFalsy();
        });
      });
    });

    describe("onAttach()", function () {
      var option1,
          option2;

      beforeEach(function () {
        singleSelect = SingleSelect.create({
          inputValue: 'bar'
        });
        option1 = $ui.Option.create({
          ownValue: 'foo'
        });
        option2 = $ui.Option.create({
          ownValue: 'bar'
        });
        singleSelect.addChildNode(option1);
        singleSelect.addChildNode(option2);
      });

      it("should sync selectables' selected states", function () {
        singleSelect.onAttach();
        expect(option2.isSelected).toBeTruthy();
      });
    });

    describe("onSelectableOwnValueChange()", function () {
      var option;

      beforeEach(function () {
        singleSelect = SingleSelect.create({
          inputValue: 'foo'
        });
        option = $ui.Option.create({
          ownValue: 'foo'
        });
        singleSelect.addChildNode(option);
        singleSelect.addToParentNode($widget.RootWidget.create());
        singleSelect.onAttach();
      });

      afterEach(function () {
        singleSelect.removeFromParentNode();
      });

      it("should update inputValue", function () {
        option.setOwnValue('bar');
        expect(singleSelect.inputValue).toBe('bar');
      });
    });

    describe("onStateChange()", function () {
      var option;

      beforeEach(function () {
        singleSelect = SingleSelect.create();
        option = $ui.Option.create({
          ownValue: 'foo'
        });
        singleSelect.addChildNode(option);
        singleSelect.addToParentNode($widget.RootWidget.create());
        singleSelect.onAttach();
      });

      afterEach(function () {
        singleSelect.removeFromParentNode();
      });

      it("should update inputValue", function () {
        option.select();
        expect(singleSelect.inputValue).toBe('foo');
      });
    });
  });
});
