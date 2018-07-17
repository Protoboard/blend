"use strict";

var $oop = window['blend-oop'],
    $ui = window['blend-ui'];

describe("$ui", function () {
  describe("DisabledAttributeHost", function () {
    var DisabledAttributeHost,
        disabledAttributeHost;

    beforeAll(function () {
      DisabledAttributeHost = $oop.createClass('test.$ui.DisabledAttributeHost.DisabledAttributeHost')
      .blend($ui.Button)
      .blend($ui.DisabledAttributeHost)
      .build();
      DisabledAttributeHost.__builder.forwards = {list: [], lookup: {}};
    });

    describe(".create()", function () {
      it("should initialize 'disabled' attribute", function () {
        disabledAttributeHost = DisabledAttributeHost.create({
          state: {
            disabled: true
          }
        });
        expect(disabledAttributeHost.getAttribute('disabled')).toBe('disabled');
      });
    });

    describe("#setStateValue()", function () {
      beforeEach(function () {
        disabledAttributeHost = DisabledAttributeHost.create();
      });

      it("should return self", function () {
        var result = disabledAttributeHost.setStateValue('disabled', true);
        expect(result).toBe(disabledAttributeHost);
      });

      describe("when setting disabled state to true", function () {
        it("should add 'disabled' attribute", function () {
          disabledAttributeHost.setStateValue('disabled', true);
          expect(disabledAttributeHost.getAttribute('disabled'))
          .toBe('disabled');
        });
      });

      describe("when setting disabled state to false", function () {
        it("should remove 'disabled' attribute", function () {
          disabledAttributeHost.setStateValue('disabled', false);
          expect(disabledAttributeHost.getAttribute('disabled'))
          .toBeUndefined();
        });
      });
    });
  });
});
