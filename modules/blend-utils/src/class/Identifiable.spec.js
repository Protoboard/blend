"use strict";

var $oop = window['blend-oop'],
    $utils = window['blend-utils'];

describe("$utils", function () {
  describe("Identifiable", function () {
    var Identifiable;

    beforeAll(function () {
      Identifiable = $oop.createClass('test.$utils.Identifiable.Identifiable')
      .blend($utils.Identifiable)
      .build();
    });

    beforeEach(function () {
      $utils.Identifiable.lastInstanceId = -1;
    });

    describe(".create()", function () {
      var instance;

      beforeEach(function () {
        instance = Identifiable.create();
      });

      it("should set instanceId", function () {
        expect(instance.instanceId).toBe(0);
      });

      it("should increment lastInstanceId", function () {
        expect($utils.Identifiable.lastInstanceId).toBe(0);
      });
    });
  });
});