"use strict";

var $oop = window['blend-oop'],
    $module = window['blend-module'];

describe("$module", function () {
  describe("ModuleEnvironment", function () {
    var ModuleEnvironment,
        moduleEnvironment;

    beforeAll(function () {
      ModuleEnvironment = $oop.getClass('test.$module.ModuleEnvironment.ModuleEnvironment')
      .blend($module.ModuleEnvironment);
      ModuleEnvironment.__forwards = {list: [], sources: [], lookup: {}};
    });

    beforeEach(function () {
      ModuleEnvironment.__instanceLookup = {};
    });

    it("should be singleton", function () {
      expect(ModuleEnvironment.create()).toBe(ModuleEnvironment.create());
    });

    describe("create()", function () {
      it("should initialize listeningPath", function () {
        moduleEnvironment = ModuleEnvironment.create();
        expect(moduleEnvironment.listeningPath).toBe('module');
      });
    });
  });
});
