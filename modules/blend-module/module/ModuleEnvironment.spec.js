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
      ModuleEnvironment.__instanceLookup = {};
    });

    it("should be singleton", function () {
      expect(ModuleEnvironment.create()).toBe(ModuleEnvironment.create());
    });

    describe("create()", function () {
      it("should initialize moduleEnvironmentKey", function () {
        moduleEnvironment = ModuleEnvironment.create();
        expect(moduleEnvironment.moduleEnvironmentKey)
        .toEqual('_moduleEnvironment/'.toDocumentKey());
      });

      it("should initialize listeningPath", function () {
        moduleEnvironment = ModuleEnvironment.create();
        expect(moduleEnvironment.listeningPath).toBe('module');
      });
    });

    describe("markModuleAsAvailable()", function () {
      beforeEach(function () {
        moduleEnvironment = ModuleEnvironment.create();
        spyOn($module.ModuleEnvironmentDocument, 'addToAvailableModules');
      });

      it("should add to ModuleEnvironmentDocument", function () {
        moduleEnvironment.markModuleAsAvailable('foo'.toModule());
        expect($module.ModuleEnvironmentDocument.addToAvailableModules)
        .toHaveBeenCalledWith('foo');
      });
    });

    describe("markModuleAsUnavailable()", function () {
      beforeEach(function () {
        moduleEnvironment = ModuleEnvironment.create();
        spyOn($module.ModuleEnvironmentDocument, 'removeFromAvailableModules');
      });

      it("should add to ModuleEnvironmentDocument", function () {
        moduleEnvironment.markModuleAsUnavailable('foo'.toModule());
        expect($module.ModuleEnvironmentDocument.removeFromAvailableModules)
        .toHaveBeenCalledWith('foo');
      });
    });

    describe("isModuleAvailable()", function () {
      var result;

      beforeEach(function () {
        moduleEnvironment = ModuleEnvironment.create();
        result = {};
        spyOn($module.ModuleEnvironmentDocument, 'isInAvailableModules').and
        .returnValue(result);
      });

      it("should invoke ModuleEnvironmentDocument#isInAvailableModules", function () {
        moduleEnvironment.isModuleAvailable('foo'.toModule());
        expect($module.ModuleEnvironmentDocument.isInAvailableModules)
        .toHaveBeenCalledWith('foo');
      });

      it("should return isInAvailableModules result", function () {
        expect(moduleEnvironment.isModuleAvailable('foo'.toModule()))
        .toBe(result);
      });
    });
  });
});
