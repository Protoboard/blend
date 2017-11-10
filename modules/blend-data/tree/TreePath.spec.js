"use strict";

var $data = window['blend-data'];

describe("$data", function () {
  describe("TreePath", function () {
    var TreePath,
        treePath,
        result;

    beforeAll(function () {
      TreePath = $oop.getClass('test.$data.TreePath.TreePath')
      .blend($data.TreePath);
    });

    beforeEach(function () {
      treePath = TreePath.create({components: ['foo', 'bar', 'baz']});
    });

    describe("fromComponentsToString()", function () {
      it("should convert array to path string", function () {
        expect($data.TreePath.fromComponentsToString(['foo', 'bar', 'baz']))
        .toBe('foo.bar.baz');
      });

      it("should escape special characters in path components", function () {
        expect($data.TreePath.fromComponentsToString(['fo.o', 'b.ar', 'b.a.z']))
        .toBe('fo\\.o.b\\.ar.b\\.a\\.z');
      });
    });

    describe("fromString()", function () {
      var string = 'foo\\.bar.baz\\\\quux';

      beforeEach(function () {
        result = $data.TreePath.fromString(string);
      });

      it("should return a TreePath instance", function () {
        expect($data.TreePath.mixedBy(result)).toBeTruthy();
      });

      it("should set components property with unescaped components", function () {
        expect(result.components).toEqual([
          'foo.bar',
          'baz\\quux'
        ]);
      });
    });

    describe("lessThan()", function () {
      var path2;

      describe("for containing TreePath", function () {
        it("should return true", function () {
          path2 = TreePath.create({components: ['foo', 'bar', 'baz', 'quux']});
          expect(treePath.lessThan(path2)).toBeTruthy();
        });
      });

      describe("for non-containing TreePath", function () {
        it("should return true", function () {
          path2 = TreePath.create({components: ['baz', 'quux']});
          expect(treePath.lessThan(path2)).toBeFalsy();
        });
      });
    });

    describe("greaterThan()", function () {
      var path2;

      describe("for contained TreePath", function () {
        it("should return true", function () {
          path2 = TreePath.create({components: ['foo', 'bar']});
          expect(treePath.greaterThan(path2)).toBeTruthy();
        });
      });

      describe("for non-contained TreePath", function () {
        it("should return true", function () {
          path2 = TreePath.create({components: ['baz', 'quux']});
          expect(treePath.greaterThan(path2)).toBeFalsy();
        });
      });
    });

    describe("push()", function () {
      beforeEach(function () {
        result = treePath.push('quux');
      });

      it("should return self", function () {
        expect(result).toBe(treePath);
      });

      it("should append component to components", function () {
        expect(treePath.components).toEqual(['foo', 'bar', 'baz', 'quux']);
      });
    });

    describe("pop()", function () {
      beforeEach(function () {
        result = treePath.pop();
      });

      it("should remove last component from components", function () {
        expect(treePath.components).toEqual(['foo', 'bar']);
      });

      it("should return removed component", function () {
        expect(result).toBe('baz');
      });
    });

    describe("unshift()", function () {
      beforeEach(function () {
        result = treePath.unshift('quux');
      });

      it("should return self", function () {
        expect(result).toBe(treePath);
      });

      it("should prepend component to components", function () {
        expect(treePath.components).toEqual(['quux', 'foo', 'bar', 'baz']);
      });
    });

    describe("shift()", function () {
      beforeEach(function () {
        result = treePath.shift();
      });

      it("should remove first component from components", function () {
        expect(treePath.components).toEqual(['bar', 'baz']);
      });

      it("should return removed component", function () {
        expect(result).toBe('foo');
      });
    });

    describe("concat()", function () {
      var path2;

      beforeEach(function () {
        path2 = TreePath.create({components: ['quux']});
        result = treePath.concat(path2);
      });

      it("should return instance of correct class", function () {
        expect(result.mixes(TreePath)).toBeTruthy();
      });

      it("should concatenate components", function () {
        expect(result.components).toEqual([
          'foo', 'bar', 'baz', 'quux'
        ]);
      });

      it("should not alter operands", function () {
        expect(treePath.components).toEqual([
          'foo', 'bar', 'baz'
        ]);
        expect(path2.components).toEqual(['quux']);
      });
    });

    describe("toString()", function () {
      beforeEach(function () {
        treePath = TreePath.create({components: ['foo.bar', 'baz\\quux']});
        result = treePath.toString();
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
      result = string.toTreePath();
    });

    it("should return a Path instance", function () {
      expect($data.TreePath.mixedBy(result)).toBeTruthy();
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
      result = array.toTreePath();
    });

    it("should return a Path instance", function () {
      expect($data.TreePath.mixedBy(result)).toBeTruthy();
    });

    it("should set components property", function () {
      expect(result.components).toBe(array);
    });
  });
});
