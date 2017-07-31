"use strict";

var $oop = window['cake-oop'],
    $utils = window['cake-utils'];

describe("$utils", function () {
  describe("Identifiable", function () {
    var Identifiable;

    beforeEach(function () {
      $utils.Identifiable.lastInstanceId = -1;
      Identifiable = $oop.getClass('test.$utils.Identifiable.Identifiable')
      .mix($utils.Identifiable);
    });

    describe("create()", function () {
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