"use strict";

var $oop = window['blend-oop'],
    $module = window['blend-module'];

describe("$module", function () {
  describe("ModuleEnvironment", function () {
    var ModuleEnvironment,
        moduleEnvironment;

    beforeAll(function () {
      ModuleEnvironment = $oop.createClass('test.$module.ModuleEnvironment.ModuleEnvironment')
      .blend($module.ModuleEnvironment)
      .build();
      ModuleEnvironment.__builder.forwards = {list: [], lookup: {}};
    });

    beforeEach(function () {
      ModuleEnvironment.__builder.instances = {};
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
