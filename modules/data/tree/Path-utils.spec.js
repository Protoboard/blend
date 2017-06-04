"use strict";

var $data = window['giant-data'];

describe("$data", function () {
    describe("escapePathComponent()", function () {
        it("should escape separator", function () {
            expect($data.escapePathComponent('foo.bar'))
                .toEqual('foo\\.bar');
        });
        it("should escape escape-character", function () {
            expect($data.escapePathComponent('foo\\bar'))
                .toEqual('foo\\\\bar');
        });
    });

    describe("unescapePathComponent()", function () {
        it("should un-escape escaped separator", function () {
            expect($data.unescapePathComponent('foo\\.bar'))
                .toEqual('foo.bar');
        });
        it("should un-escape escaped escape character", function () {
            expect($data.unescapePathComponent('foo\\\\bar'))
                .toEqual('foo\\bar');
        });
    });

    describe("safeSplitPath()", function () {
        it("split path along separators", function () {
            expect($data.safeSplitPath('foo.bar.baz'))
                .toEqual(['foo', 'bar', 'baz']);
        });
        it("handle leading separator", function () {
            expect($data.safeSplitPath('.foo.bar.baz'))
                .toEqual(['', 'foo', 'bar', 'baz']);
        });
        it("handle trailing separator", function () {
            expect($data.safeSplitPath('foo.bar.baz.'))
                .toEqual(['foo', 'bar', 'baz', '']);
        });
        it("leave escaped separators intact", function () {
            expect($data.safeSplitPath('foo\\.bar.baz\\.quux'))
                .toEqual(['foo\\.bar', 'baz\\.quux']);
        });
    });
});
