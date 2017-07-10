"use strict";

var $assert = window['cake-assert'],
    $oop = window['cake-oop'],
    $data = window['cake-data'];

describe("$data", function () {
  var result;

  describe("StringKeyHost", function () {
    var StringKeyHost,
        stringKeyHost;

    beforeEach(function () {
      StringKeyHost = $oop.getClass('test.$data.StringKeyHost.StringKeyHost')
      .mix($data.DataContainer)
      .mix($data.KeyValueContainer)
      .mixOnly($data.StringKeyHost);

      stringKeyHost = StringKeyHost.create();
    });

    describe("joinTo()", function () {
      var StringValueHost,
          leftContainer,
          joinedContainer;

      beforeEach(function () {
        StringValueHost = $oop.getClass('test.$data.StringKeyHost.StringValueHost')
        .mix($data.DataContainer)
        .mix($data.KeyValueContainer)
        .mixOnly($data.StringValueHost);

        leftContainer = StringValueHost.create({});

        joinedContainer = {};

        spyOn(leftContainer, 'join').and.returnValue(joinedContainer);

        result = stringKeyHost.joinTo(leftContainer);
      });

      it("should join containers", function () {
        expect(leftContainer.join).toHaveBeenCalledWith(stringKeyHost);
        expect(result).toBe(joinedContainer);
      });
    });
  });
});
