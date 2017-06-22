"use strict";

var $data = window['giant-data'];

describe("$assert", function () {
    var path;

    beforeEach(function () {
        path = $data.Path.create(['foo', 'bar']);
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

        beforeEach(function () {
            Path = $oop.getClass('test.$data.Path.Path')
                .extend($data.Path);

            path = Path.create(['foo', 'bar', 'baz']);
        });

        describe("create()", function () {
            it("should set _components property", function () {
                expect(path._components).toEqual(['foo', 'bar', 'baz']);
            });

            describe("on invalid arguments", function () {
                it("should throw", function () {
                    expect(function () {
                        Path.create();
                    }).toThrow();
                    expect(function () {
                        Path.create('foo');
                    }).toThrow();
                });
            });
        });

        describe("clone()", function () {
            beforeEach(function () {
                result = path.clone();
            });

            it("should return Path instance", function () {
                expect(Path.isIncludedBy(result)).toBeTruthy();
            });

            it("should initialize _components on clone", function () {
                expect(result._components).toEqual(path._components);
                expect(result._components).not.toBe(path._components);
            });
        });

        describe("equals()", function () {
            var path2;

            describe("for equivalent Path", function () {
                it("should return true", function () {
                    path2 = Path.create(['foo', 'bar', 'baz']);
                    expect(path.equals(path2)).toBeTruthy();
                });
            });

            describe("for non-equivalent Path", function () {
                it("should return false", function () {
                    path2 = Path.create(['baz', 'bar', 'foo']);
                    expect(path.equals(path2)).toBeFalsy();
                });
            });
        });

        describe("lessThan()", function () {
            var path2;

            describe("for containing Path", function () {
                it("should return true", function () {
                    path2 = Path.create(['foo', 'bar', 'baz', 'quux']);
                    expect(path.lessThan(path2)).toBeTruthy();
                });
            });

            describe("for non-containing Path", function () {
                it("should return true", function () {
                    path2 = Path.create(['baz', 'quux']);
                    expect(path.lessThan(path2)).toBeFalsy();
                });
            });
        });

        describe("greaterThan()", function () {
            var path2;

            describe("for contained Path", function () {
                it("should return true", function () {
                    path2 = Path.create(['foo', 'bar']);
                    expect(path.greaterThan(path2)).toBeTruthy();
                });
            });

            describe("for non-contained Path", function () {
                it("should return true", function () {
                    path2 = Path.create(['baz', 'quux']);
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

            it("should append component to _components", function () {
                expect(path._components).toEqual(['foo', 'bar', 'baz', 'quux']);
            });
        });

        describe("pop()", function () {
            beforeEach(function () {
                result = path.pop();
            });

            it("should remove last component from _components", function () {
                expect(path._components).toEqual(['foo', 'bar']);
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

            it("should prepend component to _components", function () {
                expect(path._components).toEqual(['quux', 'foo', 'bar', 'baz']);
            });
        });

        describe("shift()", function () {
            beforeEach(function () {
                result = path.shift();
            });

            it("should remove first component from _components", function () {
                expect(path._components).toEqual(['bar', 'baz']);
            });

            it("should return removed component", function () {
                expect(result).toBe('foo');
            });
        });

        describe("concat()", function () {
            var path2;

            beforeEach(function () {
                path2 = Path.create(['quux']);
                result = path.concat(path2);
            });

            it("should return instance of correct class", function () {
                expect(result.includes(Path)).toBeTruthy();
            });

            it("should concatenate components", function () {
                expect(result._components).toEqual([
                    'foo', 'bar', 'baz', 'quux'
                ]);
            });

            it("should not alter operands", function () {
                expect(path._components).toEqual([
                    'foo', 'bar', 'baz'
                ]);
                expect(path2._components).toEqual(['quux']);
            });
        });

        describe("toString()", function () {
            beforeEach(function () {
                path = Path.create(['foo.bar', 'baz\\quux']);
                result = path.toString();
            });

            it("should return string", function () {
                expect(typeof result).toBe('string');
            });

            it("should escape special characters", function () {
                expect(result).toBe("foo\\.bar.baz\\\\quux");
            });
        });

        describe("fromString()", function () {
            var string = 'foo\\.bar.baz\\\\quux';

            beforeEach(function () {
                result = $data.Path.fromString(string);
            });

            it("should return a Path instance", function () {
                expect($data.Path.isIncludedBy(result)).toBeTruthy();
            });

            it("should set _components property with unescaped components", function () {
                expect(result._components).toEqual([
                    'foo.bar',
                    'baz\\quux'
                ]);
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
            expect($data.Path.isIncludedBy(result)).toBeTruthy();
        });

        it("should set _components property with unescaped components", function () {
            expect(result._components).toEqual([
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
            expect($data.Path.isIncludedBy(result)).toBeTruthy();
        });

        it("should set _components property", function () {
            expect(result._components).toBe(array);
        });
    });
});
