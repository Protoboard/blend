"use strict";

var $oop = window['blend-oop'],
    $module = window['blend-module'];

describe("$module", function () {
  describe("Module", function () {
    var Module,
        module;

    beforeAll(function () {
      Module = $oop.getClass('test.$module.Module.Module')
      .blend($module.Module);
      Module.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("fromModuleId()", function () {
      it("should return Module instance", function () {
        module = Module.fromModuleId('foo');
        expect(Module.mixedBy(module)).toBeTruthy();
      });

      it("should set moduleId", function () {
        module = Module.fromModuleId('foo');
        expect(module.moduleId).toBe('foo');
      });
    });

    describe("create()", function () {
      describe("on missing moduleId", function () {
        it("should throw", function () {
          expect(function () {
            Module.create();
          }).toThrow();
        });
      });

      it("should cache by moduleId", function () {
        expect(Module.create({moduleId: 'bar'}))
        .toBe(Module.create({moduleId: 'bar'}));
        expect(Module.create({moduleId: 'bar'}))
        .not.toBe(Module.create({moduleId: 'baz'}));
      });

      it("should set listeningPath", function () {
        module = Module.create({moduleId: 'foo'});
        expect(module.listeningPath).toBe('module.foo');
      });

      it("should add triggerPaths", function () {
        module = Module.create({moduleId: 'foo'});
        expect(module.triggerPaths.list).toContain('module.foo', 'module');
      });
    });

    describe("markAsAvailable()", function () {
      beforeEach(function () {
        module = Module.create({moduleId: 'foo'});
        spyOn($module.ModuleEnvironment, 'markModuleAsAvailable');
      });

      it("should return self", function () {
        var result = module.markAsAvailable();
        expect(result).toBe(module);
      });

      it("should invoke ModuleEnvironment#markModuleAsAvailable", function () {
        module.markAsAvailable();
        expect($module.ModuleEnvironment.markModuleAsAvailable)
        .toHaveBeenCalledWith(module);
      });
    });

    describe("markAsUnavailable()", function () {
      beforeEach(function () {
        module = Module.create({moduleId: 'foo'});
        spyOn($module.ModuleEnvironment, 'markModuleAsUnavailable');
      });

      it("should return self", function () {
        var result = module.markAsUnavailable();
        expect(result).toBe(module);
      });

      it("should invoke ModuleEnvironment#markModuleAsUnavailable", function () {
        module.markAsUnavailable();
        expect($module.ModuleEnvironment.markModuleAsUnavailable)
        .toHaveBeenCalledWith(module);
      });
    });

    describe("isAvailable()", function () {
      var result;

      beforeEach(function () {
        module = Module.create({moduleId: 'foo'});
        result = {};
        spyOn($module.ModuleEnvironment, 'isModuleAvailable').and
        .returnValue(result);
      });

      it("should return self", function () {
        var result = module.markAsUnavailable();
        expect(result).toBe(module);
      });

      it("should invoke ModuleEnvironment#isModuleAvailable", function () {
        expect(module.isAvailable()).toBe(result);
        expect($module.ModuleEnvironment.isModuleAvailable)
        .toHaveBeenCalledWith(module);
      });
    });

    describe("onAvailableModulesChange()", function () {
      var moduleEnvironmentNode;

      beforeEach(function () {
        moduleEnvironmentNode = '_moduleEnvironment/'.toDocument().getNode();
        '_moduleEnvironment/'.toDocument().setNode({
          availableModules: {
            foo: 1,
            bar: 1
          }
        });
        spyOn($module.Module, 'trigger');
      });

      afterEach(function () {
        '_moduleEnvironment/'.toDocument().setNode(moduleEnvironmentNode);
      });

      it("should trigger appropriate events", function () {
        '_moduleEnvironment//availableModules'.toField().setNode({
          baz: 1,
          quux: 1
        });
        var calls = $module.Module.trigger.calls.all();
        expect(calls.length).toBe(4);
        expect(calls[0].object).toEqual('foo'.toModule());
        expect(calls[0].args).toEqual(['module.unavailable']);
        expect(calls[1].object).toEqual('bar'.toModule());
        expect(calls[1].args).toEqual(['module.unavailable']);
        expect(calls[2].object).toEqual('baz'.toModule());
        expect(calls[2].args).toEqual(['module.available']);
        expect(calls[3].object).toEqual('quux'.toModule());
        expect(calls[3].args).toEqual(['module.available']);
      });
    });
  });
});
