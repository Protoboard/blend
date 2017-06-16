"use strict";

var $data = window['giant-data'];

describe("$data", function () {
    describe("QueryComponent", function () {
        var QueryComponent,
            queryComponent,
            result;

        beforeEach(function () {
            QueryComponent = $oop.getClass('test.$data.QueryComponent.QueryComponent')
                .extend($data.QueryComponent);
        });

        describe("create()", function () {
            it("should set _isSkipper property", function () {
                expect(QueryComponent.create('**')._isSkipper).toBeTruthy();
                expect(QueryComponent.create('**:foo')._isSkipper).toBeTruthy();
                expect(QueryComponent.create('\\*\\*')._isSkipper).toBeFalsy();
            });

            it("should set _matchesAnyKey property", function () {
                expect(QueryComponent.create('*')._matchesAnyKey).toBeTruthy();
                expect(QueryComponent.create('*:!foo')._matchesAnyKey)
                    .toBeTruthy();
                expect(QueryComponent.create('*:$')._matchesAnyKey)
                    .toBeTruthy();
                expect(QueryComponent.create('foo')._matchesAnyKey).toBeFalsy();
                expect(QueryComponent.create('**')._matchesAnyKey).toBeFalsy();
                expect(QueryComponent.create('\\*')._matchesAnyKey).toBeFalsy();
            });

            it("should set _keyOptions property", function () {
                expect(QueryComponent.create('foo')._keyOptions)
                    .toEqual(['foo']);
                expect(QueryComponent.create('foo,bar:$')._keyOptions).toEqual([
                    'foo', 'bar'
                ]);
                expect(QueryComponent.create('!foo,bar:$')._keyOptions)
                    .toEqual([
                        'foo', 'bar'
                    ]);
            });

            it("should set _keyOptionLookup property", function () {
                expect(QueryComponent.create('foo')._keyOptionLookup)
                    .toEqual({foo: 1});
                expect(QueryComponent.create('foo,bar:$')._keyOptionLookup)
                    .toEqual({
                        foo: 1,
                        bar: 1
                    });
                expect(QueryComponent.create('!foo,bar:$')._keyOptionLookup)
                    .toEqual({
                        foo: 1,
                        bar: 1
                    });
            });

            it("should set _isKeyNegated property", function () {
                expect(QueryComponent.create('foo:$')._isKeyNegated)
                    .toBeFalsy();
                expect(QueryComponent.create('!foo:$')._isKeyNegated)
                    .toBeTruthy();
                expect(QueryComponent.create('!foo,baz:bar')._isKeyNegated)
                    .toBeTruthy();
            });

            it("should set _matchesPrimitiveValues property", function () {
                expect(QueryComponent.create('*:$')._matchesPrimitiveValues)
                    .toBeTruthy();
                expect(QueryComponent.create('foo:$')._matchesPrimitiveValues)
                    .toBeTruthy();
                expect(QueryComponent.create('!foo:$')._matchesPrimitiveValues)
                    .toBeTruthy();
                expect(QueryComponent.create('!foo:\\$')._matchesPrimitiveValues)
                    .toBeFalsy();
                expect(QueryComponent.create('!foo:bar')._matchesPrimitiveValues)
                    .toBeFalsy();
            });

            it("should set _matchesAnyValue property", function () {
                expect(QueryComponent.create('foo')._matchesAnyValue)
                    .toBeTruthy();
                expect(QueryComponent.create('!quux:*')._matchesAnyValue)
                    .toBeTruthy();
                expect(QueryComponent.create('*:foo,bar')._matchesAnyValue)
                    .toBeFalsy();
            });

            it("should set _valueOptions property", function () {
                expect(QueryComponent.create('*:foo')._valueOptions)
                    .toEqual(['foo']);
                expect(QueryComponent.create('!quux:foo,bar')._valueOptions)
                    .toEqual([
                        'foo', 'bar'
                    ]);
                expect(QueryComponent.create('*:!foo,bar')._valueOptions)
                    .toEqual([
                        'foo', 'bar'
                    ]);
            });

            it("should set _isValueNegated property", function () {
                expect(QueryComponent.create('*:foo')._isValueNegated)
                    .toBeFalsy();
                expect(QueryComponent.create('foo:!bar')._isValueNegated)
                    .toBeTruthy();
                expect(QueryComponent.create('*:!foo,bar')._isValueNegated)
                    .toBeTruthy();
            });
        });

        describe("clone()", function () {
            beforeEach(function () {
                queryComponent = QueryComponent.create('foo:!bar');
                result = queryComponent.clone();
            });

            it("should return QueryComponent instance", function () {
                expect(QueryComponent.isIncludedBy(result)).toBeTruthy();
            });

            it("should initialize properties", function () {
                expect(result).toEqual(queryComponent);
            });
        });

        describe("toString()", function () {
            describe("when _isSkipper is true", function () {
                it("should discard value", function () {
                    expect(QueryComponent.create('**:foo') + '').toBe('**');
                });

                describe("and key is negated", function () {
                    it("should include negated key options", function () {
                        expect(QueryComponent.create('**!foo') + '')
                            .toBe('**!foo');
                    });
                });
            });

            describe("when _matchesAnyKey is true", function () {
                it("should output key wildcard", function () {
                    expect(QueryComponent.create('*:foo') + '').toBe('*:foo');
                });
            });

            describe("when _isKeyNegated is true", function () {
                it("should negate keys", function () {
                    expect(QueryComponent.create('!foo:baz') + '')
                        .toBe('!foo:baz');
                });
            });

            describe("when _keyOptions are specified", function () {
                it("should include key options", function () {
                    expect(QueryComponent.create('foo,bar:baz') + '')
                        .toBe('foo,bar:baz');
                });
            });

            describe("when _matchesPrimitiveValues is true", function () {
                it("should output primitive value marker", function () {
                    expect(QueryComponent.create('foo:$') + '').toBe('foo:$');
                });
            });

            describe("when _matchesAnyValue is true", function () {
                it("should output value wildcard", function () {
                    expect(QueryComponent.create('foo:*') + '').toBe('foo:*');
                    expect(QueryComponent.create('foo') + '').toBe('foo:*');
                });
            });

            describe("when _isValueNegated is true", function () {
                it("should negate keys", function () {
                    expect(QueryComponent.create('foo:!bar') + '')
                        .toBe('foo:!bar');
                });
            });

            describe("when _valueOptions are specified", function () {
                it("should include value options", function () {
                    expect(QueryComponent.create('foo:bar,baz') + '')
                        .toBe('foo:bar,baz');
                });
            });
        });
    });
});

describe("String", function () {
    var result;

    describe("toQueryComponent()", function () {
        var string,
            queryComponent;

        beforeEach(function () {
            string = 'foo:!bar';
            queryComponent = $data.QueryComponent.create(string);
            spyOn($data.QueryComponent, 'create').and
                .returnValue(queryComponent);
            result = string.toQueryComponent();
        });

        it("should create a QueryComponent instance", function () {
            expect($data.QueryComponent.create)
                .toHaveBeenCalledWith(string);
        });

        it("should return created instance", function () {
            expect(result).toBe(queryComponent);
        });
    });
});
