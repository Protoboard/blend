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
      StringKeyHost = $oop.createClass('test.$data.StringKeyHost.StringKeyHost')
      .blend($data.DataContainer)
      .blend($data.KeyValueContainer)
      .mix($data.StringKeyHost)
      .build();
    });

    beforeEach(function () {
      stringKeyHost = StringKeyHost.create();
    });

    describe("#joinTo()", function () {
      var StringValueHost,
          leftContainer,
          joinedContainer;

      beforeAll(function () {
        StringValueHost = $oop.createClass('test.$data.StringKeyHost.StringValueHost')
        .blend($data.DataContainer)
        .blend($data.KeyValueContainer)
        .mix($data.StringValueHost)
        .build();
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
