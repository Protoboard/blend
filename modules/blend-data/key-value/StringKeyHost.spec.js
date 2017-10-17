"use strict";

var $assert = window['blend-assert'],
    $oop = window['blend-oop'],
    $data = window['blend-data'];

describe("$data", function () {
  var result;

  describe("StringKeyHost", function () {
    var StringKeyHost,
        stringKeyHost;

    beforeAll(function () {
      StringKeyHost = $oop.getClass('test.$data.StringKeyHost.StringKeyHost')
      .blend($data.DataContainer)
      .blend($data.KeyValueContainer)
      .mix($data.StringKeyHost);
    });

    beforeEach(function () {
      stringKeyHost = StringKeyHost.create();
    });

    describe("joinTo()", function () {
      var StringValueHost,
          leftContainer,
          joinedContainer;

      beforeAll(function () {
        StringValueHost = $oop.getClass('test.$data.StringKeyHost.StringValueHost')
        .blend($data.DataContainer)
        .blend($data.KeyValueContainer)
        .mix($data.StringValueHost);
      });

      beforeEach(function () {
        leftContainer = StringValueHost.create({data: {}});

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
