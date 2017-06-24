"use strict";

var $oop = window['giant-oop'],
    $data = window['giant-data'],
    $event = window['giant-event'];

describe("$event", function () {
    describe("EventSpace", function () {
        var EventSpace,
            eventSpace,
            result;

        beforeEach(function () {
            EventSpace = $oop.getClass('test.$event.EventSpace.EventSpace')
                .extend($event.EventSpace);

            eventSpace = EventSpace.create();
        });

        describe("create()", function () {
            it("should initialize subscriptions", function () {
                expect($data.Tree.isIncludedBy(eventSpace.subscriptions))
                    .toBeTruthy();
                expect(eventSpace.subscriptions._data).toEqual({});
            });

            it("should initialize _lastSubscriptionId", function () {
                expect(eventSpace._lastSubscriptionId).toBe(-1);
            });

            describe("then creating another again", function () {
                it("should return the same instance", function () {
                    // todo Revisit once caching propagation is fixed in
                    // $oop.Class
                    $event.EventSpace.__instanceLookup = {};
                    eventSpace = $event.EventSpace.create();
                    expect($event.EventSpace.create()).toBe(eventSpace);
                });
            });
        });

        describe("destroy()", function () {
            beforeEach(function () {
                spyOn(eventSpace.subscriptions, 'destroy');
            });

            it("should destroy subscriptions", function () {
                eventSpace.destroy();
                expect(eventSpace.subscriptions.destroy).toHaveBeenCalled();
            });
        });

        describe("on()", function () {
            var callback;

            beforeEach(function () {
                callback = function () {};
            });

            it("should return self", function () {
                result = eventSpace.on('eventName', callback, 'foo.bar'.toPath(), 'foo');
                expect(result).toBe(eventSpace);
            });

            describe("with subscriptionId", function () {
                beforeEach(function () {
                    result = eventSpace.on('eventName', callback, 'foo.bar'.toPath(), 'foo');
                });

                it("should add to subscriptions", function () {
                    expect(eventSpace.subscriptions._data).toEqual({
                        callbacks: {
                            bySubscription: {
                                eventName: {
                                    'foo.bar': {
                                        foo: callback
                                    }
                                }
                            },
                            bySubscriber: {
                                foo: {
                                    eventName: {
                                        'foo.bar': callback
                                    }
                                }
                            }
                        },
                        paths: {
                            eventName: [
                                'foo.bar'
                            ]
                        }
                    });
                });

                describe("then subscribing again", function () {
                    it("should not change subscriptions", function () {
                        eventSpace.on('eventName', callback, 'foo.bar'.toPath(), 'foo');
                        expect(eventSpace.subscriptions._data).toEqual({
                            callbacks: {
                                bySubscription: {
                                    eventName: {
                                        'foo.bar': {
                                            foo: callback
                                        }
                                    }
                                },
                                bySubscriber: {
                                    foo: {
                                        eventName: {
                                            'foo.bar': callback
                                        }
                                    }
                                }
                            },
                            paths: {
                                eventName: [
                                    'foo.bar'
                                ]
                            }
                        });
                    });
                });
            });

            describe("without subscriptionId", function () {
                beforeEach(function () {
                    result = eventSpace.on('eventName', callback, 'foo.bar'.toPath());
                });

                it("should assign generated subscriptionId", function () {
                    expect(eventSpace.subscriptions._data).toEqual({
                        callbacks: {
                            bySubscription: {
                                eventName: {
                                    'foo.bar': {
                                        0: callback
                                    }
                                }
                            },
                            bySubscriber: {
                                0: {
                                    eventName: {
                                        'foo.bar': callback
                                    }
                                }
                            }
                        },
                        paths: {
                            eventName: [
                                'foo.bar'
                            ]
                        }
                    });
                });

                it("should increment _lastSubscriptionId", function () {
                    expect(eventSpace._lastSubscriptionId).toBe(0);
                });
            });
        });

        describe("off()", function () {
            var callback1, callback2, callback3;

            beforeEach(function () {
                callback1 = function () {};
                callback2 = function () {};
                callback3 = function () {};
                result = eventSpace
                    .on('event1', callback1, 'foo.bar.baz'.toPath(), 'subscriber1')
                    .on('event1', callback2, 'foo.bar.quux'.toPath(), 'subscriber2')
                    .on('event2', callback3, 'foo.baz'.toPath(), 'subscriber1');
            });

            it("should return self", function () {
                result = eventSpace.off('event1', callback1, 'foo.bar.baz'.toPath(), 'subscriber1');
                expect(result).toBe(eventSpace);
            });

            describe("when all arguments are specified", function () {
                it("should remove entries from registry", function () {
                    eventSpace.off('event1', callback1, 'foo.bar.baz'.toPath(), 'subscriber1');
                    expect(eventSpace.subscriptions._data).toEqual({
                        callbacks: {
                            bySubscription: {
                                event1: {
                                    'foo.bar.quux': {
                                        subscriber2: callback2
                                    }
                                },
                                event2: {
                                    'foo.baz': {
                                        subscriber1: callback3
                                    }
                                }
                            },
                            bySubscriber: {
                                subscriber1: {
                                    event2: {
                                        'foo.baz': callback3
                                    }
                                },
                                subscriber2: {
                                    event1: {
                                        'foo.bar.quux': callback2
                                    }
                                }
                            }
                        },
                        paths: {
                            event1: [
                                'foo.bar.quux'
                            ],
                            event2: [
                                'foo.baz'
                            ]
                        }
                    });
                });
            });

            describe("when subscriberId is specified", function () {
                it("should remove entries from registry", function () {
                    eventSpace.off(undefined, undefined, undefined, 'subscriber1');
                    expect(eventSpace.subscriptions._data).toEqual({
                        callbacks: {
                            bySubscription: {
                                event1: {
                                    'foo.bar.quux': {
                                        subscriber2: callback2
                                    }
                                }
                            },
                            bySubscriber: {
                                subscriber2: {
                                    event1: {
                                        'foo.bar.quux': callback2
                                    }
                                }
                            }
                        },
                        paths: {
                            event1: [
                                'foo.bar.quux'
                            ]
                        }
                    });
                });

                describe("when eventName is also specified", function () {
                    it("should remove entries from registry", function () {
                        eventSpace.off('event1', undefined, undefined, 'subscriber1');
                        expect(eventSpace.subscriptions._data).toEqual({
                            callbacks: {
                                bySubscription: {
                                    event1: {
                                        'foo.bar.quux': {
                                            subscriber2: callback2
                                        }
                                    },
                                    event2: {
                                        'foo.baz': {
                                            subscriber1: callback3
                                        }
                                    }
                                },
                                bySubscriber: {
                                    subscriber1: {
                                        event2: {
                                            'foo.baz': callback3
                                        }
                                    },
                                    subscriber2: {
                                        event1: {
                                            'foo.bar.quux': callback2
                                        }
                                    }
                                }
                            },
                            paths: {
                                event1: [
                                    'foo.bar.quux'
                                ],
                                event2: [
                                    'foo.baz'
                                ]
                            }
                        });
                    });
                });
            });

            describe("when eventName is specified", function () {
                it("should remove entries from registry", function () {
                    eventSpace.off('event1');
                    expect(eventSpace.subscriptions._data).toEqual({
                        callbacks: {
                            bySubscription: {
                                event2: {
                                    'foo.baz': {
                                        subscriber1: callback3
                                    }
                                }
                            },
                            bySubscriber: {
                                subscriber1: {
                                    event2: {
                                        'foo.baz': callback3
                                    }
                                }
                            }
                        },
                        paths: {
                            event2: [
                                'foo.baz'
                            ]
                        }
                    });
                });

                describe("when targetPath is also specified", function () {
                    it("should remove entries from registry", function () {
                        eventSpace.off('event1', undefined, 'foo.bar.baz'.toPath());
                        expect(eventSpace.subscriptions._data).toEqual({
                            callbacks: {
                                bySubscription: {
                                    event1: {
                                        'foo.bar.quux': {
                                            subscriber2: callback2
                                        }
                                    },
                                    event2: {
                                        'foo.baz': {
                                            subscriber1: callback3
                                        }
                                    }
                                },
                                bySubscriber: {
                                    subscriber1: {
                                        event2: {
                                            'foo.baz': callback3
                                        }
                                    },
                                    subscriber2: {
                                        event1: {
                                            'foo.bar.quux': callback2
                                        }
                                    }
                                }
                            },
                            paths: {
                                event1: [
                                    'foo.bar.quux'
                                ],
                                event2: [
                                    'foo.baz'
                                ]
                            }
                        });
                    });
                });
            });

            describe("when nothing is specified", function () {
                it("should throw", function () {
                    expect(function () {
                        eventSpace.off();
                    }).toThrow();
                });
            });
        });
    });
});
