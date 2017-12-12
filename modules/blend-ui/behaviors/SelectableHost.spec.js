"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("SelectableHost", function () {
    var SelectableHost,
        Selectable,
        selectableHost;

    beforeAll(function () {
      SelectableHost = $oop.createClass('test.$ui.SelectableHost.SelectableHost')
      .blend($widget.Widget)
      .blend($ui.InputValueHost)
      .blend($ui.SelectableHost)
      .build();
      SelectableHost.__builder.forwards = {list: [], lookup: {}};

      Selectable = $oop.createClass('test.$ui.SelectableHost.Selectable')
      .blend($widget.Widget)
      .blend($ui.Selectable)
      .build();
    });

    describe("create()", function () {
      it("should initialize selectablesByOwnValue", function () {
        selectableHost = SelectableHost.create();
        expect(selectableHost.selectablesByOwnValue).toEqual({});
      });
    });

    describe("addChildNode()", function () {
      var selectableA,
          selectableB;

      beforeEach(function () {
        selectableHost = SelectableHost.create();
        selectableA = Selectable.create({
          nodeName: 'selectableA',
          ownValue: 'foo'
        });
      });

      it("should return self", function () {
        var result = selectableHost.addChildNode(selectableA);
        expect(result).toBe(selectableHost);
      });

      it("should add ownValue association", function () {
        selectableHost.addChildNode(selectableA);
        expect(selectableHost.selectablesByOwnValue).toEqual({
          foo: selectableA
        });
      });

      describe("when adding selectable w/ existing ownValue", function () {
        beforeEach(function () {
          selectableHost.addChildNode(selectableA);
          selectableB = Selectable.create({
            nodeName: 'selectableB',
            ownValue: 'foo'
          });
        });

        it("should replace ownValue association", function () {
          selectableHost.addChildNode(selectableB);
          expect(selectableHost.selectablesByOwnValue).toEqual({
            foo: selectableB
          });
        });
      });

      describe("when adding selectable w/ different ownValue", function () {
        beforeEach(function () {
          selectableHost.addChildNode(selectableA);
          selectableB = Selectable.create({
            nodeName: 'selectableB',
            ownValue: 'bar'
          });
        });

        it("should add new ownValue association", function () {
          selectableHost.addChildNode(selectableB);
          expect(selectableHost.selectablesByOwnValue).toEqual({
            foo: selectableA,
            bar: selectableB
          });
        });

        describe("when ownValue is undefined", function () {
          beforeEach(function () {
            selectableB.setOwnValue(undefined);
          });

          it("should not add new ownValue association", function () {
            selectableHost.addChildNode(selectableB);
            expect(selectableHost.selectablesByOwnValue).toEqual({
              foo: selectableA
            });
          });
        });
      });

      describe("when adding selectable w/ existing nodeName", function () {
        beforeEach(function () {
          selectableHost.addChildNode(selectableA);
          selectableB = Selectable.create({
            nodeName: 'selectableA',
            ownValue: 'bar'
          });
        });

        it("should remove old ownValue association", function () {
          selectableHost.addChildNode(selectableB);
          expect(selectableHost.selectablesByOwnValue).toEqual({
            bar: selectableB
          });
        });
      });
    });

    describe("removeChildNode()", function () {
      var selectable;

      beforeEach(function () {
        selectableHost = SelectableHost.create();
        selectable = Selectable.create({
          nodeName: 'selectable',
          ownValue: 'foo'
        });
        selectableHost.addChildNode(selectable);
      });

      it("should return self", function () {
        var result = selectableHost.removeChildNode('selectable');
        expect(result).toBe(selectableHost);
      });

      it("should remove ownValue association", function () {
        selectableHost.removeChildNode('selectable');
        expect(selectableHost.selectablesByOwnValue).toEqual({});
      });
    });

    describe("getSelectableByOwnValue()", function () {
      var selectable;

      beforeEach(function () {
        selectableHost = SelectableHost.create();
        selectable = Selectable.create({
          ownValue: 'foo'
        });
        selectableHost.addChildNode(selectable);
      });

      it("should return corresponding childNode", function () {
        var result = selectableHost.getSelectableByOwnValue('foo');
        expect(result).toBe(selectable);
      });
    });

    describe("onAttach()", function () {
      var selectable;

      beforeEach(function () {
        selectableHost = SelectableHost.create();
        selectable = Selectable.create();
        selectableHost.addChildNode(selectable);
        selectable.setOwnValue('foo');
      });

      it("should initialize selectablesByOwnValue", function () {
        selectableHost.onAttach();
        expect(selectableHost.selectablesByOwnValue).toEqual({
          foo: selectable
        });
      });
    });

    describe("onSelectableOwnValueChange()", function () {
      var selectable,
          rootWidget;

      beforeEach(function () {
        selectableHost = SelectableHost.create();
        selectable = Selectable.create({
          nodeName: 'selectable',
          ownValue: 'foo'
        });
        rootWidget = $widget.RootWidget.create();
        selectableHost.addChildNode(selectable);
        selectableHost.addToParentNode(rootWidget);
        selectableHost.onAttach();
      });

      afterEach(function () {
        selectableHost.removeFromParentNode();
      });

      it("should update ownValue association", function () {
        selectable.setOwnValue('bar');
        expect(selectableHost.selectablesByOwnValue).toEqual({
          bar: selectable
        });
      });
    });
  });
});
