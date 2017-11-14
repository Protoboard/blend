"use strict";

var $oop = window['blend-oop'],
    $utils = window['blend-utils'],
    $event = window['blend-event'],
    $api = window['blend-api'];

describe("$api", function () {
  describe("XhrDispatcher", function () {
    var XhrDispatcher,
        xhrDispatcher;

    beforeAll(function () {
      XhrDispatcher = $oop.getClass('test.$api.XhrDispatcher.XhrDispatcher')
      .blend($api.XhrDispatcher);
      XhrDispatcher.__forwards = {list: [], sources: [], lookup: {}};
    });

    describe("dispatch()", function () {
      var xhr,
          request;

      beforeEach(function () {
        xhr = new XMLHttpRequest();
        request = 'user/:userId/name'.toHttpEndpoint().toRequest({
          httpMethod: 'PUT',
          endpointParams: {userId: 'rick123'},
          requestHeaders: {'Content-Type': "application:json"},
          requestBody: "Rick",
          xhrProperties: {
            timeout: 1000
          }
        });
        xhrDispatcher = request.toRequestDispatcher();
        spyOn(window, 'XMLHttpRequest').and.returnValue(xhr);
        spyOn(xhr, 'open');
        spyOn(xhr, 'setRequestHeader');
        spyOn(xhr, 'send');
        spyOn(xhr, 'getAllResponseHeaders').and.returnValue('');
      });

      it('should return Promise', function () {
        var result = xhrDispatcher.dispatch(request);
        expect($utils.Promise.mixedBy(result)).toBeTruthy();
      });

      it("should open XHR", function () {
        xhrDispatcher.dispatch(request);
        expect(xhr.open)
        .toHaveBeenCalledWith('PUT', 'user/rick123/name', true);
      });

      it("should apply XHR properties", function () {
        xhrDispatcher.dispatch(request);
        expect(xhr.timeout).toEqual(1000);
      });

      it("should add header params", function () {
        xhrDispatcher.dispatch(request);
        expect(xhr.setRequestHeader)
        .toHaveBeenCalledWith('Content-Type', 'application:json');
      });

      it("should send XHR request", function () {
        xhrDispatcher.dispatch(request);
        expect(xhr.send).toHaveBeenCalledWith("Rick");
      });

      describe("when readyState advances to 1", function () {
        var promise;

        beforeEach(function () {
          spyOn($event.Event, 'trigger');
          spyOn($utils.Deferred, 'notify');
          spyOn(XhrDispatcher, '_readyStateGetterProxy').and.returnValue(1);
          promise = xhrDispatcher.dispatch(request);
        });

        it("should trigger EVENT_REQUEST_OPEN", function () {
          xhr.onreadystatechange();
          var calls = $event.Event.trigger.calls.all(),
              event = calls[0].object;
          expect(calls.length).toBe(1);
          expect(event.eventName).toBe('api.request.open');
          expect(event.request).toBe(request);
          expect(event.response).toBeUndefined();
          expect(event.promise).toBe(promise);
          expect(event.xhr).toBe(xhr);
        });

        it("should notify promise", function () {
          xhr.onreadystatechange();
          var calls = $utils.Deferred.notify.calls.all(),
              deferred = calls[0].object,
              event = calls[0].args[0];
          expect(deferred.promise).toBe(promise);
          expect($event.Event.mixedBy(event)).toBeTruthy();
          expect(event.eventName).toBe('api.request.open');
          expect(event.request).toBe(request);
          expect(event.response).toBeUndefined();
          expect(event.promise).toBe(promise);
          expect(event.xhr).toBe(xhr);
        });
      });

      describe("when readyState advances to 2", function () {
        var promise;

        beforeEach(function () {
          spyOn($event.Event, 'trigger');
          spyOn($utils.Deferred, 'notify');
          spyOn(XhrDispatcher, '_readyStateGetterProxy').and.returnValue(2);
          promise = xhrDispatcher.dispatch(request);
        });

        it("should trigger EVENT_REQUEST_SEND", function () {
          xhr.onreadystatechange();
          var calls = $event.Event.trigger.calls.all(),
              event = calls[0].object;
          expect(calls.length).toBe(1);
          expect(event.eventName).toBe('api.request.send');
          expect(event.request).toBe(request);
          expect($api.HttpResponse.mixedBy(event.response)).toBeTruthy();
          expect(event.promise).toBe(promise);
          expect(event.xhr).toBe(xhr);
        });

        it("should notify promise", function () {
          xhr.onreadystatechange();
          var calls = $utils.Deferred.notify.calls.all(),
              deferred = calls[0].object,
              event = calls[0].args[0];
          expect(deferred.promise).toBe(promise);
          expect($event.Event.mixedBy(event)).toBeTruthy();
          expect(event.eventName).toBe('api.request.send');
          expect(event.request).toBe(request);
          expect($api.HttpResponse.mixedBy(event.response)).toBeTruthy();
          expect(event.promise).toBe(promise);
          expect(event.xhr).toBe(xhr);
        });
      });

      describe("when readyState advances to 3", function () {
        var promise;

        beforeEach(function () {
          spyOn($event.Event, 'trigger');
          spyOn($utils.Deferred, 'notify');
          spyOn(XhrDispatcher, '_readyStateGetterProxy').and.returnValue(3);
          promise = xhrDispatcher.dispatch(request);
        });

        it("should trigger EVENT_RESPONSE_PROGRESS", function () {
          xhr.onreadystatechange();
          var calls = $event.Event.trigger.calls.all(),
              event = calls[0].object;
          expect(calls.length).toBe(1);
          expect(event.eventName).toBe('api.response.progress');
          expect(event.request).toBe(request);
          expect(event.xhr).toBe(xhr);
          expect($api.HttpResponse.mixedBy(event.response)).toBeTruthy();
        });

        it("should notify promise", function () {
          xhr.onreadystatechange();
          var calls = $utils.Deferred.notify.calls.all(),
              deferred = calls[0].object,
              event = calls[0].args[0];
          expect(deferred.promise).toBe(promise);
          expect($event.Event.mixedBy(event)).toBeTruthy();
          expect(event.eventName).toBe('api.response.progress');
          expect(event.request).toBe(request);
          expect(event.xhr).toBe(xhr);
          expect($api.HttpResponse.mixedBy(event.response)).toBeTruthy();
        });
      });

      describe("when readyState advances to 4", function () {
        var promise;

        beforeEach(function () {
          spyOn($event.Event, 'trigger');
          spyOn($utils.Deferred, 'resolve');
          spyOn(XhrDispatcher, '_readyStateGetterProxy').and.returnValue(4);
          promise = xhrDispatcher.dispatch(request);
        });

        it("should trigger EVENT_RESPONSE_PROGRESS", function () {
          xhr.onreadystatechange();
          var calls = $event.Event.trigger.calls.all(),
              event = calls[0].object;
          expect(calls.length).toBe(1);
          expect(event.eventName).toBe('api.response.receive');
          expect(event.request).toBe(request);
          expect(event.xhr).toBe(xhr);
          expect($api.HttpResponse.mixedBy(event.response)).toBeTruthy();
        });

        it("should resolve promise", function () {
          xhr.onreadystatechange();
          var calls = $utils.Deferred.resolve.calls.all(),
              deferred = calls[0].object,
              event = calls[0].args[0];
          expect(deferred.promise).toBe(promise);
          expect($event.Event.mixedBy(event)).toBeTruthy();
          expect(event.eventName).toBe('api.response.receive');
          expect(event.request).toBe(request);
          expect(event.xhr).toBe(xhr);
          expect($api.HttpResponse.mixedBy(event.response)).toBeTruthy();
        });
      });
    });
  });

  describe("Dispatcher", function () {
    var dispatcher;

    describe("create()", function () {
      describe("when passing HttpRequest", function () {
        var request;

        beforeEach(function () {
          request = 'foo/bar'.toHttpEndpoint().toRequest();
        });

        it("should return XhrDispatcher instance", function () {
          dispatcher = $api.RequestDispatcher.create({request: request});
          expect($api.XhrDispatcher.mixedBy(dispatcher)).toBeTruthy();
        });
      });
    });
  });
});
