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

    beforeEach(function () {
      Module.__instanceLookup = {};
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

      it("should pass additional properties to create", function () {
        module = Module.fromModuleId('foo', {bar: 'baz'});
        expect(module.bar).toBe('baz');
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
      var modulesData;

      beforeEach(function () {
        modulesData = $module.modules.data;
        $module.modules.data = {};
        module = Module.create({moduleId: 'foo'});
      });

      afterEach(function () {
        $module.modules.data = modulesData;
      });

      it("should return self", function () {
        var result = module.markAsAvailable();
        expect(result).toBe(module);
      });

      it("should store module in container", function () {
        module.markAsAvailable();
        expect($module.modules.data).toEqual({
          foo: {}
        });
      });
    });

    describe("isAvailable()", function () {
      var modulesData;

      beforeEach(function () {
        modulesData = $module.modules.data;
        $module.modules.data = {};
        module = Module.create({moduleId: 'foo'});
      });

      afterEach(function () {
        $module.modules.data = modulesData;
      });

      describe("when module is present", function () {
        beforeEach(function () {
          module.markAsAvailable();
        });

        it("should return truthy", function () {
          expect(module.isAvailable()).toBeTruthy();
        });
      });

      describe("when module is absent", function () {
        it("should return falsy", function () {
          expect(module.isAvailable()).toBeFalsy();
        });
      });
    });
  });
});

describe("String", function () {
  describe("toModule()", function () {
    var module;

    it("should create a Module instance", function () {
      module = 'foo'.toModule();
      expect($module.Module.mixedBy(module)).toBeTruthy();
    });

    it("should set moduleId property", function () {
      module = 'foo'.toModule();
      expect(module.moduleId).toBe('foo');
    });
  });
});
