"use strict";

var $oop = window['giant-oop'],
  $utils = window['giant-utils'];

describe("$utils", function () {
  describe("Identifiable", function () {
    var Identifiable;

    beforeEach(function () {
      $utils.Identifiable._lastInstanceId = -1;
      Identifiable = $oop.getClass('test.$utils.Identifiable.Identifiable')
        .extend($utils.Identifiable);
    });

    describe("create()", function () {
      var instance;

      beforeEach(function () {
        instance = Identifiable.create();
      });

      it("should set instanceId", function () {
        expect(instance.instanceId).toBe(0);
      });

      it("should increment _lastInstanceId", function () {
        expect($utils.Identifiable._lastInstanceId).toBe(0);
      });
    });
  });
});