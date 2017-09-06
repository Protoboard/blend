"use strict";

var $data = window['cake-data'];

describe("$assert", function () {
  var tree;

  beforeEach(function () {
    tree = $data.Tree.create({data: ['foo', 'bar']});
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
      .mix($data.Tree);

      tree = Tree.create({
        data: {
          foo: {
            bar: [
              'baz',
              'quux'
            ]
          },
          bar: {
            hello: 'world'
          }
        }
      });
    });

    describe("create()", function () {
      describe("on missing arguments", function () {
        it("should initialize data to empty object", function () {
          tree = Tree.create();
          expect(tree.data).toEqual({});
        });
      });
    });

    describe("clone()", function () {
      beforeEach(function () {
        result = tree.clone();
      });

      it("should return Tree instance", function () {
        expect(Tree.mixedBy(result)).toBeTruthy();
      });

      it("should initialize data on clone", function () {
        expect(result.data).toEqual(tree.data);
        expect(result.data).not.toBe(tree.data);
      });
    });

    describe("query()", function () {
      var callback;

      beforeEach(function () {
        // JSON taken from
        // https://www.sitepoint.com/facebook-json-example/
        tree = $data.Tree.create({
          data: {
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
          }
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
            ["data.0.created_time".toPath(), "2010-08-02T21:27:44+0000"],
            ["data.0.updated_time".toPath(), "2010-08-02T21:27:44+0000"]
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
            ["data.0.message".toPath(), "Looking forward to 2010!"],
            ["data.0.actions.0.name".toPath(), "Comment"],
            ["data.0.actions.0.link".toPath(),
              "http://www.facebook.com/X999/posts/Y999"],
            ["data.0.actions.1.name".toPath(), "Like"],
            ["data.0.actions.1.link".toPath(),
              "http://www.facebook.com/X999/posts/Y999"],
            ["data.0.type".toPath(), "status"],
            ["data.0.created_time".toPath(), "2010-08-02T21:27:44+0000"],
            ["data.0.updated_time".toPath(), "2010-08-02T21:27:44+0000"],
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
            ["data.1.created_time".toPath(), "2010-08-02T21:27:44+0000"],
            ["data.1.updated_time".toPath(), "2010-08-02T21:27:44+0000"]
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
        tree.data['undefined'] = undefined;
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
          expect(tree.hasPath('foo.bar.baz.quux'.toPath())).toBeFalsy();
          expect(tree.hasPath('foo.bar.hello.world'.toPath())).toBeFalsy();
        });
      });
    });

    describe("getParentPath()", function () {
      beforeEach(function () {
        result = tree.getParentPath('bar.hello.world'.toPath());
      });

      it("should return Path instance", function () {
        expect($data.Path.mixedBy(result)).toBeTruthy();
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
        tree.deleteNode('bar.world'.toPath()); // todo ?
        result = tree.getLastForkPath('bar.baz.quux.hello.world'.toPath());
      });

      it("should return Path instance", function () {
        expect($data.Path.mixedBy(result)).toBeTruthy();
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
        it("should return path to last multi-key node", function () {
          result = tree.getLastForkPath('foo.bar'.toPath());
          expect([].toPath().equals(result)).toBeTruthy();
        });
      });
    });

    describe("getNode()", function () {
      it("should retrieve node from tree", function () {
        expect(tree.getNode('foo.bar'.toPath())).toBe(tree.data.foo.bar);
      });

      describe("for absent path", function () {
        it("should return undefined", function () {
          expect(tree.getNode('foo.bar.baz'.toPath())).toBeUndefined();
        });
      });

      describe("for empty path", function () {
        it("should return data buffer", function () {
          expect(tree.getNode([].toPath())).toBe(tree.data);
        });
      });
    });

    describe("getNodeWrapped()", function () {
      var path,
          node;

      beforeEach(function () {
        path = 'foo.bar'.toPath();
        node = {};
        spyOn(tree, 'getNode').and.returnValue(node);
        result = tree.getNodeWrapped(path);
      });

      it("should invoke getNode()", function () {
        expect(tree.getNode).toHaveBeenCalledWith(path);
      });

      it("should return Tree instance", function () {
        expect(Tree.mixedBy(result)).toBeTruthy();
      });

      it("should return wrapped result", function () {
        expect(result.data).toBe(node);
      });
    });

    describe("getInitializedNode()", function () {
      var initialNode,
          initializer;

      beforeEach(function () {
        initialNode = [];
        initializer = jasmine.createSpy().and.returnValue(initialNode);
      });

      it("should retrieve node at path", function () {
        result = tree.getInitializedNode('foo.bar'.toPath(), initializer);
        expect(result).toEqual(['baz', 'quux']);
      });

      describe("for absent path", function () {
        beforeEach(function () {
          result = tree.getInitializedNode('foo.baz'.toPath(), initializer);
        });

        it("should invoke initializer", function () {
          expect(initializer).toHaveBeenCalled();
        });

        it("should store result of initializer", function () {
          expect(tree.data).toEqual({
            foo: {
              bar: [
                'baz',
                'quux'
              ],
              baz: []
            },
            bar: {
              hello: 'world'
            }
          });
        });

        it("should retrieve initialized node", function () {
          expect(result).toBe(initialNode);
        });
      });
    });

    describe("getInitializedNodeWrapped()", function () {
      var path,
          initializer,
          node;

      beforeEach(function () {
        path = 'foo.bar'.toPath();
        initializer = function () {};
        node = {};
        spyOn(tree, 'getInitializedNode').and.returnValue(node);
        result = tree.getInitializedNodeWrapped(path, initializer);
      });

      it("should invoke getInitializedNode()", function () {
        expect(tree.getInitializedNode).toHaveBeenCalledWith(path, initializer);
      });

      it("should return Tree instance", function () {
        expect(Tree.mixedBy(result)).toBeTruthy();
      });

      it("should return wrapped result", function () {
        expect(result.data).toBe(node);
      });
    });

    describe("setNode()", function () {
      it("should return self", function () {
        expect(tree.setNode('foo.bar.1'.toPath(), {})).toBe(tree);
      });

      it("should set node in tree", function () {
        tree.setNode('foo.bar.1'.toPath(), {});
        expect(tree.data).toEqual({
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
          expect(tree.data).toEqual({
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
        expect(tree.data).toEqual({
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
            expect(tree.data.foo.bar).toEqual([
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
            expect(tree.data.foo.bar).toEqual([
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
          expect(tree.setNode).toHaveBeenCalledWith(path, node);
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
            expect(tree.data).toEqual({
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
            expect(tree.data).toEqual({
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
            expect(tree.data.foo.bar.hasOwnProperty(0)).toBeFalsy();
          });
        });
      });

      describe("from object parent", function () {
        it("should remove node from parent", function () {
          tree.deleteNode('bar.hello'.toPath(), true);
          expect(tree.data).toEqual({
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
          expect(tree.data).toEqual({
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
          expect(tree.data).toEqual({
            foo: {
              bar: [
                'baz',
                'quux'
              ]
            }
          });
        });

        describe("when last forking noe is root", function () {
          it("should remove affected nodes along path", function () {
            tree.deletePath('foo.bar'.toPath());
            expect(tree.data).toEqual({
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
          expect(tree.data).toEqual({
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
            expect(tree.data).toEqual({
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
            expect(tree.data).toEqual({
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

    describe("queryNodes()", function () {
      var query;

      beforeEach(function () {
        query = 'foo.bar.*'.toQuery();
        spyOn(tree, 'query').and.callThrough();
        result = tree.queryNodes(query);
      });

      it("should invoke query(), passing query param", function () {
        expect(tree.query.calls.argsFor(0)[0]).toBe(query);
      });

      it("should retrieve array of matching nodes", function () {
        expect(result).toEqual([
          'baz', 'quux'
        ]);
      });
    });

    describe("queryNodesWrapped()", function () {
      var query,
          data;

      beforeEach(function () {
        query = 'foo.bar.*'.toQuery();
        data = [];
        spyOn(tree, 'queryNodes').and.returnValue(data);
        result = tree.queryNodesWrapped(query);
      });

      it("should return Collection instance", function () {
        expect($data.Collection.mixedBy(result)).toBeTruthy();
      });

      it("should invoke queryNodes() with query", function () {
        expect(tree.queryNodes).toHaveBeenCalledWith(query);
      });

      it("should return same data as queryNodes()", function () {
        expect(result.data).toBe(data);
      });
    });

    describe("queryKeys()", function () {
      var query;

      beforeEach(function () {
        query = 'foo.bar.*'.toQuery();
        spyOn(tree, 'query').and.callThrough();
        result = tree.queryKeys(query);
      });

      it("should invoke query(), passing query param", function () {
        expect(tree.query.calls.argsFor(0)[0]).toBe(query);
      });

      it("should retrieve array of matching keys", function () {
        expect(result).toEqual(['0', '1']);
      });
    });

    describe("queryKeysWrapped()", function () {
      var query,
          data;

      beforeEach(function () {
        query = 'foo.bar.*'.toQuery();
        data = [];
        spyOn(tree, 'queryKeys').and.returnValue(data);
        result = tree.queryKeysWrapped(query);
      });

      it("should return StringCollection instance", function () {
        expect($data.StringCollection.mixedBy(result)).toBeTruthy();
      });

      it("should invoke queryKeys() with query", function () {
        expect(tree.queryKeys).toHaveBeenCalledWith(query);
      });

      it("should return same data as queryKeys()", function () {
        expect(result.data).toBe(data);
      });
    });

    describe("queryPaths()", function () {
      var query;

      beforeEach(function () {
        query = 'foo.bar.*'.toQuery();
        spyOn(tree, 'query').and.callThrough();
        result = tree.queryPaths(query);
      });

      it("should invoke query(), passing query param", function () {
        expect(tree.query.calls.argsFor(0)[0]).toBe(query);
      });

      it("should retrieve array of matching paths", function () {
        expect(result).toEqual([
          'foo.bar.0'.toPath(),
          'foo.bar.1'.toPath()
        ]);
      });
    });

    describe("queryPathsWrapped()", function () {
      var query,
          data;

      beforeEach(function () {
        query = 'foo.bar.*'.toQuery();
        data = [];
        spyOn(tree, 'queryPaths').and.returnValue(data);
        result = tree.queryPathsWrapped(query);
      });

      it("should return Collection instance", function () {
        expect($data.Collection.mixedBy(result)).toBeTruthy();
      });

      it("should invoke queryPaths() with query", function () {
        expect(tree.queryPaths).toHaveBeenCalledWith(query);
      });

      it("should return same data as queryPaths()", function () {
        expect(result.data).toBe(data);
      });
    });

    describe("queryKeyNodePairs()", function () {
      var query;

      beforeEach(function () {
        query = 'foo.bar.*'.toQuery();
        spyOn(tree, 'query').and.callThrough();
        result = tree.queryKeyNodePairs(query);
      });

      it("should return PairList instance", function () {
        expect($data.PairList.mixedBy(result)).toBeTruthy();
      });

      it("should invoke query(), passing query param", function () {
        expect(tree.query.calls.argsFor(0)[0]).toBe(query);
      });

      it("should retrieve matching key-node pairs", function () {
        expect(result.data).toEqual([
          {key: '0', value: 'baz'},
          {key: '1', value: 'quux'}
        ]);
      });
    });

    describe("queryPathNodePairs()", function () {
      var query;

      beforeEach(function () {
        query = 'foo.bar.*'.toQuery();
        spyOn(tree, 'query').and.callThrough();
        result = tree.queryPathNodePairs(query);
      });

      it("should return PairList instance", function () {
        expect($data.PairList.mixedBy(result)).toBeTruthy();
      });

      it("should invoke query(), passing query param", function () {
        expect(tree.query.calls.argsFor(0)[0]).toBe(query);
      });

      it("should retrieve matching path-node pairs", function () {
        expect(result.data).toEqual([
          {key: 'foo.bar.0'.toPath(), value: 'baz'},
          {key: 'foo.bar.1'.toPath(), value: 'quux'}
        ]);
      });
    });
  });

  describe("DataContainer", function () {
    var result;

    describe("asTree()", function () {
      var container = $data.DataContainer.create({data: [1, 2, 3]});

      beforeEach(function () {
        result = container.asTree();
      });

      it("should return a Tree instance", function () {
        expect($data.Tree.mixedBy(result)).toBeTruthy();
      });

      it("should set data buffer", function () {
        expect(result.data).toBe(container.data);
      });
    });
  });
});

describe("Array", function () {
  var result;

  describe("asTree()", function () {
    var array = [1, 2, 3];

    beforeEach(function () {
      result = array.asTree();
    });

    it("should return a Tree instance", function () {
      expect($data.Tree.mixedBy(result)).toBeTruthy();
    });

    it("should set data property", function () {
      expect(result.data).toBe(array);
    });
  });
});
