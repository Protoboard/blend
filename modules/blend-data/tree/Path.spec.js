"use strict";

var $data = window['blend-data'];

describe("$assert", function () {
  var path;

  beforeEach(function () {
    path = $data.Path.create({components: ['foo', 'bar']});
    spyOn($assert, 'assert').and.callThrough();
  });

  describe("isPath()", function () {
    it("should pass message to assert", function () {
      $assert.isPath(path, "bar");
      expect($assert.assert).toHaveBeenCalledWith(true, "bar");
    });

    describe("when passing non-path", function () {
      it("should throw", function () {
        expect(function () {
          $assert.isPath({});
        }).toThrow();
      });
    });
  });

  describe("isPathOptional()", function () {
    it("should pass message to assert", function () {
      $assert.isPathOptional(path, "bar");
      expect($assert.assert).toHaveBeenCalledWith(true, "bar");
    });

    describe("when passing non-path", function () {
      it("should throw", function () {
        expect(function () {
          $assert.isPathOptional({});
        }).toThrow();
      });
    });
  });
});

describe("$data", function () {
  describe("Path", function () {
    var Path,
        path,
        result;

    beforeAll(function () {
      Path = $oop.getClass('test.$data.Path.Path')
      .blend($data.Path);
    });

    beforeEach(function () {
      path = Path.create({components: ['foo', 'bar', 'baz']});
    });

    describe("fromComponentsToString()", function () {
      it("should convert array to path string", function () {
        expect($data.Path.fromComponentsToString(['foo', 'bar', 'baz']))
        .toBe('foo.bar.baz');
      });

      it("should escape special characters in path components", function () {
        expect($data.Path.fromComponentsToString(['fo.o', 'b.ar', 'b.a.z']))
        .toBe('fo\\.o.b\\.ar.b\\.a\\.z');
      });
    });

    describe("create()", function () {
      it("should set components property", function () {
        expect(path.components).toEqual(['foo', 'bar', 'baz']);
      });

      describe("on invalid arguments", function () {
        it("should throw", function () {
          expect(function () {
            Path.create();
          }).toThrow();
          expect(function () {
            Path.create({components: 'foo'});
          }).toThrow();
        });
      });
    });

    describe("fromComponents()", function () {
      var path,
          components;

      beforeEach(function () {
        path = {};
        components = ['foo', 'bar', 'baz'];
        spyOn(Path, 'create').and.returnValue(path);
        result = Path.fromComponents(components);
      });

      it("should pass components to create()", function () {
        expect(Path.create).toHaveBeenCalledWith({components: components});
      });

      it("should return a created instance", function () {
        expect(result).toBe(path);
      });
    });

    describe("fromString()", function () {
      var string = 'foo\\.bar.baz\\\\quux';

      beforeEach(function () {
        result = $data.Path.fromString(string);
      });

      it("should return a Path instance", function () {
        expect($data.Path.mixedBy(result)).toBeTruthy();
      });

      it("should set components property with unescaped components", function () {
        expect(result.components).toEqual([
          'foo.bar',
          'baz\\quux'
        ]);
      });
    });

    describe("clone()", function () {
      beforeEach(function () {
        result = path.clone();
      });

      it("should return Path instance", function () {
        expect(Path.mixedBy(result)).toBeTruthy();
      });

      it("should initialize components on clone", function () {
        expect(result.components).toEqual(path.components);
        expect(result.components).not.toBe(path.components);
      });
    });

    describe("equals()", function () {
      var path2;

      describe("for equivalent Path", function () {
        it("should return true", function () {
          path2 = Path.create({components: ['foo', 'bar', 'baz']});
          expect(path.equals(path2)).toBeTruthy();
        });
      });

      describe("for non-equivalent Path", function () {
        it("should return false", function () {
          path2 = Path.create({components: ['baz', 'bar', 'foo']});
          expect(path.equals(path2)).toBeFalsy();
        });
      });

      describe("for undefined Path", function () {
        it("should return false", function () {
          expect(path.equals(undefined)).toBeFalsy();
        });
      });
    });

    describe("lessThan()", function () {
      var path2;

      describe("for containing Path", function () {
        it("should return true", function () {
          path2 = Path.create({components: ['foo', 'bar', 'baz', 'quux']});
          expect(path.lessThan(path2)).toBeTruthy();
        });
      });

      describe("for non-containing Path", function () {
        it("should return true", function () {
          path2 = Path.create({components: ['baz', 'quux']});
          expect(path.lessThan(path2)).toBeFalsy();
        });
      });
    });

    describe("greaterThan()", function () {
      var path2;

      describe("for contained Path", function () {
        it("should return true", function () {
          path2 = Path.create({components: ['foo', 'bar']});
          expect(path.greaterThan(path2)).toBeTruthy();
        });
      });

      describe("for non-contained Path", function () {
        it("should return true", function () {
          path2 = Path.create({components: ['baz', 'quux']});
          expect(path.greaterThan(path2)).toBeFalsy();
        });
      });
    });

    describe("push()", function () {
      beforeEach(function () {
        result = path.push('quux');
      });

      it("should return self", function () {
        expect(result).toBe(path);
      });

      it("should append component to components", function () {
        expect(path.components).toEqual(['foo', 'bar', 'baz', 'quux']);
      });
    });

    describe("pop()", function () {
      beforeEach(function () {
        result = path.pop();
      });

      it("should remove last component from components", function () {
        expect(path.components).toEqual(['foo', 'bar']);
      });

      it("should return removed component", function () {
        expect(result).toBe('baz');
      });
    });

    describe("unshift()", function () {
      beforeEach(function () {
        result = path.unshift('quux');
      });

      it("should return self", function () {
        expect(result).toBe(path);
      });

      it("should prepend component to components", function () {
        expect(path.components).toEqual(['quux', 'foo', 'bar', 'baz']);
      });
    });

    describe("shift()", function () {
      beforeEach(function () {
        result = path.shift();
      });

      it("should remove first component from components", function () {
        expect(path.components).toEqual(['bar', 'baz']);
      });

      it("should return removed component", function () {
        expect(result).toBe('foo');
      });
    });

    describe("concat()", function () {
      var path2;

      beforeEach(function () {
        path2 = Path.create({components: ['quux']});
        result = path.concat(path2);
      });

      it("should return instance of correct class", function () {
        expect(result.mixes(Path)).toBeTruthy();
      });

      it("should concatenate components", function () {
        expect(result.components).toEqual([
          'foo', 'bar', 'baz', 'quux'
        ]);
      });

      it("should not alter operands", function () {
        expect(path.components).toEqual([
          'foo', 'bar', 'baz'
        ]);
        expect(path2.components).toEqual(['quux']);
      });
    });

    describe("toString()", function () {
      beforeEach(function () {
        path = Path.create({components: ['foo.bar', 'baz\\quux']});
        result = path.toString();
      });

      it("should return string", function () {
        expect(typeof result).toBe('string');
      });

      it("should escape special characters", function () {
        expect(result).toBe("foo\\.bar.baz\\\\quux");
      });
    });
  });
});

describe("String", function () {
  var result;

  describe("toPath()", function () {
    var string = 'foo\\.bar.baz\\\\quux';

    beforeEach(function () {
      result = string.toPath();
    });

    it("should return a Path instance", function () {
      expect($data.Path.mixedBy(result)).toBeTruthy();
    });

    it("should set components property with unescaped components", function () {
      expect(result.components).toEqual([
        'foo.bar',
        'baz\\quux'
      ]);
    });
  });
});

describe("Array", function () {
  var result;

  describe("toPath()", function () {
    var array = [1, 2, 3];

    beforeEach(function () {
      result = array.toPath();
    });

    it("should return a Path instance", function () {
      expect($data.Path.mixedBy(result)).toBeTruthy();
    });

    it("should set components property", function () {
      expect(result.components).toBe(array);
    });
  });
});
