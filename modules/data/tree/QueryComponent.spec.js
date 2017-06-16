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
                expect(QueryComponent.create('**!foo')._isSkipper).toBeTruthy();
                expect(QueryComponent.create('\\*\\*')._isSkipper).toBeFalsy();
            });

            it("should set _isKeyNegated property", function () {
                expect(QueryComponent.create('foo')._isKeyNegated)
                    .toBeFalsy();
                expect(QueryComponent.create('!foo')._isKeyNegated)
                    .toBeTruthy();
                expect(QueryComponent.create('*')._isKeyNegated)
                    .toBeFalsy();
                expect(QueryComponent.create('**')._isKeyNegated)
                    .toBeFalsy();
            });

            it("should set _matchesAnyKey property", function () {
                expect(QueryComponent.create('*')._matchesAnyKey).toBeTruthy();
                expect(QueryComponent.create('\\*')._matchesAnyKey).toBeFalsy();
                expect(QueryComponent.create('foo')._matchesAnyKey).toBeFalsy();
                expect(QueryComponent.create('!foo')._matchesAnyKey)
                    .toBeFalsy();
                expect(QueryComponent.create('**')._matchesAnyKey).toBeTruthy();
                expect(QueryComponent.create('\\*\\*')._matchesAnyKey)
                    .toBeFalsy();
            });

            it("should set _keyOptions property", function () {
                expect(QueryComponent.create('foo')._keyOptions)
                    .toEqual(['foo']);
                expect(QueryComponent.create('foo,bar')._keyOptions)
                    .toEqual(['foo', 'bar']);
                expect(QueryComponent.create('foo\\,bar')._keyOptions)
                    .toEqual(['foo,bar']);
                expect(QueryComponent.create('!foo')._keyOptions)
                    .toEqual(['foo']);
                expect(QueryComponent.create('')._keyOptions)
                    .toEqual(['']);
                expect(QueryComponent.create('**')._keyOptions)
                    .toBeUndefined();
                expect(QueryComponent.create('*')._keyOptions)
                    .toBeUndefined();
            });

            it("should set _keyOptionLookup property", function () {
                expect(QueryComponent.create('foo')._keyOptionLookup)
                    .toEqual({foo: 1});
                expect(QueryComponent.create('foo,bar')._keyOptionLookup)
                    .toEqual({
                        foo: 1,
                        bar: 1
                    });
                expect(QueryComponent.create('!foo')._keyOptionLookup)
                    .toEqual({
                        foo: 1
                    });
            });

            it("should set _matchesPrimitiveValues property", function () {
                expect(QueryComponent.create('foo')._matchesPrimitiveValues)
                    .toBeFalsy();
                expect(QueryComponent.create('foo:$')._matchesPrimitiveValues)
                    .toBeTruthy();
                expect(QueryComponent.create('foo:\\$')._matchesPrimitiveValues)
                    .toBeFalsy();
                expect(QueryComponent.create('foo:bar')._matchesPrimitiveValues)
                    .toBeFalsy();
            });

            it("should set _isValueNegated property", function () {
                expect(QueryComponent.create('foo')._isValueNegated)
                    .toBeFalsy();
                expect(QueryComponent.create('foo:*')._isValueNegated)
                    .toBeFalsy();
                expect(QueryComponent.create('foo:bar')._isValueNegated)
                    .toBeFalsy();
                expect(QueryComponent.create('foo:!bar')._isValueNegated)
                    .toBeTruthy();
            });

            it("should set _matchesAnyValue property", function () {
                expect(QueryComponent.create('foo')._matchesAnyValue)
                    .toBeTruthy();
                expect(QueryComponent.create('foo:*')._matchesAnyValue)
                    .toBeTruthy();
                expect(QueryComponent.create('foo:\\*')._matchesAnyValue)
                    .toBeFalsy();
                expect(QueryComponent.create('foo:bar')._matchesAnyValue)
                    .toBeFalsy();
                expect(QueryComponent.create('foo:!bar')._matchesAnyValue)
                    .toBeFalsy();
            });

            it("should set _valueOptions property", function () {
                expect(QueryComponent.create('**')._valueOptions)
                    .toBeUndefined();
                expect(QueryComponent.create('**!foo')._valueOptions)
                    .toBeUndefined();
                expect(QueryComponent.create('*')._valueOptions)
                    .toBeUndefined();
                expect(QueryComponent.create('*:foo')._valueOptions)
                    .toEqual(['foo']);
                expect(QueryComponent.create('*:foo\\,bar')._valueOptions)
                    .toEqual(['foo,bar']);
                expect(QueryComponent.create('!quux:foo,bar')._valueOptions)
                    .toEqual(['foo', 'bar']);
                expect(QueryComponent.create('*:!foo,bar')._valueOptions)
                    .toEqual(['foo', 'bar']);
                expect(QueryComponent.create('*:')._valueOptions)
                    .toEqual(['']);
                expect(QueryComponent.create('*:!')._valueOptions)
                    .toEqual(['']);
                expect(QueryComponent.create('*:*')._valueOptions)
                    .toBeUndefined();
                expect(QueryComponent.create('*:$')._valueOptions)
                    .toBeUndefined();
            });
        });

        describe("clone()", function () {
            beforeEach(function () {
                queryComponent = QueryComponent.create('foo')
                    .addValueOption('bar')
                    .negateValueOptions();
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

            describe("when _isKeyNegated is true", function () {
                it("should negate keys", function () {
                    expect(QueryComponent.create('!foo') + '').toBe('!foo:*');
                    expect(QueryComponent.create('!foo:baz') + '')
                        .toBe('!foo:baz');
                });
            });

            describe("when _matchesAnyKey is true", function () {
                it("should output key wildcard", function () {
                    expect(QueryComponent.create('*') + '').toBe('*:*');
                    expect(QueryComponent.create('*:foo') + '').toBe('*:foo');
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

            describe("when _isValueNegated is true", function () {
                it("should negate keys", function () {
                    expect(QueryComponent.create('foo:!bar') + '')
                        .toBe('foo:!bar');
                });
            });

            describe("when _matchesAnyValue is true", function () {
                it("should output value wildcard", function () {
                    expect(QueryComponent.create('foo:*') + '').toBe('foo:*');
                    expect(QueryComponent.create('foo') + '').toBe('foo:*');
                });
            });

            describe("when _valueOptions are specified", function () {
                it("should include value options", function () {
                    expect(QueryComponent.create('foo:bar,baz') + '')
                        .toBe('foo:bar,baz');
                });
            });
        });

        describe("matches()", function () {
            describe("for matching pathComponent and value", function () {
                it("should return true", function () {
                    // skipper
                    expect(QueryComponent.create('**').matches('foo'))
                        .toBeTruthy();
                    expect(QueryComponent.create('**!bar').matches('foo'))
                        .toBeTruthy();

                    // key wildcard
                    expect(QueryComponent.create('*').matches('foo'))
                        .toBeTruthy();

                    // key options
                    expect(QueryComponent.create('foo,bar').matches('foo'))
                        .toBeTruthy();
                    expect(QueryComponent.create('foo,bar').matches('bar'))
                        .toBeTruthy();

                    // negated key options
                    expect(QueryComponent.create('!foo,bar').matches('baz'))
                        .toBeTruthy();

                    // value wildcard
                    expect(QueryComponent.create('foo:*').matches('foo', 'bar'))
                        .toBeTruthy();

                    // value options
                    expect(QueryComponent.create('foo:bar,baz')
                        .matches('foo', 'bar'))
                        .toBeTruthy();
                    expect(QueryComponent.create('foo:bar,baz')
                        .matches('foo', 'baz'))
                        .toBeTruthy();

                    // negated value options
                    expect(QueryComponent.create('foo:!bar,baz')
                        .matches('foo', 'foo'))
                        .toBeTruthy();

                    // primitive value
                    expect(QueryComponent.create('foo:$')
                        .matches('foo', 'foo'))
                        .toBeTruthy();
                    expect(QueryComponent.create('foo:$')
                        .matches('foo', 1))
                        .toBeTruthy();
                    expect(QueryComponent.create('foo:$')
                        .matches('foo', true))
                        .toBeTruthy();
                    expect(QueryComponent.create('foo:$')
                        .matches('foo', null))
                        .toBeTruthy();
                });
            });

            describe("for non-matching pathComponent or value", function () {
                it("should return false", function () {
                    // skipper
                    expect(QueryComponent.create('**!foo').matches('foo'))
                        .toBeFalsy();

                    // key options
                    expect(QueryComponent.create('foo,bar').matches('baz'))
                        .toBeFalsy();

                    // negated key options
                    expect(QueryComponent.create('!foo,bar').matches('foo'))
                        .toBeFalsy();
                    expect(QueryComponent.create('!foo,bar').matches('bar'))
                        .toBeFalsy();

                    // value options
                    expect(QueryComponent.create('foo:bar,baz')
                        .matches('foo', 'foo'))
                        .toBeFalsy();

                    // negated value options
                    expect(QueryComponent.create('foo:!bar,baz')
                        .matches('foo', 'bar'))
                        .toBeFalsy();
                    expect(QueryComponent.create('foo:!bar,baz')
                        .matches('foo', 'baz'))
                        .toBeFalsy();

                    // primitive value
                    expect(QueryComponent.create('foo:$')
                        .matches('foo', {}))
                        .toBeFalsy();
                    expect(QueryComponent.create('foo:$')
                        .matches('foo', []))
                        .toBeFalsy();
                });
            });
        });

        describe("addValueOption()", function () {
            var value;

            beforeEach(function () {
                value = {};
                queryComponent = QueryComponent.create('foo:*');
                result = queryComponent.addValueOption(value);
            });

            it("should return self", function () {
                expect(result).toBe(queryComponent);
            });

            it("should add to _valueOptions", function () {
                expect(queryComponent._valueOptions).toEqual([value]);
            });

            it("should set _matchesAnyValue to false", function () {
                expect(queryComponent._isValueNegated).toBeFalsy();
            });
        });

        describe("negateValueOptions()", function () {
            beforeEach(function () {
                queryComponent = QueryComponent.create('foo:bar,baz');
                result = queryComponent.negateValueOptions();
            });

            it("should return self", function () {
                expect(result).toBe(queryComponent);
            });

            it("should set _isValueNegated to true", function () {
                expect(queryComponent._isValueNegated).toBeTruthy();
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
