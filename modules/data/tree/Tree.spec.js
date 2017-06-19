"use strict";

var $data = window['giant-data'];

describe("$assert", function () {
    var tree;

    beforeEach(function () {
        tree = $data.Tree.create(['foo', 'bar']);
        spyOn($assert, 'assert').and.callThrough();
    });

    describe("isTree()", function () {
        it("should pass message to assert", function () {
            $assert.isTree(tree, "bar");
            expect($assert.assert).toHaveBeenCalledWith(true, "bar");
        });

        describe("when passing non-tree", function () {
            it("should throw", function () {
                expect(function () {
                    $assert.isTree("foo");
                }).toThrow();
            });
        });
    });

    describe("isTreeOptional()", function () {
        it("should pass message to assert", function () {
            $assert.isTreeOptional(tree, "bar");
            expect($assert.assert).toHaveBeenCalledWith(true, "bar");
        });

        describe("when passing non-tree", function () {
            it("should throw", function () {
                expect(function () {
                    $assert.isTreeOptional({});
                }).toThrow();
            });
        });
    });
});

describe("$data", function () {
    describe("Tree", function () {
        var Tree,
            tree,
            result;

        beforeEach(function () {
            Tree = $oop.getClass('test.$data.Tree.Tree')
                .extend($data.Tree);

            tree = Tree.create({
                foo: {
                    bar: [
                        'baz',
                        'quux'
                    ]
                },
                bar: {
                    hello: 'world'
                }
            });
        });

        describe("clone()", function () {
            beforeEach(function () {
                result = tree.clone();
            });

            it("should return Tree instance", function () {
                expect(Tree.isIncludedBy(result)).toBeTruthy();
            });

            it("should initialize _data on clone", function () {
                expect(result._data).toEqual(tree._data);
                expect(result._data).not.toBe(tree._data);
            });
        });

        describe("query()", function () {
            var callback;

            beforeEach(function () {
                // JSON taken from
                // https://www.sitepoint.com/facebook-json-example/
                tree = $data.Tree.create({
                    "data": [
                        {
                            "id": "X999_Y999",
                            "from": {
                                "name": "Tom Brady",
                                "id": "X12"
                            },
                            "message": "Looking forward to 2010!",
                            "actions": [
                                {
                                    "name": "Comment",
                                    "link": "http://www.facebook.com/X999/posts/Y999"
                                },
                                {
                                    "name": "Like",
                                    "link": "http://www.facebook.com/X999/posts/Y999"
                                }
                            ],
                            "type": "status",
                            "created_time": "2010-08-02T21:27:44+0000",
                            "updated_time": "2010-08-02T21:27:44+0000"
                        },
                        {
                            "id": "X998_Y998",
                            "from": {
                                "name": "Peyton Manning",
                                "id": "X18"
                            },
                            "message": "Where's my contract?",
                            "actions": [
                                {
                                    "name": "Comment",
                                    "link": "http://www.facebook.com/X998/posts/Y998"
                                },
                                {
                                    "name": "Like",
                                    "link": "http://www.facebook.com/X998/posts/Y998"
                                }
                            ],
                            "type": "status",
                            "created_time": "2010-08-02T21:27:44+0000",
                            "updated_time": "2010-08-02T21:27:44+0000"
                        }
                    ]
                });

                callback = jasmine.createSpy();
            });

            it("should return self", function () {
                result = tree.query('foo.*.bar'.toQuery(), callback);
                expect(result).toBe(tree);
            });

            describe("with single path", function () {
                it("should invoke single path only", function () {
                    tree.query('data.0.from.name'.toQuery(), callback);
                    expect(callback.calls.allArgs()).toEqual([
                        ['data.0.from.name'.toPath(), "Tom Brady"]
                    ]);
                });
            });

            describe("for no matching path", function () {
                it("should not invoke callback", function () {
                    tree.query('data.2.*.name'.toQuery(), callback);
                    expect(callback).not.toHaveBeenCalled();
                });
            });

            describe("with key wildcard", function () {
                it("should iterate over wildcard", function () {
                    tree.query('data.*.id'.toQuery(), callback);
                    expect(callback.calls.allArgs()).toEqual([
                        ['data.0.id'.toPath(), "X999_Y999"],
                        ['data.1.id'.toPath(), "X998_Y998"]
                    ]);
                });
            });

            describe("with key options", function () {
                it("should iterate over wildcard", function () {
                    tree.query('data.0.id,type'.toQuery(), callback);
                    expect(callback.calls.allArgs()).toEqual([
                        ['data.0.id'.toPath(), "X999_Y999"],
                        ['data.0.type'.toPath(), "status"]
                    ]);
                });
            });

            describe("with key exclusion", function () {
                it("should iterate over wildcard", function () {
                    tree.query('data.!0.id'.toQuery(), callback);
                    expect(callback.calls.allArgs()).toEqual([
                        ['data.1.id'.toPath(), "X998_Y998"]
                    ]);
                });
            });

            describe("with value options", function () {
                it("should iterate over wildcard", function () {
                    tree.query('data.*.*.*.name:Like'.toQuery(), callback);
                    expect(callback.calls.allArgs()).toEqual([
                        ['data.0.actions.1.name'.toPath(), "Like"],
                        ['data.1.actions.1.name'.toPath(), "Like"]
                    ]);
                });
            });

            describe("with value exclusion", function () {
                it("should iterate over wildcard", function () {
                    tree.query('data.*.*.id:!X12'.toQuery(), callback);
                    expect(callback.calls.allArgs()).toEqual([
                        ['data.1.from.id'.toPath(), "X18"]
                    ]);
                });
            });

            describe("with primitive value matching", function () {
                it("should iterate over wildcard", function () {
                    tree.query('data.0.*:$'.toQuery(), callback);
                    expect(callback.calls.allArgs()).toEqual([
                        ["data.0.id".toPath(), "X999_Y999"],
                        ["data.0.message".toPath(), "Looking forward to 2010!"],
                        ["data.0.type".toPath(), "status"],
                        ["data.0.created_time".toPath(),
                            "2010-08-02T21:27:44+0000"],
                        ["data.0.updated_time".toPath(),
                            "2010-08-02T21:27:44+0000"]
                    ]);
                });
            });

            describe("with skipping", function () {
                it("should invoke callback", function () {
                    tree.query('data.**.name'.toQuery(), callback);
                    expect(callback.calls.allArgs()).toEqual([
                        ["data.0.from.name".toPath(), "Tom Brady"],
                        ["data.0.actions.0.name".toPath(), "Comment"],
                        ["data.0.actions.1.name".toPath(), "Like"],
                        ["data.1.from.name".toPath(), "Peyton Manning"],
                        ["data.1.actions.0.name".toPath(), "Comment"],
                        ["data.1.actions.1.name".toPath(), "Like"]
                    ]);
                });
            });

            describe("with trail skipping", function () {
                it("should invoke callback", function () {
                    tree.query('data.0.actions.**'.toQuery(), callback);
                    expect(callback.calls.allArgs()).toEqual([
                        ["data.0.actions.0.name".toPath(), "Comment"],
                        ["data.0.actions.0.link".toPath(),
                            "http://www.facebook.com/X999/posts/Y999"],
                        ["data.0.actions.1.name".toPath(), "Like"],
                        ["data.0.actions.1.link".toPath(),
                            "http://www.facebook.com/X999/posts/Y999"]
                    ]);
                });
            });

            describe("with skipping all the way", function () {
                it("should traverse all leaf nodes", function () {
                    tree.query('**'.toQuery(), callback);
                    expect(callback.calls.allArgs()).toEqual([
                        ["data.0.id".toPath(), "X999_Y999"],
                        ["data.0.from.name".toPath(), "Tom Brady"],
                        ["data.0.from.id".toPath(), "X12"],
                        ["data.0.message".toPath(),
                            "Looking forward to 2010!"],
                        ["data.0.actions.0.name".toPath(), "Comment"],
                        ["data.0.actions.0.link".toPath(),
                            "http://www.facebook.com/X999/posts/Y999"],
                        ["data.0.actions.1.name".toPath(), "Like"],
                        ["data.0.actions.1.link".toPath(),
                            "http://www.facebook.com/X999/posts/Y999"],
                        ["data.0.type".toPath(), "status"],
                        ["data.0.created_time".toPath(),
                            "2010-08-02T21:27:44+0000"],
                        ["data.0.updated_time".toPath(),
                            "2010-08-02T21:27:44+0000"],
                        ["data.1.id".toPath(), "X998_Y998"],
                        ["data.1.from.name".toPath(), "Peyton Manning"],
                        ["data.1.from.id".toPath(), "X18"],
                        ["data.1.message".toPath(), "Where's my contract?"],
                        ["data.1.actions.0.name".toPath(), "Comment"],
                        ["data.1.actions.0.link".toPath(),
                            "http://www.facebook.com/X998/posts/Y998"],
                        ["data.1.actions.1.name".toPath(), "Like"],
                        ["data.1.actions.1.link".toPath(),
                            "http://www.facebook.com/X998/posts/Y998"],
                        ["data.1.type".toPath(), "status"],
                        ["data.1.created_time".toPath(),
                            "2010-08-02T21:27:44+0000"],
                        ["data.1.updated_time".toPath(),
                            "2010-08-02T21:27:44+0000"]
                    ]);
                });
            });

            describe("with skipping with key exclusion", function () {
                it("should invoke callback", function () {
                    tree.query('data.**!actions.name'.toQuery(), callback);
                    expect(callback.calls.allArgs()).toEqual([
                        ["data.0.from.name".toPath(), "Tom Brady"],
                        ["data.1.from.name".toPath(), "Peyton Manning"]
                    ]);
                });
            });
        });

        describe("hasPath()", function () {
            beforeEach(function () {
                // adding special case
                tree._data['undefined'] = undefined;
            });

            describe("for existing path", function () {
                it("should return true", function () {
                    expect(tree.hasPath('foo.bar'.toPath())).toBeTruthy();
                    expect(tree.hasPath('foo.bar.1'.toPath())).toBeTruthy();
                    expect(tree.hasPath('bar.hello'.toPath())).toBeTruthy();
                    expect(tree.hasPath('undefined'.toPath())).toBeTruthy();
                });
            });

            describe("for absent path", function () {
                it("should return false", function () {
                    expect(tree.hasPath('foo.baz'.toPath())).toBeFalsy();
                    expect(tree.hasPath('foo.bar.baz.quux'.toPath()))
                        .toBeFalsy();
                    expect(tree.hasPath('foo.bar.hello.world'.toPath()))
                        .toBeFalsy();
                });
            });
        });

        describe("getParentPath()", function () {
            beforeEach(function () {
                result = tree.getParentPath('bar.hello.world'.toPath());
            });

            it("should return Path instance", function () {
                expect($data.Path.isIncludedBy(result)).toBeTruthy();
            });

            it("should retrieve path to closest non-leaf node", function () {
                expect(result.equals('bar'.toPath())).toBeTruthy();
            });

            describe("for existing path", function () {
                it("should return path to parent node", function () {
                    result = tree.getParentPath('foo.bar'.toPath());
                    expect('foo'.toPath().equals(result)).toBeTruthy();
                });
            });
        });

        describe("getLastForkPath()", function () {
            beforeEach(function () {
                // adding long unique path
                tree.setNode('bar.baz.quux.hello.world'.toPath(), true);
                // making singular node
                tree.deleteNode('bar.world'.toPath());
                result = tree.getLastForkPath('bar.baz.quux.hello.world'.toPath());
            });

            it("should return Path instance", function () {
                expect($data.Path.isIncludedBy(result)).toBeTruthy();
            });

            it("should return path to last multi-key node", function () {
                expect('bar'.toPath().equals(result)).toBeTruthy();
            });

            describe("for absent path", function () {
                it("should return base of existing part of path", function () {
                    result = tree.getLastForkPath('bar.foo.quux.hello.world'.toPath());
                    expect('bar'.toPath().equals(result)).toBeTruthy();
                });
            });

            describe("for existing shorter path", function () {
                describe("that points to multi-key node", function () {
                    it("should return specified path", function () {
                        result = tree.getLastForkPath('foo.bar'.toPath());
                        expect('foo.bar'.toPath().equals(result)).toBeTruthy();
                    });
                });

                describe("that points to single-key node", function () {
                    it("should return specified path", function () {
                        result = tree.getLastForkPath('bar.world'.toPath());
                        expect('bar'.toPath().equals(result)).toBeTruthy();
                    });
                });
            });
        });

        describe("getNode()", function () {
            it("should retrieve node from tree", function () {
                expect(tree.getNode('foo.bar'.toPath()))
                    .toBe(tree._data.foo.bar);
            });

            describe("for absent path", function () {
                it("should return undefined", function () {
                    expect(tree.getNode('foo.bar.baz'.toPath()))
                        .toBeUndefined();
                });
            });
        });

        describe("getNodeWrapped()", function () {
            beforeEach(function () {
                result = tree.getNodeWrapped('foo.bar'.toPath());
            });

            it("should return Tree instance", function () {
                expect(Tree.isIncludedBy(result)).toBeTruthy();
            });

            it("should return wrapped result", function () {
                expect(result._data).toEqual([
                    'baz',
                    'quux'
                ]);
            });
        });

        describe("setNode()", function () {
            it("should return self", function () {
                expect(tree.setNode('foo.bar.1'.toPath(), {})).toBe(tree);
            });

            it("should set node in tree", function () {
                tree.setNode('foo.bar.1'.toPath(), {});
                expect(tree._data).toEqual({
                    foo: {
                        bar: [
                            'baz',
                            {}
                        ]
                    },
                    bar: {
                        hello: 'world'
                    }
                });
            });

            describe("when setting undefined", function () {
                it("should create path", function () {
                    tree.setNode('bar.baz'.toPath(), undefined);
                    expect(tree._data).toEqual({
                        foo: {
                            bar: [
                                'baz',
                                'quux'
                            ]
                        },
                        bar: {
                            hello: 'world',
                            baz: undefined
                        }
                    });
                });
            });
        });

        describe("appendNode()", function () {
            var path, value,
                callback;

            beforeEach(function () {
                path = 'bar'.toPath();
                value = {
                    a: 'b',
                    c: 'd'
                };
                result = tree.appendNode(path, value);
            });

            it("should return self", function () {
                expect(result).toBe(tree);
            });

            it("should append value to node", function () {
                expect(tree._data).toEqual({
                    foo: {
                        bar: [
                            'baz',
                            'quux'
                        ]
                    },
                    bar: {
                        hello: 'world',
                        a: 'b',
                        c: 'd'
                    }
                });
            });

            describe("when appending to array", function () {
                describe("a non-array node", function () {
                    beforeEach(function () {
                        path = 'foo.bar'.toPath();
                        result = tree.appendNode('foo.bar'.toPath(), {
                            3: 'foo',
                            4: 'bar'
                        });
                    });

                    it("should concatenate to array", function () {
                        expect(tree._data.foo.bar).toEqual([
                            'baz', 'quux', undefined, 'foo', 'bar'
                        ]);
                    });
                });

                describe("an array node", function () {
                    beforeEach(function () {
                        path = 'foo.bar'.toPath();
                        result = tree.appendNode('foo.bar'.toPath(), [
                            'foo', 'bar'
                        ]);
                    });

                    it("should concatenate to array", function () {
                        expect(tree._data.foo.bar).toEqual([
                            'baz', 'quux', 'foo', 'bar'
                        ]);
                    });
                });
            });

            describe("when appending to absent node", function () {
                var node;

                beforeEach(function () {
                    path = 'baz'.toPath();
                    spyOn(tree, 'setNode');
                    node = {
                        foo: 'bar'
                    };
                    result = tree.appendNode(path, node);
                });

                it("should set node", function () {
                    expect(tree.setNode)
                        .toHaveBeenCalledWith(path, node);
                });
            });

            describe("when appending primitive node", function () {
                it("should throw", function () {
                    expect(function () {
                        tree.appendNode('bar.hello'.toPath(), {});
                    }).toThrow();
                });
            });

            describe("when appending to primitive node", function () {
                it("should throw", function () {
                    expect(function () {
                        tree.appendNode('foo'.toPath(), 'bar');
                    }).toThrow();
                });
            });
        });

        describe("deleteNode()", function () {
            it("should return self", function () {
                expect(tree.deleteNode('foo'.toPath())).toBe(tree);
            });

            describe("from array parent", function () {
                describe("with splicing", function () {
                    it("should splice node out of parent", function () {
                        tree.deleteNode('foo.bar.0'.toPath(), true);
                        expect(tree._data).toEqual({
                            foo: {
                                bar: [
                                    'quux'
                                ]
                            },
                            bar: {
                                hello: 'world'
                            }
                        });
                    });
                });

                describe("without splicing", function () {
                    it("should remove node from parent", function () {
                        tree.deleteNode('foo.bar.0'.toPath());
                        expect(tree._data).toEqual({
                            foo: {
                                bar: [
                                    undefined,
                                    'quux'
                                ]
                            },
                            bar: {
                                hello: 'world'
                            }
                        });
                        expect(tree._data.foo.bar.hasOwnProperty(0))
                            .toBeFalsy();
                    });
                });
            });

            describe("from object parent", function () {
                it("should remove node from parent", function () {
                    tree.deleteNode('bar.hello'.toPath(), true);
                    expect(tree._data).toEqual({
                        foo: {
                            bar: [
                                'baz',
                                'quux'
                            ]
                        },
                        bar: {}
                    });
                });
            });

            describe("from absent path", function () {
                it("should have no effect", function () {
                    tree.deleteNode('bar.baz'.toPath(), true);
                    expect(tree._data).toEqual({
                        foo: {
                            bar: [
                                'baz',
                                'quux'
                            ]
                        },
                        bar: {
                            hello: 'world'
                        }
                    });
                });
            });
        });

        describe("deletePath()", function () {
            it("should return self", function () {
                result = tree.deletePath('bar.hello'.toPath());
                expect(result).toBe(tree);
            });

            describe("for existing path", function () {
                it("should remove affected nodes along path", function () {
                    tree.deletePath('bar.hello'.toPath());
                    expect(tree._data).toEqual({
                        foo: {
                            bar: [
                                'baz',
                                'quux'
                            ]
                        }
                    });
                });

                describe("that is multi-key", function () {
                    it("should remove node at path", function () {
                        result = tree.deletePath('foo.bar'.toPath());
                        expect(tree._data).toEqual({
                            foo: {},
                            bar: {
                                hello: 'world'
                            }
                        });
                    });
                });
            });

            describe("for absent path", function () {
                it("should remove existing portion of the path", function () {
                    tree.deletePath('bar.hello.world'.toPath());
                    expect(tree._data).toEqual({
                        foo: {
                            bar: [
                                'baz',
                                'quux'
                            ]
                        }
                    });
                });
            });

            describe("for array node", function () {
                describe("with splicing", function () {
                    it("should splice affected node out", function () {
                        tree.deletePath('foo.bar.0.quux'.toPath(), true);
                        expect(tree._data).toEqual({
                            foo: {
                                bar: [
                                    'quux'
                                ]
                            },
                            bar: {
                                hello: 'world'
                            }
                        });
                    });
                });

                describe("without splicing", function () {
                    it("should delete affected node", function () {
                        tree.deletePath('foo.bar.0.quux'.toPath());
                        expect(tree._data).toEqual({
                            foo: {
                                bar: [
                                    undefined,
                                    'quux'
                                ]
                            },
                            bar: {
                                hello: 'world'
                            }
                        });
                    });
                });
            });
        });
    });

    describe("DataContainer", function () {
        var result;

        describe("toTree()", function () {
            var container = $data.DataContainer.create([1, 2, 3]);

            beforeEach(function () {
                result = container.toTree();
            });

            it("should return a Tree instance", function () {
                expect($data.Tree.isIncludedBy(result)).toBeTruthy();
            });

            it("should set _data buffer", function () {
                expect(result._data).toBe(container._data);
            });
        });
    });
});

describe("Array", function () {
    var result;

    describe("toTree()", function () {
        var array = [1, 2, 3];

        beforeEach(function () {
            result = array.toTree();
        });

        it("should return a Tree instance", function () {
            expect($data.Tree.isIncludedBy(result)).toBeTruthy();
        });

        it("should set _data property", function () {
            expect(result._data).toBe(array);
        });
    });
});
